import React, { useState, useEffect } from 'react';
import { getAllEquipos } from '../services/equiposService';
import { useSessionStorage } from '../hooks/useSessionStorage';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import './styles/EquiposPages.css'
// Importa EquipoCard
import EquipoCard from '../components/equipos/EquipoCard';
import { Equipo } from '../utils/types/Equipo.type';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import SearchEquipos from '../components/searchEquiposTools/SearchEquipos';
import RegisterEquipoButton from '../components/equipos/RegisterEquipoButton';

const EquiposPages: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [equipos, setEquipos] = useState<Array<Equipo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Agrega useNavigate para la navegación

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const token = loggedIn;
        const result = await getAllEquipos(token);

        setEquipos(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
        window.location.href = '/login';
      }
    };

    fetchEquipos();
  }, [loggedIn]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Define la función navigateToEquipoDetail para la navegación
  const navigateToEquipoDetail = (id: string) => {
    navigate(`/equipos/${id}`);
  };

  return (
    <div className='EquiposPages-container'>
      <DashboardMenuLateral />
      <RegisterEquipoButton />
      <SearchEquipos // Renderiza el componente SearchEquipos
        showSearchResults={showSearchResults} // Inicialmente, no muestra los resultados de la búsqueda
        setShowSearchResults={setShowSearchResults} // Esta función no se utiliza inicialmente
      />
        <div className='EquiposPages-Container-Card'>
          {showSearchResults ? (
            <p></p>
          ): (

            equipos.map((equipo) => (
              
                <EquipoCard key={equipo._id} equipo={equipo} onClick={() => navigateToEquipoDetail(equipo._id)} />
            ))
          )}

        </div>  
  </div>
  );
};

export default EquiposPages;
