import React, { useEffect, useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { createSolicitudDadoBaja, getAllSolicitudesDadoBaja } from '../../services/solicitudesDadoBajaService'; // Import the correct service

import './styles/SolicitudDadoBajaComponent.css'
import { CircularProgress } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import EditIcon from '@mui/icons-material/Edit';
import { SolicitudDadoBaja } from '../../utils/types/SolicitudDadoBaja.type';
import SolicitudDadoBajaByIdOrden from '../solicitudes_dado_baja/SolicitudDadoBajaByIdOrden';
import MuiAlertComponent from '../../../../components/MuiAlertsComponent';

interface SolicitudDadoBajaComponentProps {
  idSolicitudDadoBaja?: string;
  idCliente?: string;
  nombreCliente?: string;
  idOrden?: string;
  resultadoOrden?: any;
}

const SolicitudDadoBajaComponent: React.FC<SolicitudDadoBajaComponentProps> = ({ idSolicitudDadoBaja, idCliente, nombreCliente, idOrden, resultadoOrden }) => {
  const [solicitudesDadoBaja, setSolicitudesDadoBaja] = useState<SolicitudDadoBaja[]>([]);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [activeView, setActiveView] = useState<'none' | 'details' | 'register' | 'edit'>('none');
  const [idSolicitudDadoBajaSeleccionada, setIdSolicitudDadoBajaSeleccionada] = useState<string | null>(null);
  const userId = useSessionStorage('userId');
  const token = useSessionStorage('sessionJWTToken');
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('info');
  const [alerts, setAlerts] = useState<{ id: number, message: string, severity: 'error' | 'warning' | 'info' | 'success' }[]>([]);

  useEffect(() => {
    if (!idOrden || !token) return;
  
    setIsLoading(true);
    setTimeout(() => {
      getAllSolicitudesDadoBaja(token).then(data => {
        const solicitudesDadoBajaRelacionadas = data.filter((solicitudDadoBaja: SolicitudDadoBaja) =>
          solicitudDadoBaja.id_orden && solicitudDadoBaja.id_orden._id === idOrden 
        );
        setSolicitudesDadoBaja(solicitudesDadoBajaRelacionadas);
        setIsLoading(false);
      }).catch(error => {
        console.error("Error al cargar solicitudes de dado de baja:", error);
        setIsLoading(false);
      });
    }, 1000);
  }, [idOrden, token]); // Incluye idOrden en las dependencias
  

  const reloadSolicitudesDadoBaja = () => {
    if (!idOrden || !token) {
      console.error("Falta token o ID de orden para recargar las solicitudes de dado de baja.");
      return; 
    }
  
    setIsLoading(true);
    setTimeout(() => {
      getAllSolicitudesDadoBaja(token).then(data => {
        const solicitudesDadoBajaRelacionadas = data.filter((solicitudDadoBaja: SolicitudDadoBaja) => 
          solicitudDadoBaja.id_orden && solicitudDadoBaja.id_orden._id === idOrden
        ); 
        setSolicitudesDadoBaja(solicitudesDadoBajaRelacionadas);
        setIsLoading(false);
      }).catch(error => {
        console.error("Error al cargar solicitudes de dado de baja:", error);
        setIsLoading(false);
      });
    }, 1000);
  };
  
  const addAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlerts(prevAlerts => [...prevAlerts, { id: Date.now() + Math.random(), message, severity }]);
  };

  const handleAgregarClick = () => {
    let hasErrors = false; // Variable para rastrear si hay errores
  
    if (!idCliente || !idOrden || !userId || !token) {
      addAlert("Faltan datos para crear una nueva solicitud de dado de baja.", 'error');
      hasErrors = true;
    }
  
    if (!resultadoOrden) {
      addAlert("Falta definir el resultado de la orden.", 'warning');
      hasErrors = true;
    }
  
    const solicitudPendiente = solicitudesDadoBaja.find(solicitud => solicitud.id_solicitud_baja_estado.estado === "Pendiente");
    if (solicitudPendiente) {
      addAlert("Actualmente hay una Solicitud de Baja en proceso.", 'warning');
      hasErrors = true;
    }
  
    const solicitudAprobada = solicitudesDadoBaja.find(solicitud => solicitud.id_solicitud_baja_estado.estado === "Aprobada");
    if (solicitudAprobada) {
      addAlert("Actualmente ya hay una Solicitud de Baja APROBADA para el Equipo.", 'warning');
      hasErrors = true;
    }
  
    // Si hay errores, no se continúa con la creación de la solicitud
    if (hasErrors) {
      return;
    }
  
    const now = new Date();
    const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
    const solicitudData = {
      id_solicitud_baja_estado: '6642654cc858b4a7a115053c',
      id_cliente: idCliente,
      id_orden: idOrden,
      id_creador: userId,
      date_created: formattedDateCreated
    };
  
    createSolicitudDadoBaja(token, solicitudData)
      .then(response => {
        addAlert("Solicitud de dado de baja creada exitosamente.", 'success');
        reloadSolicitudesDadoBaja();
        setActiveView('none');
      })
      .catch(error => {
        addAlert("Error al crear la solicitud de dado de baja.", 'error');
      });
  };
  



  const handleCancelarClick = () => {
    setMostrarRegistro(false);
  };

  const renderEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <HelpIcon className="SolicitudDadoBaja-estado-icono-pendiente" />;
      case 'Aprobada':
        return <CheckCircleIcon className="SolicitudDadoBaja-estado-icono-aprobada" />;
      case 'Rechazada':
        return <DoDisturbIcon className="SolicitudDadoBaja-estado-icono-rechazada" />;
      default:
        return null; // O puedes devolver un icono por defecto si es necesario
    }
  };

  const handleVerDetalle = (idSolicitudDadoBaja: string) => {
    setIdSolicitudDadoBajaSeleccionada(idSolicitudDadoBaja);
    setActiveView('details');
    setMostrarRegistro(false);
  };

  const handleEditClick = (idSolicitudDadoBaja: string) => {
    setIdSolicitudDadoBajaSeleccionada(idSolicitudDadoBaja);
    setActiveView('edit');
  };

  const getMensajePorEstado = (solicitudDadoBaja: SolicitudDadoBaja) => {
    switch (solicitudDadoBaja.id_solicitud_baja_estado.estado) {
      case 'Pendiente':
        return 'Solicitud de Dado de Baja en estado pendiente';
      case 'Aprobada':
        return solicitudDadoBaja.observacion_estado;
      case 'Rechazada':
        return solicitudDadoBaja.observacion_estado;
      case 'Despachada':
        return solicitudDadoBaja.observacion_estado;
      case 'Terminada':
        return solicitudDadoBaja.observacion_estado;
      default:
        return ''; // Manejar estados desconocidos o no especificados
    }
  };
  
  const handleCloseAlert = (id: number) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="SolicitudDadoBaja-solicitudes-orden">
      <MuiAlertComponent alerts={alerts} onClose={handleCloseAlert} />
      <div className="SolicitudDadoBaja-div">
        <header className="SolicitudDadoBaja-header">
          <div className="SolicitudDadoBaja-overlap-group">
            <div className="SolicitudDadoBaja-cambios-t">SOLICITUDES DADO DE BAJA</div>
          </div>
        </header>
        <div className="SolicitudDadoBaja-overlap">
          <div className="SolicitudDadoBaja-resumen-section">
            <div className="SolicitudDadoBaja-resumen-header">
              <div className="SolicitudDadoBaja-overlap-group-2">
                <div className="SolicitudDadoBaja-resumen-t">RESUMEN</div>
                <AddCircleIcon className="SolicitudDadoBaja-add-icon" onClick={handleAgregarClick} />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#00ddfa', position: 'relative', top: '170px' }}>
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="SolicitudDadoBaja-resume-list">
              <ul>
                {solicitudesDadoBaja.map((solicitudDadoBaja, index) => (
                  <li className="SolicitudDadoBaja-cambio-card" key={index}>
                    <div className="SolicitudDadoBaja-overlap-group-3">
                      {renderEstadoIcono(solicitudDadoBaja.id_solicitud_baja_estado.estado)}
                      <div className='SolicitudDadoBaja-estado-separator'></div>
                      <div className="SolicitudDadoBaja-oid">ID: {solicitudDadoBaja._id}</div>
                      <div className='SolicitudDadoBaja-mensaje-title'>COMENTARIOS</div>
                      <div className="SolicitudDadoBaja-subestado-comments">{getMensajePorEstado(solicitudDadoBaja)}</div>
                      <div className="SolicitudDadoBaja-separator" />
                      <div className="SolicitudDadoBaja-registered-by">CREADA POR:</div>
                      <div className="SolicitudDadoBaja-username">{solicitudDadoBaja.id_creador.name}</div>
                      <div className="SolicitudDadoBaja-date-t">FECHA:</div>
                      <div className="SolicitudDadoBaja-date-value">{solicitudDadoBaja.date_created}</div>
                    </div>
                    <OpenInNewIcon className="SolicitudDadoBaja-open-icon" onClick={() => handleVerDetalle(solicitudDadoBaja._id)} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {activeView === 'details' && idSolicitudDadoBajaSeleccionada && (
          <SolicitudDadoBajaByIdOrden idSolicitudDadoBaja={idSolicitudDadoBajaSeleccionada} onBack={() => setActiveView('none')} onCambioSuccess={() => {
            setActiveView('none');
            reloadSolicitudesDadoBaja();
          }} />
          )} 
          
      </div>
    </div>
  );
};

export default SolicitudDadoBajaComponent;
