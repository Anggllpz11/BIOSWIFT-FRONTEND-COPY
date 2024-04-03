import React, { useState } from 'react';
import { searchClientByKeyword } from '../../services/clientsService';
import ClientCard from '../clients/ClientCard'; 
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/SearchClients.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

interface SearchClientsProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchClients: React.FC<SearchClientsProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
    const navigate = useNavigate();
  const handleSearch = async () => {
    try {
      const results = await searchClientByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };
  const navigateToClientDetail = (id: string) => {
    navigate(`/clientes/${id}`);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que el formulario se envíe
    handleSearch(); // Llama a la función de búsqueda al presionar "Enter"
  };

  return (
    <div>
      <div className='SearchClients-section'>
        <div className='SearchClients-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchClients-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchClients-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchClients-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='ClientsPages-Container-Card'>
            {searchResults.map((client) => (
              <ClientCard key={client._id} client={client} onClick={() => navigateToClientDetail(client._id)}/>
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchClients;
