import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllClients } from '../services/clientsService';
import { AxiosResponse } from 'axios';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import './styles/ClientsPages.css';
import ClientCard from '../components/clients/ClientCard';
import SearchClients from '../components/searchTools/SearchClients'; // Importa el componente SearchClients
import CreateClientButtonRedirect from '../components/clients/CreateClientButtonRedirect';

export const ClientsPages = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [clients, setClients] = useState({ list: [] });
  const navigate = useNavigate();
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado para mostrar los resultados de la búsqueda

  useEffect(() => {
    if (!loggedIn) {
      window.location.href = '/login';
    } else {
      getAllClients(loggedIn, 9, 1)
        .then((response: AxiosResponse) => {
          if (response.status === 200 && response.data.clients) {
            setClients({ list: response.data.clients });
          } else {
            throw new Error(`Error obtaining Clients: ${response.data}`);
          }
        })
        .catch((error) => console.error(`[GET ALL CLIENTS ERROR] ${error}`));
    }
  }, [loggedIn]);

  const navigateToClientDetail = (id: string) => {
    navigate(`/clientes/${id}`);
  };

  return (
    <div className='ClientsPages-container'>
      <DashboardMenuLateral />

      <SearchClients
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
      />
      <CreateClientButtonRedirect />
      <div className='ClientsPages-Container-Card'>
        {showSearchResults ? (
          <p></p>
        ) : (
          clients.list.map((client: any) => (
            <ClientCard
              key={client._id}
              client={client}
              onClick={() => navigateToClientDetail(client._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

