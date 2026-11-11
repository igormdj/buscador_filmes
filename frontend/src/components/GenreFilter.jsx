import { GENRES } from '../constants/genres';

export default function GenreFilter({ selectedGenre, onSelectGenre }) {
  return (
    <div role="group" aria-label="Filtros de gênero" className="genre-group">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelectGenre(genre)}
          aria-pressed={selectedGenre === genre}
          className={`genre-btn ${selectedGenre === genre ? 'genre-btn--active' : ''}`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}