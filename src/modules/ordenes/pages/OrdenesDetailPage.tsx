import React, { useState, useEffect, Fragment, useCallback } from 'react';
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
import CambiosOrden from '../components/ordenes_servicios/CambiosOrden';
import CotizacionesOrden from '../components/ordenes_servicios/CotizacionesOrden';


const OrdenDetailPage: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const { id } = useParams();
  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentView, setCurrentView] = useState<'solicitudServicio' | 'visitasOrden' | 'cambiosOrden' | 'cotizacionesOrden'>('solicitudServicio');


  const navigate = useNavigate();



    const fetchOrden = useCallback(async () => {
      if (!loggedIn || !id) return;
    
      setLoading(true);
      try {
        const token = loggedIn;
        const result = await getOrdenById(token, id);
        setOrden(result);
      } catch (error) {
        console.error('Error al obtener detalles de la orden:', error);
      } finally {
        setLoading(false);
      }
    }, [loggedIn, id]); 

    useEffect(() => {
      fetchOrden();
    }, [fetchOrden]);

  const handleEditSuccess = () => {
    console.log('Orden editada con éxito');
    setIsEditing(false);
  };

  const handleNextView = () => {
    switch (currentView) {
      case 'solicitudServicio':
        setCurrentView('visitasOrden');
        break;
      case 'visitasOrden':
        setCurrentView('cambiosOrden');
        break;
      case 'cambiosOrden':
        setCurrentView('cotizacionesOrden'); 
        break;
    }
  };
  
  const handlePreviousView = () => {
    switch (currentView) {
      case 'visitasOrden':
        setCurrentView('solicitudServicio');
        break;
      case 'cambiosOrden':
        setCurrentView('visitasOrden');
        break;
      case 'cotizacionesOrden':
        setCurrentView('cambiosOrden');
        break;
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

                  {currentView === 'cambiosOrden' && orden && (
                    <CambiosOrden idOrden={orden._id} cambios={orden.orden_cambios || []} onReloadNeeded={fetchOrden} />
                  )}

                  {currentView === 'cotizacionesOrden' && orden && (
                    <CotizacionesOrden idOrden={orden._id}
                    idCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client._id || 'N/A'}
                    nombreCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client.client_name || 'N/A'}
                    
                    />
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
