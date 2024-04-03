import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllSedes } from '../services/sedesService';
import { AxiosResponse } from 'axios';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import './styles/SedesPages.css';
import DefaultSedeImg from './img/defaultSedeImg.png';
import SedeCard from '../components/sedes/SedeCard';
import SearchSedes from '../components/searchTools/SearchSedes';
import { logoutService } from '../services/authService'; // Importa logoutService
import CreateSedeButtonRedirect from '../components/sedes/CreateSedeButtonRedirect';

export const SedesPages = () => {
  const navigate = useNavigate();

  const [sedes, setSedes] = useState({ list: [], totalPages: 1, currentPage: 1 });
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const loggedIn = useSessionStorage('sessionJWTToken');

    if (!loggedIn) {
      logoutService();
    } else {
      getAllSedes(loggedIn, 9, 1)
        .then((response: AxiosResponse) => {
          if (
            response.status === 200 &&
            response.data.sedes &&
            response.data.totalPages &&
            response.data.currentPage
          ) {
            let { sedes, totalPages, currentPage } = response.data;
            setSedes({ list: sedes, totalPages, currentPage });
          } else {
            throw new Error(`Error obtaining Sedes ${response.data}`);
          }
        })
        .catch((error) => console.error(`[GET ALL SEDES ERROR] ${error}`));
    }
  }, []);

  const navigateToSedeDetail = (id: string) => {
    navigate(`/sedes/${id}`);
  };

  return (
    <div className='SedesPages-container'>
      <DashboardMenuLateral />
      <CreateSedeButtonRedirect />
      <SearchSedes
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
      />
      <div className='SedesPages-Container-Card'>
        {showSearchResults ? (
          <p></p>
        ) : (
          sedes.list.map((sede: any) => (
            <SedeCard key={sede._id} sede={sede} onClick={() => navigateToSedeDetail(sede._id)} />
          ))
        )}
      </div>
    </div>
  );
};
