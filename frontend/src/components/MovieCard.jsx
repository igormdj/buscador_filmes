import { Film, Star } from 'lucide-react';

export default function MovieCard({ movie, onClick }) {
  const hasValidPoster = movie.poster_url && movie.poster_url !== 'N/A';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes do filme ${movie.title}`}
      className="movie-card"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {hasValidPoster ? (
        <img src={movie.poster_url} alt={`Pôster do filme ${movie.title}`} className="movie-card__poster" />
      ) : (
        <div className="movie-card__placeholder">
          <Film size={40} color="#555" />
        </div>
      )}

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__meta">
          <span>{movie.release_year || 'N/A'}</span>
          {movie.rating && (
            <span className="movie-card__rating">
              <Star size={14} fill="var(--color-star)" /> {movie.rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}