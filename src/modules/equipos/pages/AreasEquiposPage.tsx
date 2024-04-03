import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllAreasEquipos } from '../services/areasEquiposService';
import { AreaEquipo } from '../utils/types/AreaEquipo.type';
import AreaEquipoCard from '../components/areasEquipos/AreaEquipoCard';
import { useNavigate } from 'react-router-dom';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import SearchAreasEquipos from '../components/searchEquiposTools/SearchAreasEquipos';
import './styles/AreasEquiposPage.css'
import RegisterAreaEquipoButton from '../components/areasEquipos/RegisterAreaEquipoButton';
import { logoutService } from '../../users/services/authService';
const AreasEquiposPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [areasEquipos, setAreasEquipos] = useState<Array<AreaEquipo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      getAllAreasEquipos(loggedIn)
        .then((data: AreaEquipo[]) => {
          setAreasEquipos(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    } else {
      logoutService();
    }
  }, [loggedIn]);

  const handleViewDetails = (id: string) => {
    navigate(`/equipos/areas/${id}`);
  };

  return (
    <div className='AreasEquiposCard-container'>
      <DashboardMenuLateral />
      {loggedIn ? (
        <div>
          <RegisterAreaEquipoButton/>
          <SearchAreasEquipos // Renderiza el componente SearchAreasEquipos
            showSearchResults={showSearchResults} // Inicialmente, no muestra los resultados de la búsqueda
            setShowSearchResults={setShowSearchResults} // Esta función no se utiliza inicialmente
          />
          <div className='AreasEquiposCard-Container-Card'>
          {showSearchResults ? (
            <p></p>
          ) : (
              areasEquipos.map((areaEquipo) => (
                  <AreaEquipoCard
                    key={areaEquipo._id}
                    areaEquipo={areaEquipo}
                    onViewDetails={() => handleViewDetails(areaEquipo._id)}
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

export default AreasEquiposPage;
