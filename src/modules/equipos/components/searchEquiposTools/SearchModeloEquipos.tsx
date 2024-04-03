import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import './styles/SearchModeloEquipos.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchModelosEquiposByKeyword } from '../../services/searchEquiposService';
import EquipoModeloCard from '../equiposModelos/EquipoModeloCard';

interface SearchModelosEquiposProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchModelosEquipos: React.FC<SearchModelosEquiposProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchModelosEquiposByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToModeloDetail = (id: string) => {
    // Define la navegación para ver los detalles del modelo (ajusta según tus rutas)
    navigate(`/equipos/modelo/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchModeloEquipos-section'>
        <div className='SearchModeloEquipos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchModeloEquipos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchModeloEquipos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchModeloEquipos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='EquiposPages-Container-Card'>
            {searchResults.map((modeloEquipo) => (
              <EquipoModeloCard
                key={modeloEquipo._id}
                modeloEquipo={modeloEquipo}
                onViewDetails={() => navigateToModeloDetail(modeloEquipo._id)}
              />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchModelosEquipos;
