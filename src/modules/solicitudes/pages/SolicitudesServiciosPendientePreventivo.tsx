import React, { useState, useEffect } from 'react';
import { getAllSolicitudesServicios } from '../services/solicitudesServiciosService';
import { useSessionStorage } from '../../users/hooks/useSessionStorage';
import './styles/SolicitudesServiciosPages.css';
import SolicitudServicioCard from '../components/solicitudes_servicios/SolicitudServicioCard';
import { SolicitudServicio } from '../utils/types/SolicitudServicio.type';
import { useNavigate } from 'react-router-dom';
import SolicitudesPagination from '../components/solicitudesPagination';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import SearchSolicitudesServicios from '../components/searchSolicitudesTools/SearchSolicitudesServicios'; // Paso 1: Importar el componente

const SolicitudesServiciosPendientePreventivo: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [solicitudesServicios, setSolicitudesServicios] = useState<Array<SolicitudServicio>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Paso 2: Agregar el estado showSearchResults
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limitPerPage = 6;

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudesServicios = async () => {
      try {
        const token = loggedIn;
        const result = await getAllSolicitudesServicios(token, limitPerPage, currentPage);
        const filteredSolicitudes = result.data.solicitudesServicios.filter((solicitud: SolicitudServicio) => solicitud.id_servicio.servicio === 'Preventivo' && solicitud.id_solicitud_estado.estado === 'Pendiente');
        setSolicitudesServicios(filteredSolicitudes);
        setTotalPages(result.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener solicitudes de servicios:', error);
        window.location.href = '/login';
      }
    };

    fetchSolicitudesServicios();
  }, [currentPage, loggedIn]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const navigateToSolicitudServicioDetail = (id: string) => {
    navigate(`/solicitudes-servicios/${id}`);
  };

  return (
    <div className='SolicitudesServiciosPages-container'>
      <DashboardMenuLateral />
      <SolicitudesPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <SearchSolicitudesServicios // Paso 3: Incluir el componente SearchSolicitudesServicios
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
      />
      <div className='SolicitudesServiciosPages-Container-Card'>
        {showSearchResults ? (
          null
        ) : (
          solicitudesServicios.map((solicitud) => (
            <SolicitudServicioCard key={solicitud._id} solicitud={solicitud} onClick={() => navigateToSolicitudServicioDetail(solicitud._id)} />
          ))
        )}
      </div>
    </div>
  );
};

export default SolicitudesServiciosPendientePreventivo;
