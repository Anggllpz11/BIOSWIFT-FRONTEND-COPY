import React, { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import './searchProtocolosProcesosTool.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchPreventivosByKeyword } from '../../services/searchProcesos&ProtocolosService';
import PreventivoCard from '../preventivos/PreventivoCard';

interface SearchPreventivosProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchPreventivos: React.FC<SearchPreventivosProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchPreventivosByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToPreventivoDetail = (id: string) => {
    navigate(`/preventivos/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <div className='SearchProtocolosProcesos-section'>
        <div className='SearchProtocolosProcesos-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchProtocolosProcesos-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchProtocolosProcesos-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchProtocolosProcesos-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='PreventivosPages-Container-Card'>
            {searchResults.map((preventivo) => (
              <PreventivoCard key={preventivo._id} preventivo={preventivo} onClick={() => navigateToPreventivoDetail(preventivo._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchPreventivos;
