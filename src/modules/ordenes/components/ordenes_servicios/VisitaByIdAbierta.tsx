import React, { useState, useEffect } from 'react';
import { getVisitaById, updateVisita } from '../../../visitas/services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ActividadesVisitas from './ActividadesVisitas';
import ActividadesEjecutar from '../../../visitas/components/visitas/ActividadesEjecutar';
import LockIcon from '@mui/icons-material/Lock';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/VisitaByIdAbierta.css'

interface VisitaByIdAbiertaProps {
  idVisita: string;
  onClose: () => void;

}

const VisitaByIdAbierta: React.FC<VisitaByIdAbiertaProps> = ({ idVisita, onClose }) => {
  const [visita, setVisita] = useState<any>(null);
  const token = useSessionStorage('sessionJWTToken');
  const userId = useSessionStorage('userId');

  const [showEstadoSection, setShowEstadoSection] = useState<boolean>(true); 
  const [mostrarActividadesEjecutar, setMostrarActividadesEjecutar] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeObservations, setCloseObservations] = useState('');
  
  
  useEffect(() => {
    if (token && idVisita) {
      getVisitaById(token, idVisita)
        .then(data => {
          setVisita(data);
          setMostrarActividadesEjecutar(false);
        })
        .catch(error => console.error('Error al obtener la visita por ID:', error));
    }
  }, [token, idVisita]); // Dependencia añadida para detectar cambios en idVisita

  const handleCloseVisita = async () => {
    const now = new Date();
    const fechaCierre = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    console.log(fechaCierre);
    const visitaData = {
      id_visita_estado: "65c560c4cb319b5fbc4220d7", // Estado de visita cerrada
      observacion_aprobacion: closeObservations, // Observaciones del modal
      id_cerrador: userId, // ID del usuario que cierra la visita
      fecha_cierre: fechaCierre,
    };

    try {
      await updateVisita(token, idVisita, visitaData);
      // Aquí puedes optar por cerrar el modal y notificar al usuario del éxito
      setShowCloseModal(false);
      window.alert(`Visita con ID: ${idVisita} cerrada satisfactoriamente`);
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar la visita:', error);
      // Manejar el error, posiblemente notificar al usuario
    }
  };

  // Manejador para el clic del botón de play/pausa
  const handleIconClick = () => {
    setMostrarActividadesEjecutar(!mostrarActividadesEjecutar);
    setIsPaused(!isPaused);
  };

  const handleBackIconCloseComponent = () => {
    setShowEstadoSection(false);
    onClose();
  };

  const handleLockIconClick = () => {
    setShowCloseModal(true);
  };
  
  

  return (
    <div>
      {/* Renderiza los detalles de la visita aquí */}
      {visita && (
        <div>
           <div className="VisitaByIdAbierta-visita-abierta">
                <div className="VisitaByIdAbierta-div">
                  <header className="VisitaByIdAbierta-header">
                    <div className="VisitaByIdAbierta-overlap-group">
                      <div className="VisitaByIdAbierta-visita-title">VISITA SELECCIONADA - {visita && visita._id || 'N/A'}</div>
                    </div>
                  </header>
                  <ArrowBackIcon className="VisitaByIdAbierta-back-icon" onClick={handleBackIconCloseComponent}/>

                  {isPaused ? (
                      <PauseCircleIcon className="VisitaByIdAbierta-pause-icon" onClick={handleIconClick} />
                      
                    ) : (
                      <PlayCircleFilledIcon className="VisitaByIdAbierta-execute-icon" onClick={handleIconClick} />
                    )}

                  <LockIcon className="VisitaByIdAbierta-close-icon" onClick={handleLockIconClick} />


                  {showCloseModal && (
                      <div className="VisitaByIdAbierta-modal-overlay">
                        <div className="VisitaByIdAbierta-modal-content">
                          <h3 className='VisitaByIdAbierta-modal-content-title'>Ingrese las observaciones de cierre para la visita:</h3>
                          <textarea
                            className="VisitaByIdAbierta-textarea"
                            value={closeObservations}
                            onChange={(e) => setCloseObservations(e.target.value)}
                            placeholder='Observaciones...'
                          />
                          <div className="VisitaByIdAbierta-modal-actions">
                            <button className="VisitaByIdAbierta-modal-cancel-button" onClick={() => setShowCloseModal(false)}>Cancelar</button>
                            <button className="VisitaByIdAbierta-close-observacion-button" onClick={handleCloseVisita}>Cerrar Visita</button>
                          </div>
                        </div>
                      </div>
                    )}


                  <div className="VisitaByIdAbierta-overlap">
                    <div className="VisitaByIdAbierta-ejecucion-div">
                      <div className="VisitaByIdAbierta-overlap-2">
                        <div className="VisitaByIdAbierta-container" />
                        <div className="VisitaByIdAbierta-info-execution">
                          <div className="VisitaByIdAbierta-info-title">INFO EJECUCIÓN</div>
                          <CalendarMonthIcon className="VisitaByIdAbierta-date-icon" />
                          <div className="VisitaByIdAbierta-date-t">{visita && visita.fecha_inicio || 'N/A'}</div>
                          <AccessTimeFilledIcon className="VisitaByIdAbierta-time-icon"/>
                          <div className="VisitaByIdAbierta-time-title">{visita && visita.duracion || 'N/A'}</div>
                        </div>
                        <div className="VisitaByIdAbierta-separator">
                          <div className="VisitaByIdAbierta-overlap-3">
                            <div className="VisitaByIdAbierta-ellipse" />
                            <div className="VisitaByIdAbierta-line"/>
                          </div>
                          <div className="VisitaByIdAbierta-overlap-group-2">
                            <div className="VisitaByIdAbierta-line-2"/>
                          </div>
                        </div>
                        <div className="VisitaByIdAbierta-tecnico-section">
                          <div className="VisitaByIdAbierta-tecnico-title">TÉCNICO ENCARGADO</div>
                          <div className="VisitaByIdAbierta-tecnico-oid">ID: {visita && visita.id_responsable._id || 'N/A'}</div>
                          <EngineeringIcon className="VisitaByIdAbierta-tecnico-icon"/>
                          <div className="VisitaByIdAbierta-tecnico-name">{visita && visita.id_responsable.username || 'N/A'}</div>
                          <ContactEmergencyIcon className="VisitaByIdAbierta-id-icon"/>
                          <div className="VisitaByIdAbierta-cedula-value">{visita && visita.id_responsable.cedula || 'N/A'}</div>
                          <EmailIcon className="VisitaByIdAbierta-email-icon"/>
                          <div className="VisitaByIdAbierta-email-value">{visita && visita.id_responsable.email || 'N/A'}</div>
                          <LocalPhoneIcon className="VisitaByIdAbierta-telephone-icon"/>
                          <div className="VisitaByIdAbierta-telephone-value">{visita && visita.id_responsable.telefono || 'N/A'}</div>
                        </div>
                        <div className="VisitaByIdAbierta-separator-2">
                          <div className="VisitaByIdAbierta-overlap-3">
                            <div className="VisitaByIdAbierta-ellipse" />
                            <div className="VisitaByIdAbierta-line"/>
                          </div>
                          <img className="VisitaByIdAbierta-line-3"/>
                        </div>
                          <div className="VisitaByIdAbierta-protocolos-title">ACTIVIDADES PROGRAMADAS</div>
                        <div className="VisitaByIdAbierta-actividades-list">
                          <ul className="VisitaByIdAbierta-actividades-ul">
                            {visita && visita.ids_protocolos && visita.ids_protocolos.map((protocolo: any) => (

                              <li className="VisitaByIdAbierta-rectangle" key={protocolo._id}>
                                {protocolo.title}
                              </li> 
                             ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="VisitaByIdAbierta-estado-div">
                      <div className="VisitaByIdAbierta-overlap-4">
                        <div className="VisitaByIdAbierta-overlap-5">
                          <div className="VisitaByIdAbierta-overlap-group-3">
                            <div className="VisitaByIdAbierta-estado-title">ESTADO</div>
                            <LockOpenIcon className="VisitaByIdAbierta-estado-icon"/>
                          </div>
                          <div className="VisitaByIdAbierta-line-4"/>
                          <div className="VisitaByIdAbierta-observacion-t">OBSERVACIÓN</div>
                          <div className="VisitaByIdAbierta-observacion-value">{visita && visita.observacion_aprobacion || 'N/A'}</div>
                        </div>
                        <div className="VisitaByIdAbierta-aproved-t">APROBADA POR:</div>
                        <div className="VisitaByIdAbierta-aprobador-value">{visita.id_aprobador && visita.id_aprobador.username || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="VisitaByIdAbierta-creation-div">
                      <div className="VisitaByIdAbierta-overlap-6">
                        <div className="VisitaByIdAbierta-creation-info">INFO CREACIÓN</div>
                        <CalendarTodayIcon className="VisitaByIdAbierta-created-icon"/>
                        <div className="VisitaByIdAbierta-created-date">{visita && visita.fecha_creacion || 'N/A'}</div>


                        <div className="VisitaByIdAbierta-insede-t">EJECUTAR EN SEDE:</div>
                        <div className={`VisitaByIdAbierta-switch ${visita.ejecutar_sede ? 'VisitaByIdAbierta-on' : 'VisitaByIdAbierta-off'}`}>
                          <input
                          className="VisitaByIdAbierta-ejecutar-input"
                          type="checkbox"
                          checked={visita.ejecutar_sede}
                          readOnly
                          />
                          <span className='VisitaByIdAbierta-slider VisitaByIdAbierta-round'></span>
                        </div>


                        <div className="VisitaByIdAbierta-separator-3">
                          <div className="VisitaByIdAbierta-overlap-group-4">
                            <div className="VisitaByIdAbierta-ellipse-2" />
                            <div className="VisitaByIdAbierta-line-5"/>
                            <div className="VisitaByIdAbierta-line-6"/>
                          </div>
                        </div>
                        <div className="VisitaByIdAbierta-creator-title">CREADOR</div>
                        <PersonIcon className="VisitaByIdAbierta-user-i"/>
                        <div className="VisitaByIdAbierta-user-t">{visita && visita.id_creador.username || 'N/A'}</div>
                        <EmailIcon className="VisitaByIdAbierta-id-i"/>
                        <div className="VisitaByIdAbierta-text-wrapper">{visita && visita.id_creador.cedula || 'N/A'}</div>
                        <LocalPhoneIcon className="VisitaByIdAbierta-email"/>
                        <div className="VisitaByIdAbierta-email-t">{visita && visita.id_creador.email || 'N/A'}</div>
                        <LocalPhoneIcon className="VisitaByIdAbierta-telephone-i"/>
                        <div className="VisitaByIdAbierta-telephone-t">{visita && visita.id_creador.telefono || 'N/A'}</div>
                      </div>
                    </div>

                    {/* RENDERIZADO ACTIVIDADES EJECUTADAS EN VISITA ABIERTA */}
                    {visita.actividades && visita.actividades.length > 0 && !mostrarActividadesEjecutar && (
                      <ActividadesVisitas idVisita={idVisita} />
                    )}

                    {/* RENDERIZADO ACTIVIDADES A EJECUTAR */}
                    {mostrarActividadesEjecutar ? (
                      <ActividadesEjecutar idVisita={idVisita} />
                    ) : null}
                  </div>
                </div>
              </div>
        </div>
      )}

       
       
    </div>
  );
};

export default VisitaByIdAbierta;
