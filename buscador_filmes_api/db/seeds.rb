require 'csv'

csv_path = Rails.root.join('db', 'movies.csv')

unless File.exist?(csv_path)
  puts "Erro: O arquivo movies.csv não foi encontrado em db/"
  exit
end

puts "Limpando registros antigos no PostgreSQL..."
Movie.destroy_all

puts "Importando filmes com o mapeamento correto..."

csv_text = File.read(csv_path)
csv = CSV.parse(csv_text, headers: true, encoding: 'UTF-8')

csv.each do |row|
  # Extrai apenas o ano (YYYY) do campo 'release_date'
  year = row['release_date'].present? ? row['release_date'].slice(0, 4).to_i : nil

  Movie.create!(
    title: row['title'],
    genre: row['genres'],
    release_year: year,
    description: row['overview'],
    rating: row['vote_average']
  )
end

puts "Sucesso! Total de filmes cadastrados: #{Movie.count}"