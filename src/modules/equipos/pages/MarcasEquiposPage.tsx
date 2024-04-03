import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllMarcasEquipos } from '../services/marcasEquipoService';
import { MarcaEquipo } from '../utils/types/MarcaEquipo.type';
import MarcaEquipoCard from '../components/marcasEquipos/MarcaEquipoCard';
import { useNavigate } from 'react-router-dom';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import SearchMarcasEquipos from '../components/searchEquiposTools/SearchMarcasEquipos'; // Importa el componente SearchMarcasEquipos
import './styles/MarcasEquiposPage.css'
import RegisterMarcaEquipoButton from '../components/marcasEquipos/RegisterMarcaEquipoButton';
const MarcasEquiposPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [marcasEquipos, setMarcasEquipos] = useState<Array<MarcaEquipo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      getAllMarcasEquipos(loggedIn)
        .then((data: MarcaEquipo[]) => {
          setMarcasEquipos(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [loggedIn]);

  const handleViewDetails = (id: string) => {
    navigate(`/equipos/marcas/${id}`);
  };

  return (
    <div className='MarcasEquiposPage-container'>
      <DashboardMenuLateral />
      {loggedIn ? (
        <div>
          <RegisterMarcaEquipoButton />
          <SearchMarcasEquipos // Renderiza el componente SearchMarcasEquipos
            showSearchResults={showSearchResults} // Inicialmente, no muestra los resultados de la búsqueda
            setShowSearchResults={setShowSearchResults} // Esta función no se utiliza inicialmente
          />
            <div className='MarcasEquiposPage-Container-Card'> 
          {showSearchResults ? (
            <p></p>
          ) : (

            
            marcasEquipos.map((marcaEquipo) => (
              <MarcaEquipoCard
              key={marcaEquipo._id}
              marcaEquipo={marcaEquipo}
              onViewDetails={() => handleViewDetails(marcaEquipo._id)}
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

export default MarcasEquiposPage;
