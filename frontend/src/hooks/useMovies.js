import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import axios from 'axios';

export function useMovies(query, selectedGenre) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async (searchQuery = query, genre = selectedGenre, signal = null) => {
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
  }, [query, selectedGenre]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchMovies(query, selectedGenre, controller.signal);
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedGenre, fetchMovies]);

  return {
    movies,
    loading,
    error,
    retry: () => fetchMovies(query, selectedGenre)
  };
}