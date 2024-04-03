import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { RepuestoEquipo } from '../utils/types/RepuestoEquipo.type';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import RepuestoEquipoCard from '../components/RepuestosEquipos/RepuestoEquipoCard';
import { getAllRepuestosEquipos } from '../services/repuestosEquiposService';
import RegisterRepuestoEquipoButton from '../components/RepuestosEquipos/RegisterRepuestoEquipoButton';

import './styles/RepuestosEquiposPages.css';
import SearchRepuestosEquipos from '../components/searchEquiposTools/SearchRepuestosEquipos';

const RepuestosEquiposPages: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [repuestosEquipos, setRepuestosEquipos] = useState<Array<RepuestoEquipo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Agrega useNavigate para la navegación

  useEffect(() => {
    const fetchRepuestosEquipos = async () => {
      try {
        const token = loggedIn;
        // Cambiado el servicio a obtener repuestos_equipos
        const result = await getAllRepuestosEquipos(token);

        setRepuestosEquipos(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener repuestos_equipos:', error);
        window.location.href = '/login';
      }
    };

    fetchRepuestosEquipos();
  }, [loggedIn]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Define la función navigateToRepuestoEquipoDetail para la navegación
  const navigateToRepuestoEquipoDetail = (id: string) => {
    navigate(`/equipos-repuestos/${id}`);
  };

  return (
    <div className='RepuestosEquiposPages-container'>
      <DashboardMenuLateral />
      <RegisterRepuestoEquipoButton />
      <SearchRepuestosEquipos // Renderiza el componente SearchEquipos
        showSearchResults={showSearchResults} // Inicialmente, no muestra los resultados de la búsqueda
        setShowSearchResults={setShowSearchResults} // Esta función no se utiliza inicialmente
      />
      <div className='RepuestosEquiposPages-Container-Card'>
        {showSearchResults ? (
          <p></p>
        ) : (
          repuestosEquipos.map((repuestoEquipo) => (
            <RepuestoEquipoCard
              key={repuestoEquipo._id}
              repuestoEquipo={repuestoEquipo}
              onClick={() => navigateToRepuestoEquipoDetail(repuestoEquipo._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RepuestosEquiposPages;
