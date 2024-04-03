import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/SearchMarcasEquipos.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchMarcasEquiposByKeyword } from '../../services/searchEquiposService';
import MarcaEquipoCard from '../marcasEquipos/MarcaEquipoCard';
import { useNavigate } from 'react-router-dom';

interface SearchMarcasEquiposProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchMarcasEquipos: React.FC<SearchMarcasEquiposProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchMarcasEquiposByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToMarcaDetail = (id: string) => {
    navigate(`/equipos/marcas/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchMarcasEquipos-section'>
        <div className='SearchMarcasEquipos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchMarcasEquipos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchMarcasEquipos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchMarcasEquipos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='MarcasEquipos-Container-Card'>
            {searchResults.map((marcaEquipo) => (
              <MarcaEquipoCard key={marcaEquipo._id} marcaEquipo={marcaEquipo} onViewDetails={() => navigateToMarcaDetail(marcaEquipo._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchMarcasEquipos;
