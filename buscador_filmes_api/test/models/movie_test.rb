require "test_helper"

class MovieTest < ActiveSupport::TestCase
  test "search_title busca por parte do titulo ignorando maiusculas e minusculas" do
    results = Movie.search_title("dark")
    assert_includes results, movies(:dark_knight)
    assert_not_includes results, movies(:avatar)
  end

  test "search_title escapa caracteres curinga como porcentagem" do
    results = Movie.search_title("%")
    assert_empty results
  end

  test "with_genre encontra filmes que possuem o genero em lista composta" do
    results = Movie.with_genre("Action")
    assert_includes results, movies(:avatar)
    assert_includes results, movies(:dark_knight)
    assert_not_includes results, movies(:indie_drama)
  end

  test "as_api_json retorna apenas os campos do contrato e rating numerico" do
    json = movies(:dark_knight).as_api_json

    expected_keys = %w[id title genre release_year description poster_url rating]
    assert_equal expected_keys.sort, json.keys.sort
    assert_instance_of Float, json["rating"]
    assert_equal 9.0, json["rating"]
  end
end