import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Star, Film } from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', color: '#fff', marginTop: '50px' }}>A carregar detalhes...</p>;
  if (!movie) return <p style={{ textAlign: 'center', color: '#fff', marginTop: '50px' }}>Filme não encontrado.</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', color: '#fff', fontFamily: 'sans-serif' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#333', color: '#fff', border: 'none',
          padding: '10px 18px', borderRadius: '20px', cursor: 'pointer', marginBottom: '25px'
        }}
      >
        <ArrowLeft size={18} /> Voltar ao Catálogo
      </button>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
        {movie.poster_url && movie.poster_url !== 'N/A' ? (
          <img src={movie.poster_url} alt={movie.title} style={{ width: '220px', height: '330px', objectFit: 'cover', borderRadius: '8px' }} />
        ) : (
          <div style={{ width: '220px', height: '330px', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
            <Film size={50} color="#555" />
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 15px 0', fontSize: '2rem' }}>{movie.title}</h1>
          <p style={{ color: '#aaa', margin: '6px 0' }}><strong>Ano de Lançamento:</strong> {movie.release_year || 'N/A'}</p>
          <p style={{ color: '#aaa', margin: '6px 0' }}><strong>Gênero:</strong> {movie.genre || 'N/A'}</p>
          
          {movie.rating && (
            <p style={{ color: '#f3ce13', margin: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={18} fill="#f3ce13" /> <strong>Nota:</strong> {movie.rating} / 10
            </p>
          )}

          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Sinopse</h3>
            <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {movie.description || 'Nenhuma sinopse disponível para este filme.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}