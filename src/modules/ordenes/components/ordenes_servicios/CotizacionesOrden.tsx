import React, { useEffect, useState } from 'react';
import { Orden, OrdenCambio } from '../../utils/types/Orden.type';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getAllCotizaciones } from '../../services/cotizacionesService';
import { Cotizacion } from '../../utils/types/Cotizacion.type';
import RegisterCotizacionOrden from './RegisterCotizacionOrden';

import './styles/CotizacionesOrden.css';
import RegisterCambiosOrden from './RegisterCambiosOrden';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OrdenCambioDetails from './OrdenCambioDetails';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CotizacionesByIdOrden from './CotizacionesByIdOrden';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress } from '@mui/material';
import EditCotizacionOrden from './EditCotizacionOrden';


interface CambiosOrdenProps {
    idOrden?: string;
    idCliente?: string; 
    nombreCliente?: string;

}

const CotizacionesOrden: React.FC<CambiosOrdenProps> = ({ idOrden, idCliente, nombreCliente }) => {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]); 
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [activeView, setActiveView] = useState<'none' | 'details' | 'register' | 'edit'>('none');
  const [idCotizacionSeleccionada, setIdCotizacionSeleccionada] = useState<string | null>(null);
  const token = useSessionStorage('sessionJWTToken'); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!idOrden || !token) return;
  
    setIsLoading(true); 
    setTimeout(() => { 
      getAllCotizaciones(token).then(data => {
        const cotizacionesRelacionadas = data.filter((cotizacion: Cotizacion) => cotizacion.id_orden && cotizacion.id_orden._id === idOrden);
        setCotizaciones(cotizacionesRelacionadas);
        setIsLoading(false); 
      }).catch(error => {
        console.error("Error al cargar cotizaciones:", error);
        setIsLoading(false); 
      });
    }, 1000);
  }, [idOrden, token]);
  
  const reloadCotizaciones = () => {
    setIsLoading(true); 
    setTimeout(() => {
      getAllCotizaciones(token).then(data => {
        const cotizacionesRelacionadas = data.filter((cotizacion: Cotizacion) => cotizacion.id_orden && cotizacion.id_orden._id === idOrden);
        setCotizaciones(cotizacionesRelacionadas);
        setIsLoading(false); 
      }).catch(error => {
        console.error("Error al cargar cotizaciones:", error);
        setIsLoading(false); 
      });
    }, 1000);
  };
  
  
  const handleAgregarClick = () => {
    setActiveView('register');
    setIdCotizacionSeleccionada(null);
  };
  
  const handleCancelarClick = () => {
    setMostrarRegistro(false);

  };

  const renderEstadoIcono = (estado: string) => {
    switch (estado) {
        case 'Pendiente':
            return <HelpIcon className="CotizacionesOrden-estado-icono-pendiente" />;
        case 'Aprobada':
            return <CheckCircleIcon className="CotizacionesOrden-estado-icono-aprobada" />;
        case 'Rechazada':
            return <DoDisturbIcon className="CotizacionesOrden-estado-icono-rechazada" />;
        default:
            return null; // O puedes devolver un icono por defecto si es necesario
    }
};


const handleVerDetalle = (idCotizacion: string) => {
  setIdCotizacionSeleccionada(idCotizacion);
  setActiveView('details');
  setMostrarRegistro(false); 
};

const handleEditClick = (idCotizacion: string) => {
  setIdCotizacionSeleccionada(idCotizacion);
  setActiveView('edit');
};


  return (
   <div className="CotizacionesOrden-cotizaciones-orden">
        <div className="CotizacionesOrden-div">
          <header className="CotizacionesOrden-header">
            <div className="CotizacionesOrden-overlap-group">
              <div className="CotizacionesOrden-cambios-t">COTIZACIONES</div>
            </div>
          </header>
          <div className="CotizacionesOrden-overlap">
            <div className="CotizacionesOrden-resumen-section">
              <div className="CotizacionesOrden-resumen-header">
                <div className="CotizacionesOrden-overlap-group-2">
                  <div className="CotizacionesOrden-resumen-t">RESUMEN</div>
                  <AddCircleIcon className="CotizacionesOrden-add-icon" onClick={handleAgregarClick}/>
                </div>
              </div>
            </div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#00ddfa', position: 'relative', top: '170px' }}>
                  <CircularProgress color="inherit" />
                </div>
              ) : (
            <div className="CotizacionesOrden-resume-list">
              <ul>
                {cotizaciones.map((cotizacion, index) => (
                  <li className="CotizacionesOrden-cambio-card" key={index}>
                    <div className="CotizacionesOrden-overlap-group-3">
                      {renderEstadoIcono(cotizacion.id_estado.estado)}
                      <div className='CotizacionesOrden-estado-separator'></div>
                      <div className='CotizacionesOrden-oid'>ID: {cotizacion._id}</div>
                      <div className='CotizacionesOrden-mensaje-title'>MENSAJE</div>
                      <div className="CotizacionesOrden-subestado-comments">{cotizacion.mensaje}</div>
                      <div className="CotizacionesOrden-separator"/>
                      <div className="CotizacionesOrden-registered-by">CREADA POR:</div>
                      <div className="CotizacionesOrden-username">{cotizacion.id_creador.name}</div>
                      <div className="CotizacionesOrden-date-t">FECHA:</div>
                      <div className="CotizacionesOrden-date-value">{cotizacion.fecha_creation}</div>
                    </div>
                    <OpenInNewIcon className="CotizacionesOrden-open-icon" onClick={() => handleVerDetalle(cotizacion._id)}/>
                    {cotizacion.id_estado.estado === 'Pendiente' && (
                      <EditIcon className="CotizacionesOrden-edit-icon" onClick={() => handleEditClick(cotizacion._id)}/>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            )}
          </div>
          
          {/* ESPACIO RENDERIZADO COTIZACION BY ID COMPONENT */}
          
          {activeView === 'register' && idOrden && (
              <RegisterCotizacionOrden
                idOrden={idOrden} 
                idCliente={idCliente} 
                nombreCliente={nombreCliente}
                onCotizacionSuccess={() => {
                  setActiveView('none');
                  reloadCotizaciones();
                }}
                onCancel={() => setActiveView('none')}
              />
          )}

          {activeView === 'edit' && idCotizacionSeleccionada && (
            <EditCotizacionOrden
               idOrden={idOrden}
              idCotizacion={idCotizacionSeleccionada}
              onCotizacionSuccess={() => {
                setActiveView('none');
                reloadCotizaciones();
              }}
              onCancel={() => setActiveView('none')}
              idCliente={idCliente}
              nombreCliente={nombreCliente}
            />
          )}

            {activeView === 'details' && idCotizacionSeleccionada && (
              <CotizacionesByIdOrden idCotizacion={idCotizacionSeleccionada} onBack={() => setActiveView('none')} onCambioSuccess={() => {
                setActiveView('none');
                reloadCotizaciones();
              }} />
            )}
        </div>
    </div>
  );
};

export default CotizacionesOrden;