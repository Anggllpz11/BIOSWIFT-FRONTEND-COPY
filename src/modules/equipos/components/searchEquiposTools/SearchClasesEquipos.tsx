import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/SearchClasesEquipos.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchClasesEquiposByKeyword } from '../../services/searchEquiposService';
import ClaseEquipoCard from '../clasesEquipos/ClaseEquipoCard';
import { useNavigate } from 'react-router-dom';

interface SearchClasesEquiposProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchClasesEquipos: React.FC<SearchClasesEquiposProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchClasesEquiposByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToClaseDetail = (id: string) => {
    navigate(`/equipos/clases/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchClasesEquipos-section'>
        <div className='SearchClasesEquipos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchClasesEquipos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchClasesEquipos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchClasesEquipos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='ClasesEquipos-Container-Card'>
            {searchResults.map((claseEquipo) => (
              <ClaseEquipoCard key={claseEquipo._id} claseEquipo={claseEquipo} onViewDetails={() => navigateToClaseDetail(claseEquipo._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchClasesEquipos;
