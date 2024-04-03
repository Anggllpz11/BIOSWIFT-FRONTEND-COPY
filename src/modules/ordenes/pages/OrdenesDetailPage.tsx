import React, { useState, useEffect, Fragment } from 'react';
import { getOrdenById } from '../services/ordenesService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import { Orden } from '../utils/types/Orden.type';
import './styles/OrdenDetailPage.css';
import { useSessionStorage } from '../../users/hooks/useSessionStorage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SolicitudServicioComponent from '../components/ordenes_servicios/SolicitudServicioComponent';
import VisitasOrden from '../components/ordenes_servicios/VisitasOrden';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


const OrdenDetailPage: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const { id } = useParams();
  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentView, setCurrentView] = useState('solicitudServicio'); // Estado para controlar la vista actual
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    if (!id) {
      console.error('ID de la orden no encontrado en la URL');
      return;
    }

    const fetchOrden = async () => {
      try {
        const token = loggedIn;
        const result = await getOrdenById(token, id);
        setOrden(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener detalles de la orden:', error);
      }
    };

    fetchOrden();
  }, [loggedIn, id]);

  const handleEditSuccess = () => {
    console.log('Orden editada con éxito');
    setIsEditing(false);
  };

  const handleNextView = () => {
    if (currentView === 'solicitudServicio') {
      setCurrentView('visitasOrden');
    }
  };

  const handlePreviousView = () => {
    if (currentView === 'visitasOrden') {
      setCurrentView('solicitudServicio');
    }
  };

  const renderEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Abierta':
        return <LockOpenOutlinedIcon className="OrdenDetailPage-check-icon-estado-abierta" />;
      case 'Cerrada':
        return <LockOutlinedIcon className="OrdenDetailPage-check-icon-estado-cerrada" />;
      case 'Anulada':
        return <BlockOutlinedIcon className="OrdenDetailPage-check-icon-estado-anulada" />;
      default:
        return null; // o puedes poner un icono por defecto
    }
  };

  return (
    <div>
      <DashboardMenuLateral />

        <div className="OrdenDetailPage">
          <div className="OrdenDetailPage-box">
            <div className="OrdenDetailPage-orden-servicio">
              <div className="OrdenDetailPage-body">
                <div className="OrdenDetailPage-overlap">
                  <div className="OrdenDetailPage-container" />
                  <header className="OrdenDetailPage-header">
                    <div className="OrdenDetailPage-overlap-group">
                      <p className="OrdenDetailPage-orden-id">ORDEN DE SERVICIO - {orden ? orden._id : 'N/A'}</p>
                      {renderEstadoIcon(orden ? orden.id_orden_estado.estado : 'N/A')}
                      <CalendarTodayOutlinedIcon className="OrdenDetailPage-date-icon"/>
                      <AddOutlinedIcon className="OrdenDetailPage-add-date-icon"/>
                      
                      <div className="OrdenDetailPage-date-created">{orden ? orden.creacion : 'N/A'}</div>
                    </div>
                  </header>
                  <ArrowForwardIosOutlinedIcon className="OrdenDetailPage-right-arrow" onClick={handleNextView} />
                  <ArrowBackIosNewOutlinedIcon className="OrdenDetailPage-left-arrow" onClick={handlePreviousView} />

                  {currentView === 'solicitudServicio' && orden && orden.id_solicitud_servicio && (
                    <SolicitudServicioComponent solicitudServicio={orden.id_solicitud_servicio} />
                  )}

                  {currentView === 'visitasOrden' && orden && orden.ids_visitas && (
                    <VisitasOrden visitas={orden.ids_visitas} idOrden={orden._id} /> // Añade el prop idOrden aquí
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default OrdenDetailPage;
