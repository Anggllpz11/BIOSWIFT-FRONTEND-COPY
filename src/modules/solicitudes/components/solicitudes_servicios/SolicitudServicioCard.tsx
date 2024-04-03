// SolicitudServicioCard.tsx
import React from 'react';
import { SolicitudServicio } from '../../utils/types/SolicitudServicio.type'; // Asegúrate de importar el tipo correctamente
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
interface SolicitudServicioCardProps {
  solicitud: SolicitudServicio;
  onClick: () => void;
}

const SolicitudServicioCard: React.FC<SolicitudServicioCardProps> = ({ solicitud, onClick }) => {
  // Función para seleccionar el icono según el estado
  const renderEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <HelpOutlinedIcon className="SolicitudServicioCard-estado-pendiente" />;
      case 'Aprobada':
        return <CheckCircleIcon className="SolicitudServicioCard-estado-aprobada" />;
      case 'Rechazada':
        return <CancelIcon className="SolicitudServicioCard-estado-rechazada" />;
      default:
        return null; // o puedes poner un icono por defecto
    }
  };
  return (
    <div key={solicitud._id} className='SolicitudServicioPages-container-card'>
      <div className='SolicitudServicioPages-card-section'>
        <ul className='SolicitudServicioPages-cards-list'>
          <li className='SolicitudServicioPages-cards-list'>
              <div className='SolicitudServicioPages-card-overlay' onClick={onClick}>
                  <div className="SolicitudServicioCard-container">
                    <div className="SolicitudServicioCard-div">
                      <div className="SolicitudServicioCard-overlap-group">
                        <header className="SolicitudServicioCard-header">
                          <div className="SolicitudServicioCard-rectangle" />
                        </header>
                        <div className="SolicitudServicioCard-header-info">
                          <div className="SolicitudServicioCard-servicio-title">{solicitud.id_servicio.servicio}</div>
                          <div className="SolicitudServicioCard-creation-date">{solicitud.creacion}</div>
                          <div className="SolicitudServicioCard-oid-solicitud">{solicitud._id}</div>
                           {/* Renderizar el icono de estado adecuado */}
                           {renderEstadoIcon(solicitud.id_solicitud_estado.estado)}
                          <div className="SolicitudServicioCard-username">{solicitud.id_cambiador.name}</div>
                          <PublishedWithChangesOutlinedIcon className="SolicitudServicioCard-update-icon"/>
                        </div>
                      </div>
                      <div className="SolicitudServicioCard-overlap">
                        <div className="SolicitudServicioCard-separator" />
                        <div className="SolicitudServicioCard-equipo-info">
                          <div className="SolicitudServicioCard-info-title">EQUIPO INFO</div>
                          <div className="SolicitudServicioCard-equipo-class">{solicitud.id_equipo.modelo_equipos.id_clase.clase}</div>
                          <div className="SolicitudServicioCard-oid-equipo">SERIE</div>
                          <div className="SolicitudServicioCard-text-wrapper">{solicitud.id_equipo.serie}</div>
                        </div>
                        <div className="SolicitudServicioCard-sede-info">
                          <div className="SolicitudServicioCard-info-sede-title">SEDE</div>
                          <div className="SolicitudServicioCard-sede-name">{solicitud.id_equipo.id_sede.sede_nombre}</div>
                          <div className="SolicitudServicioCard-oid-sede">CLIENTE</div>
                          <p className="SolicitudServicioCard-text-wrapper">{solicitud.id_equipo.id_sede.id_client.client_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
          </li>


        </ul>
      </div>
    </div>
  );
};

export default SolicitudServicioCard;
