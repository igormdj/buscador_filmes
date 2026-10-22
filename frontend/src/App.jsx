import { useState, useEffect } from 'react';
import api from './services/api';
import { Search, Film, Star, X } from 'lucide-react';
import './App.css';

// Lista de gêneros populares para o filtro
const GENRES = ['Todos', 'Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Fantasy', 'Science Fiction'];

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // Para o Modal de detalhes

  // Função para buscar filmes da API Rails
  const fetchMovies = async (searchQuery = '', genre = 'Todos') => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (genre !== 'Todos') params.genre = genre;

      const response = await api.get('/movies', { params });
      setMovies(response.data);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce na busca por texto e mudança de gênero
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(query, selectedGenre);
    }, 400); // Aguarda 400ms após a última digitação

    return () => clearTimeout(timer);
  }, [query, selectedGenre]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* HEADER E BUSCA */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🎬 Buscador de Filmes</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          {/* Input de Busca */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Digite para buscar instantaneamente..."
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

          {/* Botoes de Filtro de Gênero */}
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
                  fontWeight: selectedGenre === genre ? 'bold' : 'normal',
                  transition: 'background 0.2s'
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* LISTA DE FILMES */}
      <main>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>Buscando filmes...</p>
        ) : movies.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>Nenhum filme encontrado.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #2a2a2a',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                {/* Capa/Poster */}
                {movie.poster_url && movie.poster_url !== 'N/A' ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    style={{ width: '100%', height: '280px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '280px', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={40} color="#555" />
                  </div>
                )}

                {/* Conteúdo do Card */}
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

      {/* MODAL DE DETALHES DO FILME */}
      {selectedMovie && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#222',
            maxWidth: '600px',
            width: '100%',
            borderRadius: '12px',
            padding: '25px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setSelectedMovie(null)}
              style={{
                position: 'absolute',
                top: '15px', right: '15px',
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {selectedMovie.poster_url && selectedMovie.poster_url !== 'N/A' && (
                <img
                  src={selectedMovie.poster_url}
                  alt={selectedMovie.title}
                  style={{ width: '150px', height: '225px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 10px 0' }}>{selectedMovie.title}</h2>
                <p style={{ color: '#aaa', margin: '4px 0' }}><strong>Ano:</strong> {selectedMovie.release_year || 'N/A'}</p>
                <p style={{ color: '#aaa', margin: '4px 0' }}><strong>Gênero:</strong> {selectedMovie.genre || 'N/A'}</p>
                {selectedMovie.rating && (
                  <p style={{ color: '#f3ce13', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={16} fill="#f3ce13" /> <strong>Nota:</strong> {selectedMovie.rating}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>Sinopse</h4>
              <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95rem' }}>
                {selectedMovie.description || 'Nenhuma sinopse disponível para este filme.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;