class TmdbService
  BASE_URL = "https://api.themoviedb.org/3"
  IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500" # Tamanho w500 tem boa resolução
  API_KEY = ENV.fetch("TMDB_API_KEY", "sua_chave_aqui")

  def self.fetch_poster(title)
    return nil if title.blank?

    # Faz busca no TMDB
    response = HTTParty.get("#{BASE_URL}/search/movie", query: {
      api_key: API_KEY,
      query: title,
      language: "en-US"
    })

    if response.success? && response["results"].present?
      first_result = response["results"].first
      poster_path = first_result["poster_path"]

      return "#{IMAGE_BASE_URL}#{poster_path}" if poster_path.present?
    end

    nil
  rescue StandardError => e
    Rails.logger.error "Erro no TmdbService: #{e.message}"
    nil
  end
end