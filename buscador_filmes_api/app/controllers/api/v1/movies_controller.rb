module Api
  module V1
    class MoviesController < ApplicationController
      def index
        @movies = Movie.all

        if params[:query].present?
          @movies = @movies.where("title ILIKE ?", "%#{Movie.sanitize_sql_like(params[:query])}%")
        end

        if params[:genre].present?
          sanitized_genre = Movie.sanitize_sql_like(params[:genre])
          @movies = @movies.where("genre ILIKE ?", "%#{sanitized_genre}%")
        end

        # Mapeia os filmes e busca o pôster caso ainda não esteja salvo
        movies_with_posters = @movies.limit(20).map do |movie|
          if movie.poster_url.blank?
            poster = OmdbService.fetch_poster(movie.title)
            movie.update(poster_url: poster) if poster.present?
          end
          movie
        end

        render json: movies_with_posters
      end

      def show
        movie = Movie.find_by(id: params[:id])

        if movie
          if movie.poster_url.blank?
            poster = OmdbService.fetch_poster(movie.title)
            movie.update(poster_url: poster) if poster.present?
          end
          render json: movie
        else
          render json: { error: "Filme não encontrado" }, status: :not_found
        end
      end
    end
  end
end