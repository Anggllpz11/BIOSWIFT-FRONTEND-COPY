import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import './styles/SearchEquipos.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchEquiposByKeyword } from '../../services/searchEquiposService';
import EquipoCard from '../equipos/EquipoCard';

interface SearchEquiposProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchEquipos: React.FC<SearchEquiposProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchEquiposByKeyword(loggedIn, keyword); // Llama a la función de búsqueda de equipos
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToEquipoDetail = (id: string) => {
    navigate(`/equipos/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que el formulario se envíe
    handleSearch(); // Llama a la función de búsqueda al presionar "Enter"
  };

  return (
    <div>
      <div className='SearchEquipos-section'>
        <div className='SearchEquipos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchEquipos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchEquipos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchEquipos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='EquiposPages-Container-Card'>
            {searchResults.map((equipo) => (
              <EquipoCard key={equipo._id} equipo={equipo} onClick={() => navigateToEquipoDetail(equipo._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchEquipos;
