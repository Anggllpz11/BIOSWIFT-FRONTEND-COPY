import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import './styles/SearchRepuestosEquipos.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchRepuestosEquiposByKeyword } from '../../services/searchEquiposService';
import RepuestoEquipoCard from '../RepuestosEquipos/RepuestoEquipoCard';

interface SearchRepuestosEquiposProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchRepuestosEquipos: React.FC<SearchRepuestosEquiposProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchRepuestosEquiposByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToRepuestoEquipoDetail = (id: string) => {
    navigate(`/repuestos-equipos/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchRepuestosEquipos-section'>
        <div className='SearchRepuestosEquipos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchRepuestosEquipos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchRepuestosEquipos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchRepuestosEquipos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='EquiposPages-Container-Card'>
            {searchResults.map((repuestoEquipo) => (
              <RepuestoEquipoCard key={repuestoEquipo._id} repuestoEquipo={repuestoEquipo} onClick={() => navigateToRepuestoEquipoDetail(repuestoEquipo._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchRepuestosEquipos;
