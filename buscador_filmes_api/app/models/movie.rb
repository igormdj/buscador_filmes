class Movie < ApplicationRecord

    scope :search_title, -> (query) {
        return all if query.blank?

        sanitized = sanitize_sql_like(query.strip)
        where("title ILIKE ?", "%#{sanitized}%")
    }

    scope :with_genre, ->(genre) {
        return all if genre.blank?

        sanitized = sanitize_sql_like(genre.strip)
        where("genre ILIKE ?", "%#{sanitized}%")
    }

    def as_api_json
        as_json(only: %i[id title genre release_year description poster_url]).merge(
            "rating" => rating&.to_f)
    end
end
