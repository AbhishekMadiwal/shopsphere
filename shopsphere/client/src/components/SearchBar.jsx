import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = ({ initialValue = '', onSearch = null, placeholder = 'Search products...', variant = 'default' }) => {
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    } else {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const isHero = variant === 'hero';

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="d-flex align-items-center"
        style={{
          background: isHero ? 'rgba(255,255,255,0.08)' : '#fff',
          border: focused
            ? `1.5px solid ${isHero ? 'rgba(200,169,126,0.5)' : '#C8A97E'}`
            : `1.5px solid ${isHero ? 'rgba(255,255,255,0.12)' : '#e0e0e0'}`,
          borderRadius: '50px',
          padding: '0.5rem 0.5rem 0.5rem 1.25rem',
          transition: 'all 0.3s',
          boxShadow: focused ? '0 0 0 3px rgba(200,169,126,0.12)' : 'none',
        }}
      >
        <Search size={18} color={isHero ? 'rgba(255,255,255,0.4)' : '#999'} className="flex-shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            flex: 1,
            padding: '0.35rem 0.75rem',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-family)',
            color: isHero ? '#fff' : '#1a1a1a',
          }}
        />
        <button
          type="submit"
          className="btn d-flex align-items-center gap-1"
          style={{
            background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
            color: '#fff',
            borderRadius: '50px',
            padding: '0.45rem 1.25rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
