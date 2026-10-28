namespace :posters do
  desc "Busca e atualiza os pôsteres dos filmes que ainda não possuem capa"
  task fetch: :environment do
    puts "Iniciando a busca de pôsteres na OMDb..."
    
    # Seleciona apenas filmes com poster_url nulo ou em branco
    movies_to_update = Movie.where(poster_url: [nil, ""])
    total = movies_to_update.count
    puts "Encontrados #{total} filmes pendentes de capa."

    updated_count = 0
    not_found_count = 0

    movies_to_update.find_each do |movie|
      poster = OmdbService.fetch_poster(movie.title)

      if poster.present?
        movie.update(poster_url: poster)
        updated_count += 1
        puts "✅ Pôster atualizado: #{movie.title}"
      else
        # Se a OMDb não encontrou, marca como "N/A" para não tentar novamente
        movie.update(poster_url: "N/A")
        not_found_count += 1
        puts "⚠️ Pôster não encontrado (marcado N/A): #{movie.title}"
      end

      sleep(0.1) # Evita sobrecarregar a API externa
    end

    puts "\nProcesso concluído!"
    puts "Total atualizado: #{updated_count}"
    puts "Total marcado como N/A: #{not_found_count}"
  end
end