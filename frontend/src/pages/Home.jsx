import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { Search, Film, Star, AlertTriangle, RefreshCw } from 'lucide-react';
import '../App.css'; // Importa as classes CSS

const GENRES = ['Todos', 'Ação', 'Aventura', 'Animação', 'Comédia', 'Drama', 'Fantasia', 'Ficção Científica'];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const fetchMovies = async (searchQuery = '', genre = 'Todos', signal = null) => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (genre !== 'Todos') params.genre = genre;

      const response = await api.get('/movies', { params, signal });
      setMovies(response.data);
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError') return;
      console.error('Erro ao buscar filmes:', err);
      setError('Não foi possível carregar os filmes. Verifique se o servidor backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchMovies(query, selectedGenre, controller.signal);
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedGenre]);

  return (
    <div className="app-container">
      
      <header className="app-header">
        <h1 className="app-title">🎬 Buscador de Filmes</h1>
        
        <div className="search-controls">
          
          <div className="search-input-wrapper">
            <label htmlFor="movie-search" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
              Buscar filmes por título
            </label>
            <input
              id="movie-search"
              type="search"
              className="search-input"
              aria-label="Buscar filmes por título"
              placeholder="Digite o título, ator ou diretor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search size={20} className="search-icon" />
          </div>

          <div role="group" aria-label="Filtros de gênero" className="genre-group">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                aria-pressed={selectedGenre === genre}
                className={`genre-btn ${selectedGenre === genre ? 'genre-btn--active' : ''}`}
              >
                {genre}
              </button>
            ))}
          </div>
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
            <button onClick={() => fetchMovies(query, selectedGenre)} className="retry-button">
              <RefreshCw size={16} /> Tentar novamente
            </button>
          </div>
        ) : movies.length === 0 ? (
          <p className="state-message">Nenhum filme encontrado.</p>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalhes do filme ${movie.title}`}
                className="movie-card"
                onClick={() => navigate(`/movies/${movie.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/movies/${movie.id}`);
                  }
                }}
              >
                {movie.poster_url && movie.poster_url !== 'N/A' ? (
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}