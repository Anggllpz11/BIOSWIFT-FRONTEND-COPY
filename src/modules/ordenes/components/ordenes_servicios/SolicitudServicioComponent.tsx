import React from 'react';
import { SolicitudServicio } from '../../../solicitudes/utils/types/SolicitudServicio.type';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import DescriptionIcon from '@mui/icons-material/Description';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ClassIcon from '@mui/icons-material/Class';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useNavigate } from 'react-router-dom';

interface SolicitudServicioComponentProps {
  solicitudServicio: SolicitudServicio;
}

const SolicitudServicioComponent: React.FC<SolicitudServicioComponentProps> = ({ solicitudServicio }) => {
  const navigate = useNavigate();

  const renderEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <HelpOutlinedIcon className="SolicitudServicioComponent-estado-pendiente" />;
      case 'Aprobada':
        return <CheckCircleIcon className="SolicitudServicioComponent-estado-aprobada" />;
      case 'Rechazada':
        return <CancelIcon className="SolicitudServicioComponent-estado-rechazada" />;
      default:
        return null; // o puedes poner un icono por defecto
    }
  };

  const handleClickIdCreador = () => {
    if (solicitudServicio !== null && solicitudServicio.id_creador) {
      navigate(`/users/${solicitudServicio.id_creador._id}`);
    }
  };
  
  const handleClickIdCambiador = () => {
    if (solicitudServicio !== null && solicitudServicio.id_cambiador) {
      navigate(`/users/${solicitudServicio.id_cambiador._id}`);
    }
  };
  
  const handleClickIdCliente = () => {
    if (solicitudServicio !== null && solicitudServicio.id_equipo.id_sede.id_client._id) {
      navigate(`/clientes/${solicitudServicio.id_equipo.id_sede.id_client._id}`);
    }
  };

  const handleClickIdEquipo = () => {
    if (solicitudServicio !== null && solicitudServicio.id_equipo._id) {
      navigate(`/equipos/${solicitudServicio.id_equipo._id}`);
    }
  };

  const handleClickIdSede = () => {
    if (solicitudServicio !== null && solicitudServicio.id_equipo.id_sede._id) {
      navigate(`/sedes/${solicitudServicio.id_equipo.id_sede._id}`);
    }
  };
  const handleClickIdSolicitud = () => {
    if (solicitudServicio !== null && solicitudServicio._id) {
      navigate(`/solicitudes-servicios/${solicitudServicio._id}`);
    }
  };
  return (
    <div>
      <p>ID Solicitud Servicio: {solicitudServicio._id || 'N/A'}</p>
      <p>ID Creador: {solicitudServicio.id_creador._id || 'N/A'}</p>
      <p>ID Servicio: {solicitudServicio.id_servicio._id || 'N/A'}</p>
      <p>ID Equipo: {solicitudServicio.id_equipo._id || 'N/A'}</p>
      {/* Agrega más detalles de la solicitud de servicio aquí si es necesario */}
      <div className="SolicitudServicioComponent-solicitudes">
            <div className="SolicitudServicioComponent-div">
              <header className="SolicitudServicioComponent-header">
                <div className="SolicitudServicioComponent-overlap-group">
                  <p className="SolicitudServicioComponent-solicitud-id" onClick={handleClickIdSolicitud}>SOLICITUD DE SERVICIO - {solicitudServicio._id || 'N/A'}</p>
                </div>
              </header>
              <div className="SolicitudServicioComponent-geninfo-section">
                <div className="SolicitudServicioComponent-overlap">
                  <div className="SolicitudServicioComponent-geninfo-title">GENERAL</div>
                  <HomeRepairServiceIcon className="SolicitudServicioComponent-service-icon"/>
                  <div className="SolicitudServicioComponent-service-value">{solicitudServicio.id_servicio.servicio || 'N/A'}</div>
                  <CalendarMonthIcon className="SolicitudServicioComponent-created-icon"/>
                  <div className="SolicitudServicioComponent-created-value">{solicitudServicio.creacion || 'N/A'}</div>
                  <div className="SolicitudServicioComponent-geninfo-separator"/>
                  <AnnouncementIcon className="SolicitudServicioComponent-aviso-icon"/>
                  <div className="SolicitudServicioComponent-aviso-value">{solicitudServicio.aviso || 'N/A'}</div>
                  <DescriptionIcon className="SolicitudServicioComponent-observacion-icon"/>
                  <div className="SolicitudServicioComponent-observacion-value">{solicitudServicio.observacion || 'N/A'}</div>
                </div>
              </div>
              <div className="SolicitudServicioComponent-estado-section">
                <div className="SolicitudServicioComponent-overlap-2">
                {renderEstadoIcon(solicitudServicio.id_solicitud_estado.estado)}

                  <div className="SolicitudServicioComponent-estado-value">{solicitudServicio.id_solicitud_estado.estado || 'N/A'}</div>
                  <div className="SolicitudServicioComponent-estado-separator"/>
                  <div className="SolicitudServicioComponent-text-wrapper">{solicitudServicio.observacion_estado || 'N/A'}</div>
                </div>
              </div>
              <div className="SolicitudServicioComponent-creator-section">
                <div className="SolicitudServicioComponent-overlap-3">
                  <div className="SolicitudServicioComponent-overlap-4">
                    <div className="SolicitudServicioComponent-creador-title">CREADOR SOLICITUD</div>
                    <div className="SolicitudServicioComponent-creador-oid">ID: {solicitudServicio.id_creador._id || 'N/A'}</div>
                    <RemoveRedEyeIcon className="SolicitudServicioComponent-eye" onClick={handleClickIdCreador}/>
                  </div>
                  <div className="SolicitudServicioComponent-overlap-5">
                    <PersonIcon className="SolicitudServicioComponent-username-icon"/>
                    <div className="SolicitudServicioComponent-creador-username">{solicitudServicio.id_creador.username || 'N/A'}</div>
                    <CallIcon className="SolicitudServicioComponent-telephone-icon"/>
                    <div className="SolicitudServicioComponent-creador-telephone">{solicitudServicio.id_creador.telefono || 'N/A'}</div>
                    <div className="SolicitudServicioComponent-overlap-6">
                      <ContactEmergencyIcon className="SolicitudServicioComponent-cc-icon"/>
                      <div className="SolicitudServicioComponent-creador-cc">{solicitudServicio.id_creador.cedula || 'N/A'}</div>
                      <EmailIcon className="SolicitudServicioComponent-email-icon"/>
                      <div className="SolicitudServicioComponent-overlap-7">
                        <div className="SolicitudServicioComponent-creador-email">{solicitudServicio.id_creador.email || 'N/A'}</div>
                        <div className="SolicitudServicioComponent-separator-info">
                          <div className="SolicitudServicioComponent-overlap-group-2">
                            <div className="SolicitudServicioComponent-line"/>
                            <div className="SolicitudServicioComponent-img"/>
                            <div className="SolicitudServicioComponent-ellipse" />
                          </div>
                        </div>
                      </div>
                      <div className="SolicitudServicioComponent-separator"/>
                    </div>
                  </div>
                  <div className="SolicitudServicioComponent-overlap-8">
                    <div className="SolicitudServicioComponent-actualizador-title">ACTUALIZADOR ESTADO</div>
                    <div className="SolicitudServicioComponent-actualizador-oid">ID: {solicitudServicio.id_cambiador._id || 'N/A'}</div>
                    <RemoveRedEyeIcon className="SolicitudServicioComponent-eye" onClick={handleClickIdCambiador}/>
                  </div>
                  <PersonIcon className="SolicitudServicioComponent-user"/>
                  <div className="SolicitudServicioComponent-actualizador">{solicitudServicio.id_cambiador.username || 'N/A'}</div>
                  <ContactEmergencyIcon className="SolicitudServicioComponent-cc"/>
                  <div className="SolicitudServicioComponent-actualizador-cc">{solicitudServicio.id_cambiador.cedula || 'N/A'}</div>
                  <CallIcon className="SolicitudServicioComponent-telephone"/>
                  <div className="SolicitudServicioComponent-actualizador-2">{solicitudServicio.id_cambiador.telefono || 'N/A'}</div>
                  <EmailIcon className="SolicitudServicioComponent-email"/>
                  <div className="SolicitudServicioComponent-actualizador-email">{solicitudServicio.id_cambiador.email || 'N/A'}</div>
                  <div className="SolicitudServicioComponent-separator-2"/>
                </div>
              </div>
              <div className="SolicitudServicioComponent-equipo-section">
                <div className="SolicitudServicioComponent-overlap-9">
                  <div className="SolicitudServicioComponent-client-info">
                    <div className="SolicitudServicioComponent-overlap-group-3">
                      <div className="SolicitudServicioComponent-client-title">CLIENTE</div>
                      <RemoveRedEyeIcon className="SolicitudServicioComponent-eye-2" onClick={handleClickIdCliente}/>
                    </div>
                    <div className="SolicitudServicioComponent-client-oid">ID: {solicitudServicio.id_equipo.id_sede.id_client._id || 'N/A'}</div>
                    <AccountBalanceIcon className="SolicitudServicioComponent-clientname-icon"/>
                    <div className="SolicitudServicioComponent-clientname-value">{solicitudServicio.id_equipo.id_sede.id_client.client_name || 'N/A'}</div>
                    <ReceiptLongIcon className="SolicitudServicioComponent-nit-icon"/>
                    <div className="SolicitudServicioComponent-nit-value">{solicitudServicio.id_equipo.id_sede.id_client.client_nit || 'N/A'}</div>
                    <CallIcon className="SolicitudServicioComponent-clientphone-icon"/>
                    <div className="SolicitudServicioComponent-clientphone-value">{solicitudServicio.id_equipo.id_sede.id_client.client_telefono || 'N/A'}</div>
                    <div className="SolicitudServicioComponent-clientinfo-separator"/>
                    <EmailIcon className="SolicitudServicioComponent-clientemail-icon"/>
                    <div className="SolicitudServicioComponent-clientemail-value">{solicitudServicio.id_equipo.id_sede.id_client.client_email || 'N/A'}</div>
                  </div>
                  <div className="SolicitudServicioComponent-separator-info-2">
                    <div className="SolicitudServicioComponent-line-2" />
                    <div className="SolicitudServicioComponent-line-3"/>
                    <div className="SolicitudServicioComponent-ellipse-2" />
                  </div>
                </div>
                <div className="SolicitudServicioComponent-equipo-info">
                  <div className="SolicitudServicioComponent-overlap-10">
                    <div className="SolicitudServicioComponent-equipo-title">EQUIPO</div>
                    <div className="SolicitudServicioComponent-equipo-oid">ID: {solicitudServicio.id_equipo._id || 'N/A'}</div>
                    <RemoveRedEyeIcon className="SolicitudServicioComponent-eye-3" onClick={handleClickIdEquipo} />
                  </div>
                  <ClassIcon className="SolicitudServicioComponent-class-icon"/>
                  <div className="SolicitudServicioComponent-class-value">{solicitudServicio.id_equipo.modelo_equipos.id_clase.clase || 'N/A'}</div>
                  <LocalOfferOutlinedIcon className="SolicitudServicioComponent-marca-icon"/>
                  <div className="SolicitudServicioComponent-marca-value">{solicitudServicio.id_equipo.modelo_equipos.id_marca.marca || 'N/A'}</div>
                  <DevicesOtherOutlinedIcon className="SolicitudServicioComponent-model-icon"/>
                  <div className="SolicitudServicioComponent-model-value">{solicitudServicio.id_equipo.modelo_equipos.modelo || 'N/A'}</div>
                  <div className="SolicitudServicioComponent-equipoinfo-separator"/>
                  <QrCodeIcon className="SolicitudServicioComponent-serial-icon"/>
                  <div className="SolicitudServicioComponent-serial-value">{solicitudServicio.id_equipo.serie || 'N/A'}</div>
                  <div className="SolicitudServicioComponent-client-wrapper">
                    <SpaceDashboardIcon className="SolicitudServicioComponent-client"/>
                  </div>
                  <div className="SolicitudServicioComponent-overlap-11">
                    <div className="SolicitudServicioComponent-text-wrapper-2">{solicitudServicio.id_equipo.id_area.area || 'N/A'}</div>
                  </div>
                  <LocationOnIcon className="SolicitudServicioComponent-ubicacion-icon"/>
                  <div className="SolicitudServicioComponent-ubicacion-value">{solicitudServicio.id_equipo.ubicacion || 'N/A'}</div>
                </div>
                <div className="SolicitudServicioComponent-overlap-wrapper">
                  <div className="SolicitudServicioComponent-overlap-group-2">
                    <div className="SolicitudServicioComponent-line-4" />
                    <div className="SolicitudServicioComponent-line-5" />
                    <div className="SolicitudServicioComponent-ellipse-2" />
                  </div>
                </div>
                <div className="SolicitudServicioComponent-sede-info">
                  <div className="SolicitudServicioComponent-overlap-12">
                    <div className="SolicitudServicioComponent-sede-title">SEDE</div>
                    <RemoveRedEyeIcon className="SolicitudServicioComponent-eye-2" onClick={handleClickIdSede}/>
                  </div>
                  <div className="SolicitudServicioComponent-sede-oid">ID: {solicitudServicio.id_equipo.id_sede._id || 'N/A'}</div>
                  <ApartmentIcon className="SolicitudServicioComponent-sede-icon"/>
                  <div className="SolicitudServicioComponent-sede-nombre">{solicitudServicio.id_equipo.id_sede.sede_nombre || 'N/A'}</div>
                  <LocationOnIcon className="SolicitudServicioComponent-location-icon"/>
                  <div className="SolicitudServicioComponent-sede-address">{solicitudServicio.id_equipo.id_sede.sede_address || 'N/A'}</div>
                  <div className="SolicitudServicioComponent-sedeinfo-separator"/>
                  <CallIcon className="SolicitudServicioComponent-sedetelephone-icon"/>
                  <div className="SolicitudServicioComponent-sede-telefono">{solicitudServicio.id_equipo.id_sede.sede_telefono || 'N/A'}</div>
                  <EmailIcon className="SolicitudServicioComponent-sedeemail-icon"/>
                  <div className="SolicitudServicioComponent-sede-email">{solicitudServicio.id_equipo.id_sede.sede_email || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>


    </div>
  );
};

export default SolicitudServicioComponent;
