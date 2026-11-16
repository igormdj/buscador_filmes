require "test_helper"

class OmdbServiceTest < ActiveSupport::TestCase
  test "retorna url do poster quando API responde com sucesso" do
    fake_response = Struct.new(:success?, :body) do
      def [](key)
        { "Response" => "True", "Poster" => "https://img.omdb.com/poster.jpg" }[key]
      end
    end.new(true, "")

    ENV["OMDB_API_KEY"] = "chave_teste"

    # Guarda o método original do HTTParty e substitui temporariamente
    original_get = HTTParty.method(:get)
    HTTParty.define_singleton_method(:get) { |*_args, **_kwargs| fake_response }

    poster = OmdbService.fetch_poster("Avatar")
    assert_equal "https://img.omdb.com/poster.jpg", poster
  ensure
    # Restaura o método original e limpa a variável de ambiente
    HTTParty.define_singleton_method(:get, original_get) if original_get
    ENV.delete("OMDB_API_KEY")
  end

  test "retorna nil sem fazer requisicao quando OMDB_API_KEY esta ausente" do
    ENV.delete("OMDB_API_KEY")
    poster = OmdbService.fetch_poster("Avatar")
    assert_nil poster
  end
end