import React, { useState, useEffect } from 'react';
import { getAllOrdenes } from '../services/ordenesService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import './styles/OrdenesServicioPages.css';
import { Orden } from '../utils/types/Orden.type';
import { useNavigate } from 'react-router-dom';
import OrdenCard from '../components/ordenes_servicios/OrdenCard';
import RegisterEquipoButton from '../../equipos/components/equipos/RegisterEquipoButton';
import SearchEquipos from '../../equipos/components/searchEquiposTools/SearchEquipos';
import { useSessionStorage } from '../../users/hooks/useSessionStorage';
// import SearchOrdenes from '../components/searchOrdenesTools/SearchOrdenes'; // Importa SearchOrdenes
// import RegisterOrdenButton from '../components/ordenes/RegisterOrdenButton'; // Importa RegisterOrdenButton

const OrdenesPages: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [ordenes, setOrdenes] = useState<Array<Orden>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const token = loggedIn;
        const result = await getAllOrdenes(token);
        setOrdenes(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener órdenes:', error);
        window.location.href = '/login';
      }
    };
    fetchOrdenes();
  }, [loggedIn]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const navigateToOrdenDetail = (id: string) => {
    navigate(`/ordenes/${id}`);
  };

  return (
    <div className='OrdenesPages-container'>
      <DashboardMenuLateral />
      <SearchEquipos // Renderiza el componente SearchOrdenes
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
      />
      <div className='OrdenesPages-Container-Card'>
        {showSearchResults ? (
          <p></p>
        ) : (
          ordenes.map((orden) => (
            <OrdenCard key={orden._id} orden={orden} onClick={() => navigateToOrdenDetail(orden._id)} />
          ))
        )}

        <div className='OrdenesPages-Container-Card'> </div>
        <ul className='OrdenesPages-cards-list' onClick={oClick}>
        <li className='OrdenesPages-li'>
        <div className="OrdenCard-container">

        </div>
        </li>
      </ul>
      </div>
    </div>
  );
};

export default OrdenesPages;
