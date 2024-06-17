import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllTiposEquipos } from '../services/tiposEquipoService';
import { TipoEquipo } from '../utils/types/TipoEquipo.type';
import TipoEquipoCard from '../components/tiposEquipos/TipoEquipoCard';
import { useNavigate } from 'react-router-dom';

import './styles/TiposEquiposPage.css'
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import SearchTiposEquipos from '../components/searchEquiposTools/SearchTiposEquipos'; // Importa SearchTiposEquipos
import RegisterTipoEquipoButton from '../components/tiposEquipos/RegisterTipoEquipoButton';
import { logoutService } from '../../users/services/authService';

const TiposEquiposPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [tiposEquipos, setTiposEquipos] = useState<Array<TipoEquipo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      getAllTiposEquipos(loggedIn)
        .then((data: TipoEquipo[]) => {
          setTiposEquipos(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }else {
      logoutService();
    }
  }, [loggedIn]);

  const handleViewDetails = (id: string) => {
    navigate(`/equipos/tipos/${id}`);
  };

  return (
    <div>
      <DashboardMenuLateral />
      {loggedIn ? (
        <div>
          <RegisterTipoEquipoButton />
          <SearchTiposEquipos // Renderiza el componente SearchTiposEquipos
            showSearchResults={showSearchResults} // Inicialmente, no muestra los resultados de la búsqueda
            setShowSearchResults={setShowSearchResults} // Esta función no se utiliza inicialmente
          />
          <div className='TipoEquipoCard-Container-Card'>

          {showSearchResults ? (
            <p></p>
          ) : (
              tiposEquipos.map((tipoEquipo) => (
                  <TipoEquipoCard
                    key={tipoEquipo._id}
                    tipoEquipo={tipoEquipo}
                    onViewDetails={() => handleViewDetails(tipoEquipo._id)}
                  />
              ))
          )}
          </div>
      </div>
      ) : (
        <p>Please log in to view data.</p>
      )}
    </div>
  );
};

export default TiposEquiposPage;
