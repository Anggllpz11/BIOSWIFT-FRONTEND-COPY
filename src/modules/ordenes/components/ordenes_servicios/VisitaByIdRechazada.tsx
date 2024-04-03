import React, { useState, useEffect } from 'react';
import { getVisitaById } from '../../../visitas/services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';

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
import './styles/VisitaRechazada.css'

interface VisitaByIdRechazadaProps {
  idVisita: string;
  onClose: () => void;
}

const VisitaByIdRechazada: React.FC<VisitaByIdRechazadaProps> = ({ idVisita, onClose }) => {
  const [visita, setVisita] = useState<any>(null);
  const token = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    if (token && idVisita) {
      getVisitaById(token, idVisita)
        .then(data => {
          setVisita(data);
        })
        .catch(error => console.error('Error al obtener la visita por ID:', error));
    }
  }, [token, idVisita]);
  const handleBackIconCloseComponent = () => {
    // Ocultar la sección de estado
    onClose();
  };
  
  return (
    <div>
      {visita && (
        <div>
           <div className="VisitaByIdRechazada-visita-rechazada">
                <div className="VisitaByIdRechazada-div">
                  <header className="VisitaByIdRechazada-header">
                    <div className="VisitaByIdRechazada-overlap-group">
                      <div className="VisitaByIdRechazada-text-wrapper">VISITA SELECCIONADA - {visita && visita._id || 'N/A'}</div>
                    </div>
                  </header>
                  <ArrowBackIcon className="VisitaByIdRechazada-ejecutar-icon" onClick={handleBackIconCloseComponent}/>
                  <div className="VisitaByIdRechazada-overlap">
                    <div className="VisitaByIdRechazada-ejecucion-div">
                      <div className="VisitaByIdRechazada-overlap-2">
                        <div className="VisitaByIdRechazada-rectangle" />
                        <div className="VisitaByIdRechazada-text-wrapper-2">INFO EJECUCIÓN</div>
                        <CalendarMonthIcon className="VisitaByIdRechazada-ejecucion-icon"/>
                        <div className="VisitaByIdRechazada-ejecucion-data">{visita && visita.fecha_inicio || 'N/A'}</div>
                        <AccessTimeFilledIcon className="VisitaByIdRechazada-time-icon"/>
                        <div className="VisitaByIdRechazada-time-data">{visita && visita.duracion || 'N/A'}</div>
                        <div className="VisitaByIdRechazada-separator">
                          <div className="VisitaByIdRechazada-overlap-group-2">
                            <div className="VisitaByIdRechazada-ellipse" />
                            <div className="VisitaByIdRechazada-line"/>
                          </div>
                          <div className="VisitaByIdRechazada-overlap-3">
                            <div className="VisitaByIdRechazada-img"/>
                            <div className="VisitaByIdRechazada-line-2" />
                          </div>
                        </div>
                        <div className="VisitaByIdRechazada-tecnico-title">TÉCNICO ENCARGADO</div>
                        <div className="VisitaByIdRechazada-tecnico-oid">ID: {visita && visita.id_responsable._id || 'N/A'}</div>
                        <EngineeringIcon className="VisitaByIdRechazada-tecnico-icon"/>
                        <div className="VisitaByIdRechazada-tecnico-name">{visita && visita.id_responsable.username || 'N/A'}</div>
                        <ContactEmergencyIcon className="VisitaByIdRechazada-cedula-icon"/>
                        <div className="VisitaByIdRechazada-cedula-name">{visita && visita.id_responsable.cedula || 'N/A'}</div>
                        <EmailIcon className="VisitaByIdRechazada-email-icon"/>
                        <div className="VisitaByIdRechazada-email-data">{visita && visita.id_responsable.email || 'N/A'}</div>
                        <LocalPhoneIcon className="VisitaByIdRechazada-telephone-icon"/>
                        <div className="VisitaByIdRechazada-telephone-data">{visita && visita.id_responsable.telefono || 'N/A'}</div>
                        <div className="VisitaByIdRechazada-separator-2">
                          <div className="VisitaByIdRechazada-overlap-group-2">
                            <div className="VisitaByIdRechazada-ellipse" />
                            <div className="VisitaByIdRechazada-line"/>
                          </div>
                          <div className="VisitaByIdRechazada-overlap-3">
                            <div className="VisitaByIdRechazada-img"/>
                            <div className="VisitaByIdRechazada-line-2"/>
                          </div>
                        </div>
                        <div className="VisitaByIdRechazada-protocolos-title">ACTIVIDADES PROGRAMADAS</div>

                        <div className="VisitaByIdRechazada-actividades-list">
                          <ul>
                        {visita && visita.ids_protocolos && visita.ids_protocolos.map((protocolo: any) => (
                            <li className="VisitaByIdRechazada-rectangle-2" key={protocolo._id}>
                              {protocolo.title}
                            </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>
                    <div className="VisitaByIdRechazada-change-estado">
                      <div className="VisitaByIdRechazada-overlap-4">
                        <div className="VisitaByIdRechazada-estado-t">ESTADO</div>
                        <DoNotDisturbAltIcon className="VisitaByIdRechazada-decline-icon"/>
                        <div className="VisitaByIdRechazada-rechazada-t">Rechazada</div>
                        <div className="VisitaByIdRechazada-separator-estado"/>
                        <div className="VisitaByIdRechazada-observacion-t">OBSERVACION RECHAZO</div>
                        <div className="VisitaByIdRechazada-text-wrapper-3">{visita && visita.observacion_aprobacion || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="VisitaByIdRechazada-creation-div">
                      <div className="VisitaByIdRechazada-overlap-5">
                        <div className="VisitaByIdRechazada-creation-t">INFO CREACIÓN</div>
                        <CalendarTodayIcon className="VisitaByIdRechazada-created-icon"/>
                        <div className="VisitaByIdRechazada-created-date">{visita && visita.fecha_creacion || 'N/A'}</div>

                        <div className="VisitaByIdRechazada-sede-ejecutar">EJECUTAR EN SEDE:</div>
                        <div className={`VisitaByIdRechazada-switch ${visita.ejecutar_sede ? 'VisitaByIdRechazada-on' : 'VisitaByIdRechazada-off'}`}>
                          <input
                          className="VisitaByIdRechazada-ejecutar-input"
                          type="checkbox"
                          checked={visita.ejecutar_sede}
                          readOnly
                          />
                          <span className='VisitaByIdRechazada-slider VisitaByIdRechazada-round'></span>
                        </div>


                        <div className="VisitaByIdRechazada-separator-3">
                          <div className="VisitaByIdRechazada-overlap-group-3">
                            <div className="VisitaByIdRechazada-elipse" />
                            <div className="VisitaByIdRechazada-line-3"/>
                          </div>
                          <div className="VisitaByIdRechazada-line-4"/>
                        </div>
                        <div className="VisitaByIdRechazada-creator-title">CREADOR</div>
                        <PersonIcon className="VisitaByIdRechazada-tecnico-i"/>
                        <div className="VisitaByIdRechazada-tecnico-n">{visita && visita.id_creador.username || 'N/A'}</div>
                        <ContactEmergencyIcon className="VisitaByIdRechazada-cedula-i"/>
                        <div className="VisitaByIdRechazada-cedula-n">{visita && visita.id_creador.cedula || 'N/A'}</div>
                        <EmailIcon className="VisitaByIdRechazada-email-i"/>
                        <div className="VisitaByIdRechazada-email-n">{visita && visita.id_creador.email || 'N/A'}</div>
                        <LocalPhoneIcon className="VisitaByIdRechazada-telephone-i"/>
                        <div className="VisitaByIdRechazada-telephone-n">{visita && visita.id_creador.telefono || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

        </div>
      )}
    </div>
  );
};

export default VisitaByIdRechazada;
