class OmdbService
  BASE_URL = "http://www.omdbapi.com/"
  API_KEY = ENV.fetch("OMDB_API_KEY", "SUA_CHAVE_OMDB_AQUI")

  def self.fetch_poster(title)
    return nil if title.blank?

    # 1. Tenta a busca direta pelo título
    response = HTTParty.get(BASE_URL, query: { t: title, apikey: API_KEY })

    if valid_poster?(response)
      return response["Poster"]
    end

    # 2. Se falhar, pega apenas a primeira parte do título (antes dos dois-pontos ou vírgula)
    clean_title = title.split(/[:,-]/).first.strip
    response = HTTParty.get(BASE_URL, query: { t: clean_title, apikey: API_KEY })

    if valid_poster?(response)
      return response["Poster"]
    end

    # 3. Se ainda assim falhar, tenta a busca por lista (s=)
    search_response = HTTParty.get(BASE_URL, query: { s: clean_title, apikey: API_KEY })
    if search_response.success? && search_response["Search"].present?
      first_match_id = search_response["Search"].first["imdbID"]
      id_response = HTTParty.get(BASE_URL, query: { i: first_match_id, apikey: API_KEY })
      return id_response["Poster"] if valid_poster?(id_response)
    end

    nil
  rescue StandardError => e
    Rails.logger.error "Erro no OmdbService: #{e.message}"
    nil
  end

  private

  def self.valid_poster?(response)
    response.success? && response["Response"] == "True" && response["Poster"].present? && response["Poster"] != "N/A"
  end
end