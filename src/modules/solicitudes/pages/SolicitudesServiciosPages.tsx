import React, { useState, useEffect } from 'react';
import { getAllSolicitudesServicios } from '../services/solicitudesServiciosService';
import { useSessionStorage } from '../../users/hooks/useSessionStorage';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import './styles/SolicitudesServiciosPages.css'
import SolicitudServicioCard from '../components/solicitudes_servicios/SolicitudServicioCard';
import { SolicitudServicio } from '../utils/types/SolicitudServicio.type'; // Verifica que este tipo esté definido correctamente
import { useNavigate } from 'react-router-dom';
import SearchSolicitudesServicios from '../components/searchSolicitudesTools/SearchSolicitudesServicios';
import RegisterSolicitudServicioButton from '../components/solicitudes_servicios/RegisterSolicitudServicioButton';
import SolicitudesPagination from '../components/solicitudesPagination';

const SolicitudesServiciosPages: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [solicitudesServicios, setSolicitudesServicios] = useState<Array<SolicitudServicio>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); 
  const limitPerPage = 12; // Este es un valor fijo

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudesServicios = async () => {
      try {
        const token = loggedIn;
        const result = await getAllSolicitudesServicios(token, limitPerPage, currentPage);
        setSolicitudesServicios(result.data.solicitudesServicios);
        setTotalPages(result.data.totalPages); // Asumimos que el servidor devuelve el total de páginas
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
      {/* <RegisterSolicitudServicioButton /> */}
      <SolicitudesPagination // Utiliza el nuevo componente de paginación
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <SearchSolicitudesServicios
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

export default SolicitudesServiciosPages;
