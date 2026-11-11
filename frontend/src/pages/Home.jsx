import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import MovieGrid from '../components/MovieGrid';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import '../App.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const { movies, loading, error, retry } = useMovies(query, selectedGenre);
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🎬 Buscador de Filmes</h1>
        <div className="search-controls">
          <SearchBar value={query} onChange={setQuery} />
          <GenreFilter selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />
        </div>
      </header>

      <main>
        {loading ? (
          <p className="state-message">A carregar filmes...</p>
        ) : error ? (
          <div className="error-card">
            <AlertTriangle size={48} color="var(--color-primary)" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0' }}>Ops! Algo deu errado</h3>
            <p className="state-message" style={{ marginTop: 0, marginBottom: '20px' }}>{error}</p>
            <button onClick={retry} className="retry-button">
              <RefreshCw size={16} /> Tentar novamente
            </button>
          </div>
        ) : (
          <MovieGrid movies={movies} onSelectMovie={(id) => navigate(`/movies/${id}`)} />
        )}
      </main>
    </div>
  );
}