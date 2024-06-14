import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { getOrdenById } from '../services/ordenesService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import { Orden } from '../utils/types/Orden.type';
import SolicitudServicioComponent from '../components/ordenes_servicios/SolicitudServicioComponent';
import VisitasOrden from '../components/ordenes_servicios/VisitasOrden';
import CambiosOrden from '../components/ordenes_servicios/CambiosOrden';
import CotizacionesOrden from '../components/ordenes_servicios/CotizacionesOrden';
import SolicitudBodegaComponent from '../components/ordenes_servicios/SolicitudBodegaComponent';
import ResultadoOrden from '../components/ordenes_servicios/ResultadoOrden';
import ResultadoOrdenOtros from '../components/ordenes_servicios/ResultadoOrdenOtros';

// STYLES
import './styles/OrdenDetailPage.css';
import { useSessionStorage } from '../../users/hooks/useSessionStorage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PrintIcon from '@mui/icons-material/Print';

import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AnularOrden from '../components/ordenes_servicios/AnularOrden';
import { CircularProgress } from '@mui/material';
import CerrarOrden from '../components/ordenes_servicios/CerrarOrden';
import MuiAlertComponent from '../../../components/MuiAlertsComponent';
import SolicitudDadoBajaComponent from '../components/ordenes_servicios/SolicitudDadoBajaComponent';
import OrdenesPDFComponent from '../components/ordenesPDF/OrdenesPDFComponent';



const OrdenDetailPage: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const { id } = useParams();
  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentView, setCurrentView] = useState<'solicitudServicio' | 'visitasOrden' | 'cambiosOrden' | 'cotizacionesOrden' | 'solicitudBodega' | 'resultadoOrden' | 'solicitudesDadoBaja'>('solicitudServicio');
  const [showAnularModal, setShowAnularModal] = useState(false);
  const [showCerrarModal, setShowCerrarModal] = useState(false);
  const [showOrdenPDF, setShowOrdenPDF] = useState(false);
  // ALERTS STATES
  const [alerts, setAlerts] = useState<{ id: number, message: string, severity: 'error' | 'warning' | 'info' | 'success' }[]>([]);


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
        case 'cotizacionesOrden':
          setCurrentView('solicitudBodega');
          break;
        case 'solicitudBodega':
          setCurrentView('resultadoOrden'); 
          break;
        case 'resultadoOrden':
          setCurrentView('solicitudesDadoBaja'); 
          break;
        default:
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
        case 'solicitudBodega':
          setCurrentView('cotizacionesOrden');
          break;
        case 'resultadoOrden':  
          setCurrentView('solicitudBodega');
          break;
        case 'solicitudesDadoBaja':  
          setCurrentView('resultadoOrden');
          break;
        default:
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
        return null; 
    }
  };

  // MODALS
  const handleOpenAnularModal = () => {
    setShowAnularModal(true);
  };

  // Manejador para cerrar el modal Anular Orden
  const handleCloseAnularModal = () => {
    setShowAnularModal(false);
  };

  // Función para agregar una nueva alerta
  const addAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlerts(prevAlerts => [...prevAlerts, { id: Date.now() + Math.random(), message, severity }]);
  };
  
  const handleOpenCerrarModal = () => {
    let hasErrors = false;  // Variable para rastrear si hay errores
  
    // Verifica si el resultado de la orden está completo
    if (!orden || !orden.resultado_orden || orden.resultado_orden === null) {
      addAlert("No se ha completado el resultado de la orden.", 'warning');
      hasErrors = true;
    }
  
    // Verifica si el campo entrega está completo
    if (!orden || !orden.entrega || orden.entrega === null) {
      addAlert("No hay firma de entrega.", 'warning');
      hasErrors = true;
    }
  
    // Verifica si hay suficientes actividades ejecutadas
    const totalActividades = orden && orden.ids_visitas
      ? orden.ids_visitas.reduce((acc, visita) => acc + (visita && visita.actividades ? visita.actividades.length : 0), 0)
      : 0;
  
    if (totalActividades < 3) {
      addAlert("No hay suficientes actividades ejecutadas en el mantenimiento del equipo.", 'warning');
      hasErrors = true;
    }
  
    // Verifica si hay visitas aún abiertas
    const hasOpenVisits = orden && orden.ids_visitas && orden.ids_visitas.some(visita => visita.id_visita_estado && visita.id_visita_estado.estado === "Abierta");
    if (hasOpenVisits) {
      addAlert("Aún hay visitas por cerrar en la Orden de Servicio.", 'warning');
      hasErrors = true;
    }
  
    // Si no hay errores, procede a mostrar el modal para cerrar la orden
    if (!hasErrors) {
      setShowCerrarModal(true);
    }
  };
  
  const handleOpenPrintModal = () => {
    if (orden && orden.id_orden_estado.estado === "Abierta" && orden.id_solicitud_servicio.id_servicio.servicio === "Correctivo") {
      setShowOrdenPDF(true);
    }
  };

  const handleClosePrintModal = () => {
    setShowOrdenPDF(false);
  };
  
  
  // Manejador para cerrar el modal
  const handleCloseCerrarModal = () => {
    setShowCerrarModal(false);
  };


  if (loading) {
    return (
      <div className="OrdenDetailPage-loading-overlay">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  // Función para cerrar una alerta específica
  const handleCloseAlert = (id: number) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
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

                      {orden && orden.id_orden_estado.estado === "Abierta" && (
                      <>
                        <LockOutlinedIcon className="OrdenDetailPage-close-icon" onClick={handleOpenCerrarModal}/>
                        <div className="OrdenDetailPage-close-text" onClick={handleOpenCerrarModal}>Cerrar Orden</div>

                        <BlockOutlinedIcon className="OrdenDetailPage-decline-icon" onClick={handleOpenAnularModal}/>
                        <div className="OrdenDetailPage-decline-text" onClick={handleOpenAnularModal}>Anular Orden</div>
                      </>
                    )}

                   
                      <PrintIcon className="OrdenDetailPage-print-icon" onClick={handleOpenPrintModal}/>
                      <div className="OrdenDetailPage-print-text" onClick={handleOpenPrintModal}>Imprimir</div>

                      <CalendarTodayOutlinedIcon className="OrdenDetailPage-date-icon"/>
                      <AddOutlinedIcon className="OrdenDetailPage-add-date-icon"/>
                      <div className="OrdenDetailPage-date-created">{orden ? orden.creacion : 'N/A'}</div>
                    </div>
                  </header>
                  <ArrowForwardIosOutlinedIcon className="OrdenDetailPage-right-arrow" onClick={handleNextView} />
                  <ArrowBackIosNewOutlinedIcon className="OrdenDetailPage-left-arrow" onClick={handlePreviousView} />

                  {/* RENDERIZADO VIEWS */}
                  {currentView === 'solicitudServicio' && orden && orden.id_solicitud_servicio && (
                    <SolicitudServicioComponent solicitudServicio={orden.id_solicitud_servicio} />
                  )}

                  {currentView === 'visitasOrden' && orden && orden.ids_visitas && (
                    <VisitasOrden visitas={orden.ids_visitas} idOrden={orden._id} /> 
                  )}

                  {currentView === 'cambiosOrden' && orden && (
                    <CambiosOrden idOrden={orden._id} cambios={orden.orden_cambios || []} onReloadNeeded={fetchOrden} />
                  )}

                  {currentView === 'cotizacionesOrden' && orden && (
                    <CotizacionesOrden 
                    idOrden={orden._id}
                    idCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client._id || 'N/A'}
                    nombreCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client.client_name || 'N/A'}
                    
                    />
                  )}

                  {currentView === 'solicitudBodega' && orden && (
                    <SolicitudBodegaComponent 
                    idOrden={orden._id}
                    idCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client._id || 'N/A'}
                    nombreCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client.client_name || 'N/A'}
                    
                    />
                  )}

                  {currentView === 'resultadoOrden' && orden && (
                    orden.id_solicitud_servicio.id_servicio.servicio === "Correctivo" ?
                    <ResultadoOrden
                      idOrden={orden._id}
                      resultadoOrden={orden.resultado_orden}
                      onUpdate={fetchOrden}
                    /> :
                    <ResultadoOrdenOtros
                      idClient={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client._id || 'N/A'}
                      idOrden={orden._id}
                      resultadoOrden={orden.resultado_orden}
                      onUpdate={fetchOrden}
                    />
                  )}

                  {currentView === 'solicitudesDadoBaja' && orden && (
                    <SolicitudDadoBajaComponent 
                    idOrden={orden._id}
                    idCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client._id || 'N/A'}
                    nombreCliente={orden && orden.id_solicitud_servicio && orden.id_solicitud_servicio.id_equipo && orden.id_solicitud_servicio.id_equipo.id_sede.id_client && orden.id_solicitud_servicio.id_equipo.id_sede.id_client.client_name || 'N/A'}
                    resultadoOrden={orden.resultado_orden}
                    />
                  )}


                  {/* RENDERIZADO MODALS */}

                  {showAnularModal && (
                    <AnularOrden idOrden={orden && orden._id} onClose={handleCloseAnularModal} onUpdate={fetchOrden} />
                  )}

                  {showCerrarModal && (
                    <CerrarOrden idOrden={orden && orden._id} onClose={handleCloseCerrarModal} onUpdate={fetchOrden} />
                  )}

                  {showOrdenPDF && orden && (
                    <OrdenesPDFComponent orden={orden} onClose={handleClosePrintModal} />
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
        <MuiAlertComponent alerts={alerts} onClose={handleCloseAlert}  />
    </div>
  );
};

export default OrdenDetailPage;
