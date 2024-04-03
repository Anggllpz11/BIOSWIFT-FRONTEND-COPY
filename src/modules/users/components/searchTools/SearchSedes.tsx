import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { searchSedesByKeyword } from '../../services/sedesService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/SearchSedes.css'; 
import SedeCard from '../sedes/SedeCard'; 
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

interface SearchSedesProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchSedes: React.FC<SearchSedesProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchSedesByKeyword(loggedIn, searchKeyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToSedeDetail = (id: string) => {
    navigate(`/sede/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchSede-section'>
        <div className='SearchSede-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchSede-input'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <IconButton className='SearchSede-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchSede-icon-search'/>
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='SedesPages-Container-Card'>
            {searchResults.map((sede) => (
              <SedeCard key={sede._id} sede={sede} onClick={() => navigateToSedeDetail(sede._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchSedes;
