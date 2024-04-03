import React, { useState, useEffect } from 'react';
import { getVisitaById, updateVisita } from '../../../visitas/services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';

// STYLES
import './styles/VisitaByIdPendiente.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import HelpIcon from '@mui/icons-material/Help';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface VisitaByIdPendienteProps {
  idVisita: string;
  onClose: () => void;
}

const VisitaByIdPendiente: React.FC<VisitaByIdPendienteProps> = ({ idVisita, onClose  }) => {
  const [visita, setVisita] = useState<any>(null);
  const [approvalStatus, setApprovalStatus] = useState<boolean | null>(null);
  const [showEstadoSection, setShowEstadoSection] = useState<boolean>(true); 
  const [observacionAprobacion, setObservacionAprobacion] = useState<string>('');
  const token = useSessionStorage('sessionJWTToken');
  const userId = useSessionStorage('userId');

  useEffect(() => {
    if (token && idVisita) {
      getVisitaById(token, idVisita)
        .then(data => {
          setVisita(data);
        })
        .catch(error => console.error('Error al obtener la visita por ID:', error));
    }
  }, [token, idVisita]);

// Función para manejar la aprobación de la visita
const handleApproval = (isApproved: boolean) => {
  // Actualizar el estado de aprobación
  setApprovalStatus(isApproved);
  // Volver a mostrar la sección de estado
  setShowEstadoSection(true);
  // Aquí puedes agregar lógica adicional para enviar el estado de aprobación al backend si es necesario
};

const handleUpdateEstado = () => {
  if (token && idVisita && approvalStatus !== null) {
    const estadoId = approvalStatus ? '65c560b5cb319b5fbc4220d3' : '65c560c8cb319b5fbc4220d9';
    const dataToUpdate = {
      id_visita_estado: estadoId,
      observacion_aprobacion: observacionAprobacion,
      id_aprobador: userId
    };
    updateVisita(token, idVisita, dataToUpdate)
      .then(() => {
        const message = approvalStatus ? 'Visita APROBADA exitosamente' : 'Visita RECHAZADA exitosamente';
        window.alert(message);
        window.location.reload();
      })
      .catch(error => console.error('Error al actualizar la visita:', error));
  }
};
const handleBackIconClickEstado = () => {
  // Ocultar la sección de estado
  setShowEstadoSection(false);
};

const handleBackIconCloseComponent = () => {
  // Ocultar la sección de estado
  setShowEstadoSection(false);
  onClose();
};


  return (
    <div>
      {/* Renderiza los detalles de la visita aquí */}
      {visita && (
        <div>
          {/* <p>ID Visita: {visita._id}</p>
          <p>Estado: {visita.id_visita_estado.estado}</p> */}
           <div className="VisitaByIdPendiente-visita-pendiente">
                <div className="VisitaByIdPendiente-div">
                  <header className="VisitaByIdPendiente-header">
                    <div className="VisitaByIdPendiente-overlap-group">
                      <div className="VisitaByIdPendiente-text-wrapper">VISITA SELECCIONADA - {visita && visita._id || 'N/A'}</div>
                    </div>
                  </header>
                  <ArrowBackIcon className="VisitaByIdPendiente-ejecutar-icon" onClick={handleBackIconCloseComponent}/>
                  <div className="VisitaByIdPendiente-overlap">
                    <div className="VisitaByIdPendiente-ejecucion-div">
                      <div className="VisitaByIdPendiente-overlap-2">
                        <div className="VisitaByIdPendiente-rectangle" />
                        <div className="VisitaByIdPendiente-text-wrapper-2">INFO EJECUCIÓN</div>
                        <CalendarMonthIcon className="VisitaByIdPendiente-ejecucion-icon"/>
                        <div className="VisitaByIdPendiente-ejecucion-data">{visita && visita.fecha_inicio || 'N/A'}</div>
                        <AccessTimeFilledIcon className="VisitaByIdPendiente-time-icon"/>
                        <div className="VisitaByIdPendiente-time-data">{visita && visita.duracion || 'N/A'}</div>
                        <div className="VisitaByIdPendiente-separator">
                          <div className="VisitaByIdPendiente-overlap-group-2">
                            <div className="VisitaByIdPendiente-ellipse" />
                            <div className="VisitaByIdPendiente-line"/>
                            <div className="VisitaByIdPendiente-line2"/>
                          </div>
                          <div className="VisitaByIdPendiente-overlap-3">
                            <div className="VisitaByIdPendiente-img"/>
                            <div className="VisitaByIdPendiente-line-2"/>
                          </div>
                        </div>
                        <div className="VisitaByIdPendiente-tecnico-title">TÉCNICO ENCARGADO</div>
                        <div className="VisitaByIdPendiente-tecnico-oid">ID: {visita && visita.id_responsable._id || 'N/A'}</div>
                        <EngineeringIcon className="VisitaByIdPendiente-tecnico-icon"/>
                        <div className="VisitaByIdPendiente-tecnico-name">{visita && visita.id_responsable.username || 'N/A'}</div>
                        <ContactEmergencyIcon className="VisitaByIdPendiente-cedula-icon"/>
                        <div className="VisitaByIdPendiente-cedula-name">{visita && visita.id_responsable.cedula || 'N/A'}</div>
                        <EmailIcon className="VisitaByIdPendiente-email-icon"/>
                        <div className="VisitaByIdPendiente-email-data">{visita && visita.id_responsable.email || 'N/A'}</div>
                        <LocalPhoneIcon className="VisitaByIdPendiente-telephone-icon"/>
                        <div className="VisitaByIdPendiente-telephone-data">{visita && visita.id_responsable.telefono || 'N/A'}</div>
                        <div className="VisitaByIdPendiente-separator-2">
                          <div className="VisitaByIdPendiente-overlap-group-2">
                            <div className="VisitaByIdPendiente-ellipse" />
                            <div className="VisitaByIdPendiente-line"/>
                          </div>
                          <div className="VisitaByIdPendiente-overlap-3">
                            <div className="VisitaByIdPendiente-img"/>
                            {/* <div className="line-2" /> */}
                          </div>
                        </div>
                        <div className="VisitaByIdPendiente-protocolos-title">ACTIVIDADES PROGRAMADAS</div>
                        <div className="VisitaByIdPendiente-actividades-list">
                          <ul>
                            {visita && visita.ids_protocolos && visita.ids_protocolos.map((protocolo: any) => (
                              <li key={protocolo._id} className="VisitaByIdPendiente-rectangle-2">
                                {protocolo.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="VisitaByIdPendiente-change-estado">
                      <div className="VisitaByIdPendiente-overlap-4">
                        <div className="VisitaByIdPendiente-text-wrapper-3">ESTADO</div>
                        <HelpIcon className="VisitaByIdPendiente-img-2-pending"/>
                        <div className="VisitaByIdPendiente-separator-estado"/>
                        <DoNotDisturbAltIcon className="VisitaByIdPendiente-decline-icon" onClick={() => handleApproval(false)}/>
                        <div className="VisitaByIdPendiente-decline-t">Rechazar</div>
                        <LockOpenIcon className="VisitaByIdPendiente-aprove-icon" onClick={() => handleApproval(true)}/>
                        <div className="VisitaByIdPendiente-aprove-t">Aprobar</div>
                      </div>
                    </div>
                    <div className="VisitaByIdPendiente-creation-div">
                      <div className="VisitaByIdPendiente-overlap-5">
                        <div className="VisitaByIdPendiente-creation-t">INFO CREACIÓN</div>
                        <CalendarTodayIcon className="VisitaByIdPendiente-created-icon"/>
                        <div className="VisitaByIdPendiente-created-date">{visita && visita.fecha_creacion || 'N/A'}</div>
                        <div className="VisitaByIdPendiente-sede-ejecutar">EJECUTAR EN SEDE:</div>

                        <div className={`VisitaByIdPendiente-ejecutar-switch ${visita.ejecutar_sede ? 'on' : 'off'}`}>
                          <input
                            className='VisitaByIdPendiente-ejecutar-input'
                            type="checkbox"
                            checked={visita.ejecutar_sede}
                            readOnly
                          />
                          <span className="VisitaByIdPendiente-slider round"></span>
                        </div>


                        <div className="VisitaByIdPendiente-separator-3">
                          <div className="VisitaByIdPendiente-overlap-group-3">
                            <div className="VisitaByIdPendiente-elipse" />
                            <div className="VisitaByIdPendiente-line-3"/>
                          </div>
                          <img className="VisitaByIdPendiente-line-4" />
                        </div>
                        <div className="VisitaByIdPendiente-creator-title">CREADOR</div>
                        <PersonIcon className="VisitaByIdPendiente-tecnico-i"/>
                        <div className="VisitaByIdPendiente-tecnico-n">{visita && visita.id_creador.username || 'N/A'}</div>
                        <ContactEmergencyIcon className="VisitaByIdPendiente-cedula-i"/>
                        <div className="VisitaByIdPendiente-cedula-n">{visita && visita.id_creador.cedula || 'N/A'}</div>
                        <EmailIcon className="VisitaByIdPendiente-email-i"/>
                        <div className="VisitaByIdPendiente-email-n">{visita && visita.id_creador.email || 'N/A'}</div>
                        <LocalPhoneIcon className="VisitaByIdPendiente-telephone-i"/>
                        <div className="VisitaByIdPendiente-telephone-n">{visita && visita.id_creador.telefono || 'N/A'}</div>
                      </div>
                    </div>
                     {/* Renderizado condicional del estado */}
                    {showEstadoSection && approvalStatus !== null && (
                      <div className="VisitaByIdPendiente-estado-section">
                        <div className="VisitaByIdPendiente-overlap-4">
                          <div className="VisitaByIdPendiente-text-wrapper-3">ESTADO</div>
                          {approvalStatus ? <CheckCircleIcon className="VisitaByIdPendiente-img-2-aprooved" /> : <DoNotDisturbAltIcon className="VisitaByIdPendiente-img-2-rejected" />}
                          <div className="VisitaByIdPendiente-estado-text">{approvalStatus ? 'Aprobando visita' : 'Rechazando visita'}</div>
                          <div className="VisitaByIdPendiente-separator-4"/>
                          <div className="VisitaByIdPendiente-observacion-title">OBSERVACIÓN ESTADO</div>
                          <input
                            type="text"
                            value={observacionAprobacion}
                            onChange={(e) => setObservacionAprobacion(e.target.value)}
                            placeholder="Ingrese observación"
                            className="VisitaByIdPendiente-observacion-text"
                          />
                          <button className='VisitaByIdPendiente-update-estado-button' onClick={handleUpdateEstado}>Actualizar</button>
                          <ArrowBackIcon className="VisitaByIdPendiente-back-icon" onClick={handleBackIconClickEstado}/>
                        </div>
                      </div>
                     )}
                  </div>
                </div>
              </div>

        </div>
      )}
    </div>
  );
};

export default VisitaByIdPendiente;
