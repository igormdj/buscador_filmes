import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-input-wrapper">
      <label
        htmlFor="movie-search"
        style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}
      >
        Buscar filmes por título
      </label>
      <input
        id="movie-search"
        type="search"
        className="search-input"
        aria-label="Buscar filmes por título"
        placeholder="Digite o título, ator ou diretor..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search size={20} className="search-icon" />
    </div>
  );
}