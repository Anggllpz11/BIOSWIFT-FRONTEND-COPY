import React, { useEffect, useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getAllSolicitudesBodega } from '../../services/solicitudesBodegaService';
import { SolicitudBodega } from '../../utils/types/SolicitudBodega.type';

import './styles/SolicitudBodegaComponent.css'
import { CircularProgress } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import EditIcon from '@mui/icons-material/Edit';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RegisterSolicitudBodega from '../solicitudes_bodega/RegisterSolicitudBodega';
import SolicitudBodegaByIdOrden from '../solicitudes_bodega/SolicitudBodegaByIdOrden';
import EditSolicitudBodega from '../solicitudes_bodega/EditSolicitudBodega';

interface SolicitudBodegaProps {
  idSolicitudBodega?: string;
  idCliente?: string;
  nombreCliente?: string;
  idOrden?: string;
}

const SolicitudBodegaComponent: React.FC<SolicitudBodegaProps> = ({ idSolicitudBodega, idCliente, nombreCliente, idOrden }) => {
  const [solicitudesBodega, setSolicitudesBodega] = useState<SolicitudBodega[]>([]);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [activeView, setActiveView] = useState<'none' | 'details' | 'register' | 'edit'>('none');
  const [idSolicitudBodegaSeleccionada, setIdSolicitudBodegaSeleccionada] = useState<string | null>(null);
  const token = useSessionStorage('sessionJWTToken');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!idOrden || !token) return;
  
    setIsLoading(true);
    setTimeout(() => {
      getAllSolicitudesBodega(token).then(data => {
        const solicitudesBodegaRelacionadas = data.filter((solicitudBodega: SolicitudBodega) =>
          solicitudBodega.id_orden && solicitudBodega.id_orden._id === idOrden
        );
        setSolicitudesBodega(solicitudesBodegaRelacionadas);
        setIsLoading(false);
      }).catch(error => {
        console.error("Error al cargar solicitudes bodega:", error);
        setIsLoading(false);
      });
    }, 1000);
  }, [idOrden, token]);

  const reloadSolicitudesBodega = () => {
    if (!idOrden || !token) {
      console.error("Falta token o ID de orden para recargar las solicitudes de bodega.");
      return; 
    }
  
    setIsLoading(true);
    setTimeout(() => {
      getAllSolicitudesBodega(token).then(data => {
        const solicitudesBodegaRelacionadas = data.filter((solicitudBodega: SolicitudBodega) => 
          solicitudBodega.id_orden && solicitudBodega.id_orden._id === idOrden
        ); 
        setSolicitudesBodega(solicitudesBodegaRelacionadas);
        setIsLoading(false);
      }).catch(error => {
        console.error("Error al cargar solicitudes bodega:", error);
        setIsLoading(false);
      });
    }, 1000);
  };


  const handleAgregarClick = () => {
    setActiveView('register');
    setIdSolicitudBodegaSeleccionada(null);
  };

  const handleCancelarClick = () => {
    setMostrarRegistro(false);
  };

  const renderEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <HelpIcon className="SolicitudBodega-estado-icono-pendiente" />;
      case 'Aprobada':
        return <CheckCircleIcon className="SolicitudBodega-estado-icono-aprobada" />;
      case 'Rechazada':
        return <DoDisturbIcon className="SolicitudBodega-estado-icono-rechazada" />;
      case 'Terminada':
        return <DoDisturbOnIcon className="SolicitudBodega-estado-icono-terminada" />;
      case 'Despachada':
        return <LocalShippingIcon className="SolicitudBodega-estado-icono-despachada" />;
      default:
        return null; // O puedes devolver un icono por defecto si es necesario
    }
  };

  const handleVerDetalle = (idSolicitudBodega: string) => {
    setIdSolicitudBodegaSeleccionada(idSolicitudBodega);
    setActiveView('details');
    setMostrarRegistro(false);
  };

  const handleEditClick = (idSolicitudBodega: string) => {
    setIdSolicitudBodegaSeleccionada(idSolicitudBodega);
    setActiveView('edit');
  };

  const getMensajePorEstado = (solicitudBodega: SolicitudBodega) => {
    switch (solicitudBodega.id_estado.estado) {
      case 'Pendiente':
        return 'Solicitud de Bodega en estado pendiente';
      case 'Aprobada':
        return solicitudBodega.observacion_aprobacion;
      case 'Rechazada':
        return solicitudBodega.observacion_rechazo;
      case 'Despachada':
        return solicitudBodega.observacion_despacho;
      case 'Terminada':
        return solicitudBodega.observacion_finalizacion;
      default:
        return ''; // Manejar estados desconocidos o no especificados
    }
  };
  

  return (
    <div className="SolicitudBodega-solicitudes-orden">
      <div className="SolicitudBodega-div">
        <header className="SolicitudBodega-header">
          <div className="SolicitudBodega-overlap-group">
            <div className="SolicitudBodega-cambios-t">SOLICITUDES BODEGA</div>
          </div>
        </header>
        <div className="SolicitudBodega-overlap">
          <div className="SolicitudBodega-resumen-section">
            <div className="SolicitudBodega-resumen-header">
              <div className="SolicitudBodega-overlap-group-2">
                <div className="SolicitudBodega-resumen-t">RESUMEN</div>
                <AddCircleIcon className="SolicitudBodega-add-icon" onClick={handleAgregarClick} />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#00ddfa', position: 'relative', top: '170px' }}>
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="SolicitudBodega-resume-list">
              <ul>
                {solicitudesBodega.map((solicitudBodega, index) => (
                  <li className="SolicitudBodega-cambio-card" key={index}>
                    <div className="SolicitudBodega-overlap-group-3">
                      {renderEstadoIcono(solicitudBodega.id_estado.estado)}
                      <div className='SolicitudBodega-estado-separator'></div>
                      <div className="SolicitudBodega-oid">ID: {solicitudBodega._id}</div>
                      <div className='SolicitudBodega-mensaje-title'>COMENTARIOS</div>
                      <div className="SolicitudBodega-subestado-comments">{getMensajePorEstado(solicitudBodega)}</div>
                      <div className="SolicitudBodega-separator" />
                      <div className="SolicitudBodega-registered-by">CREADA POR:</div>
                      <div className="SolicitudBodega-username">{solicitudBodega.id_creador.name}</div>
                      <div className="SolicitudBodega-date-t">FECHA:</div>
                      <div className="SolicitudBodega-date-value">{solicitudBodega.date_created}</div>
                    </div>
                    <OpenInNewIcon className="SolicitudBodega-open-icon" onClick={() => handleVerDetalle(solicitudBodega._id)} />
                    {solicitudBodega.id_estado.estado === 'Pendiente' && (
                      <EditIcon className="SolicitudBodega-edit-icon" onClick={() => handleEditClick(solicitudBodega._id)} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ESPACIO RENDERIZADO SOLICITUD BODEGA BY ID COMPONENT */}
        {activeView === 'register' && idOrden && (
          <RegisterSolicitudBodega
          idOrden={idOrden} 
          onSolicitudBodegaSuccess={() => {
            setActiveView('none');
            reloadSolicitudesBodega();
          }}
          onCancel={() => setActiveView('none')}
          idCliente={idCliente}
          nombreCliente={nombreCliente}
          />
        )}
        

        {activeView === 'edit' && idSolicitudBodegaSeleccionada && (
          <EditSolicitudBodega
            idOrden={idOrden}
            idSolicitudBodega={idSolicitudBodegaSeleccionada}
            onSolicitudBodegaSuccess={() => {
              setActiveView('none');
              reloadSolicitudesBodega();
            }}
            onCancel={() => setActiveView('none')}
            idCliente={idCliente}
            nombreCliente={nombreCliente}
          />
        )}

        {activeView === 'details' &&idSolicitudBodegaSeleccionada && (
          <SolicitudBodegaByIdOrden idSolicitudBodega={idSolicitudBodegaSeleccionada} onBack={() => setActiveView('none')} onCambioSuccess={() => {
            setActiveView('none');
            reloadSolicitudesBodega();
          }} />
          )}
      </div>
    </div>
  );
};

export default SolicitudBodegaComponent;