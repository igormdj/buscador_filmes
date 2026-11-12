module Api
  module V1
    class MoviesController < ApplicationController
      def index
       movies = Movie.search_title(params[:query])
                .with_genre(params[:genre])
                .order(rating: :desc, id: :asc)
                .limit(20)

        render json: movies.map(&:as_api_json)
      end

      def show
        movie = Movie.find_by(id: params[:id])

        if movie
          render json: movie.as_api_json
        else
          render json: { error: "Filme não encontrado" }, status: :not_found
        end
      end
    end
  end
end