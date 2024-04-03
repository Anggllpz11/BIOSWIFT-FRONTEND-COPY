import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllUsers } from '../services/usersService';
import { AxiosResponse } from 'axios';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import './styles/UsersPages.css';
import DefaultUserImg from './img/defaultUserImg.png';
import UserCard from '../components/users/UserCard';
import SearchUsers from '../components/searchTools/SearchUsers';
import RegisterButtonRedirect from '../components/users/RegisterButtonRedirect';
import { logoutService } from '../services/authService';



export const UsersPages = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const [users, setUsers] = useState({ list: [], totalPages: 1, currentPage: 1 });
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado


  
  useEffect(() => {
    if (!loggedIn) {
      return logoutService();
    } else {
      getAllUsers(loggedIn, 9, 1)
        .then((response: AxiosResponse) => {
          if (
            response.status === 200 &&
            response.data.users &&
            response.data.totalPages &&
            response.data.currentPage
          ) {
            let { users, totalPages, currentPage } = response.data;
            setUsers({ list: users, totalPages, currentPage });
          } else {
            throw new Error(`Error obtaining Users ${response.data}`);
          }
        })
        .catch((error) => console.error(`[GET ALL USERS ERROR] ${error}`));
    }
  }, [loggedIn]);

  const navigateToUserDetail = (id: string) => {
    navigate(`/users/${id}`);
  };

  return (
    <div className='UserPages-container'>
      <DashboardMenuLateral />
      <SearchUsers
        showSearchResults={showSearchResults} // Pasa el estado a SearchUsers
        setShowSearchResults={setShowSearchResults} // Pasa la función para cambiar el estado
      />
      <RegisterButtonRedirect />
      <div className='UserPages-Container-Card'>
        {showSearchResults ? ( // Muestra los resultados de búsqueda si showSearchResults es true
          <p></p>
        ) : (
          users.list.map((user: any) => (
            <UserCard key={user._id} user={user} onClick={() => navigateToUserDetail(user._id)} />
          ))
        )}
      </div>

    </div>
  );
};
