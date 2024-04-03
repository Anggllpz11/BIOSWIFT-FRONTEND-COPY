import React, { useState } from 'react';
import { searchUsersByKeyword } from '../../services/usersService';
import UserCard from '../users/UserCard';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import './styles/SearchUsers.css';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

interface SearchUsersProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchUsers: React.FC<SearchUsersProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchUsersByKeyword(loggedIn, keyword);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToUserDetail = (id: string) => {
    navigate(`/users/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que el formulario se envíe
    handleSearch(); // Llama a la función de búsqueda al presionar "Enter"
  };

  return (
    <div>
      <div className='SearchUser-section'>
        <div className='SearchUser-section-container'>
          <form onSubmit={handleSubmit}> {/* Utiliza un formulario para manejar el evento 'submit' */}
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchUsers-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchUser-IconButton' type="submit" aria-label="search"> {/* Utiliza IconButton para el icono de búsqueda */}
              <SearchIcon className='SearchUser-icon-search'/>
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='UserPages-Container-Card'>
            {searchResults.map((user) => (
              <UserCard key={user._id} user={user} onClick={() => navigateToUserDetail(user._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
