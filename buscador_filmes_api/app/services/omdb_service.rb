class OmdbService
  BASE_URL = "https://www.omdbapi.com/".freeze

  def self.fetch_poster(title)
    return nil if title.blank?

    api_key = ENV.fetch("OMDB_API_KEY", nil)
    if api_key.blank?
      Rails.logger.error "[OmdbService] ERRO CRÍTICO: A variável OMDB_API_KEY não foi configurada!"
      return nil
    end

    response = HTTParty.get(BASE_URL, query: { t: title, apikey: api_key }, timeout: 3)

    if valid_poster?(response)
      response["Poster"]
    else
      nil
    end
  rescue StandardError => e
    Rails.logger.error "[OmdbService] Erro ao buscar pôster para '#{title}': #{e.message}"
    nil
  end

  private

  def self.valid_poster?(response)
    response.success? && response["Response"] == "True" && response["Poster"].present? && response["Poster"] != "N/A"
  end
end