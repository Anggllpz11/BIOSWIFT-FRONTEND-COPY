import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllClasesEquipos } from '../services/clasesEquipoService';
import { ClaseEquipo } from '../utils/types/ClaseEquipo.type';
import ClaseEquipoCard from '../components/clasesEquipos/ClaseEquipoCard';
import { useNavigate } from 'react-router-dom';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';

import './styles/ClasesEquiposPage.css';
import SearchClasesEquipos from '../components/searchEquiposTools/SearchClasesEquipos';
import RegisterClaseEquipoButton from '../components/clasesEquipos/RegisterClaseEquipoButton';

const ClasesEquiposPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [clasesEquipos, setClasesEquipos] = useState<Array<ClaseEquipo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      getAllClasesEquipos(loggedIn)
        .then((data: ClaseEquipo[]) => {
          setClasesEquipos(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          window.alert('Error fetching data');
          setLoading(false);
        });
    }
  }, [loggedIn, navigate]);

  const handleViewDetails = (id: string) => {
    navigate(`/equipos/clases/${id}`);
  };

  return (
    <div className='ClasesEquiposCard-container'>
      <DashboardMenuLateral />
      {loggedIn ? (
        <div>
          <RegisterClaseEquipoButton />
          <SearchClasesEquipos // Renderiza el componente SearchClasesEquipos
            showSearchResults={showSearchResults} // Inicialmente, no muestra los resultados de la búsqueda
            setShowSearchResults={setShowSearchResults} // Esta función no se utiliza inicialmente
          />
          <div className='ClasesEquiposCard-Container-Card'>
          {showSearchResults ? (
            <p></p>
          ) : (
            
              clasesEquipos.map((claseEquipo) => (
                  <ClaseEquipoCard
                    key={claseEquipo._id}
                    claseEquipo={claseEquipo}
                    onViewDetails={() => handleViewDetails(claseEquipo._id)}
                  />
              ))
          )}
          </div>
        </div>
      ) : (
        <p className='ClasesEquiposPage-loggedIn-p'>Please log in to view data.</p>  
      )}
    </div>
  );
};

export default ClasesEquiposPage;
