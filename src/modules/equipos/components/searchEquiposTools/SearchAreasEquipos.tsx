import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/SearchAreasEquipos.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchAreasEquiposByKeyword } from '../../services/searchEquiposService';
import AreaEquipoCard from '../areasEquipos/AreaEquipoCard';
import { useNavigate } from 'react-router-dom';

interface SearchAreasEquiposProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchAreasEquipos: React.FC<SearchAreasEquiposProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchAreasEquiposByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };
  const navigateToAreaDetail = (id: string) => {
    // Define la navegación para ver los detalles del modelo (ajusta según tus rutas)
    navigate(`/equipos/areas/${id}`);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchAreasEquipos-section'>
        <div className='SearchAreasEquipos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchAreasEquipos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchAreasEquipos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchAreasEquipos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='AreasEquipos-Container-Card'>
            {searchResults.map((areaEquipo) => (
              <AreaEquipoCard key={areaEquipo._id} areaEquipo={areaEquipo} onViewDetails={() => navigateToAreaDetail(areaEquipo._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchAreasEquipos;
