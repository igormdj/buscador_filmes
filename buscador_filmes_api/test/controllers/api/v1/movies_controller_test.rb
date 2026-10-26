require "test_helper"

class Api::V1::MoviesControllerTest < ActionDispatch::IntegrationTest
  test "deve filtrar filmes por genero contido na lista" do
    # Garante que um filme com gêneros compostos é retornado na busca
    Movie.create!(title: "Filme de Teste", genre: "Action Adventure", release_year: 2024)

    get api_v1_movies_url, params: { genre: "Action" }

    assert_response :success
    json_response = JSON.parse(response.body)
    
    assert json_response.any? { |m| m["title"] == "Filme de Teste" }
  end
end