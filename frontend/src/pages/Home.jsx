import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { Search, Film, Star, AlertTriangle, RefreshCw } from 'lucide-react';

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
      if (axios.isCancel(err) || err.name === 'CanceledError') {
        return;
      }
      
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* HEADER E BUSCA */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🎬 Buscador de Filmes</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Digite o título, ator ou diretor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px 12px 45px',
                borderRadius: '25px',
                border: '1px solid #444',
                background: '#222',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <Search size={20} color="#888" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedGenre === genre ? '#e50914' : '#333',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: selectedGenre === genre ? 'bold' : 'normal'
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>A carregar filmes...</p>
        ) : error ? (
          <div style={{ textAlign: 'center', marginTop: '40px', padding: '30px', background: '#2a1a1a', borderRadius: '12px', border: '1px solid #552222' }}>
            <AlertTriangle size={48} color="#e50914" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Ops! Algo deu errado</h3>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={() => fetchMovies(query, selectedGenre)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '20px', border: 'none',
                background: '#e50914', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              <RefreshCw size={16} /> Tentar novamente
            </button>
          </div>
        ) : movies.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>Nenhum filme encontrado.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movies/${movie.id}`)}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #2a2a2a',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                {movie.poster_url && movie.poster_url !== 'N/A' ? (
                  <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '280px', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={40} color="#555" />
                  </div>
                )}

                <div style={{ padding: '12px' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {movie.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#aaa', fontSize: '0.8rem' }}>
                    <span>{movie.release_year || 'N/A'}</span>
                    {movie.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f3ce13' }}>
                        <Star size={14} fill="#f3ce13" /> {movie.rating}
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