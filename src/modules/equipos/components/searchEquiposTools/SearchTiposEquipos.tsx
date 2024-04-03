import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/SearchTiposEquipos.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchTiposEquiposByKeyword } from '../../services/searchEquiposService';
import TipoEquipoCard from '../tiposEquipos/TipoEquipoCard';
import { useNavigate } from 'react-router-dom';

interface SearchTiposEquiposProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchTiposEquipos: React.FC<SearchTiposEquiposProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchTiposEquiposByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToTipoDetail = (id: string) => {
    navigate(`/equipos/tipos/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchTiposEquipos-section'>
        <div className='SearchTiposEquipos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchTiposEquipos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchTiposEquipos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchTiposEquipos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='TiposEquipos-Container-Card'>
            {searchResults.map((tipoEquipo) => (
              <TipoEquipoCard key={tipoEquipo._id} tipoEquipo={tipoEquipo} onViewDetails={() => navigateToTipoDetail(tipoEquipo._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchTiposEquipos;
