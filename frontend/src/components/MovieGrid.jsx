import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onSelectMovie }) {
  if (movies.length === 0) {
    return <p className="state-message">Nenhum filme encontrado.</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onSelectMovie(movie.id)}
        />
      ))}
    </div>
  );
}