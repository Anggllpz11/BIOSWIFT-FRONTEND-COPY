import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './styles/SearchOrdenes.css';

interface SearchOrdenesProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  setSearchResults: (results: any[]) => void;
  handleSearch: (keyword: string) => Promise<void>;
}

const SearchOrdenes: React.FC<SearchOrdenesProps> = ({ handleSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(keyword);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
    setKeyword(''); // Clear the input when toggling
  };

  return (
    <div className="SearchOrdenes-search-container">
      <form onSubmit={handleSubmit} className={`search-form ${showInput ? 'expanded' : ''}`}>
        <IconButton
          className="SearchOrdenes-search-icon-button"
          type="button"
          aria-label="search"
          onClick={toggleInput}
        >
          {showInput ? <CloseIcon className="SearchOrdenes-search-icon" /> : <SearchIcon className="SearchOrdenes-search-icon" />}
        </IconButton>
        <input
          type="text"
          placeholder="SEARCH..."
          className={`SearchOrdenes-search-input ${showInput ? 'visible' : ''}`}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchOrdenes;
