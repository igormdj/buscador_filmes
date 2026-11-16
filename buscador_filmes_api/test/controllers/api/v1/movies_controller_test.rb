require "test_helper"

module Api
  module V1
    class MoviesControllerTest < ActionDispatch::IntegrationTest
      test "index retorna filmes ordenados por nota decrescente" do
        get api_v1_movies_url
        assert_response :success

        json = JSON.parse(response.body)
        assert_equal 3, json.size
        # The Dark Knight (9.0) deve vir antes de Avatar (7.9) e Quiet Story (6.5)
        assert_equal "The Dark Knight", json.first["title"]
        assert_equal "Quiet Story", json.last["title"]
      end

      test "index filtra por query no titulo" do
        get api_v1_movies_url, params: { query: "Avatar" }
        assert_response :success

        json = JSON.parse(response.body)
        assert_equal 1, json.size
        assert_equal "Avatar", json.first["title"]
      end

      test "index filtra por genre composto" do
        get api_v1_movies_url, params: { genre: "Action" }
        assert_response :success

        json = JSON.parse(response.body)
        titles = json.map { |m| m["title"] }
        assert_includes titles, "Avatar"
        assert_includes titles, "The Dark Knight"
        assert_not_includes titles, "Quiet Story"
      end

      test "index combina filtros de query e genre" do
        get api_v1_movies_url, params: { query: "Dark", genre: "Action" }
        assert_response :success

        json = JSON.parse(response.body)
        assert_equal 1, json.size
        assert_equal "The Dark Knight", json.first["title"]
      end

      test "index respeita o limite maximo de 20 filmes" do
        22.times do |i|
          Movie.create!(title: "Filme Extra #{i}", genre: "Comedy", rating: 5.0)
        end

        get api_v1_movies_url
        assert_response :success

        json = JSON.parse(response.body)
        assert_equal 20, json.size
      end

      test "show retorna 200 e os dados do filme quando encontrado" do
        movie = movies(:avatar)
        get api_v1_movie_url(movie)
        assert_response :success

        json = JSON.parse(response.body)
        assert_equal "Avatar", json["title"]
        assert_equal 7.9, json["rating"]
      end

      test "show retorna 404 quando filme nao existe" do
        get api_v1_movie_url(id: 999_999)
        assert_response :not_found

        json = JSON.parse(response.body)
        assert_equal "Filme não encontrado", json["error"]
      end
    end
  end
end