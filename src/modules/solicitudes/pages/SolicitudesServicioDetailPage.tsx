import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../../users/hooks/useSessionStorage';
import { getSolicitudServicioById } from '../services/solicitudesServiciosService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import { SolicitudServicio } from '../utils/types/SolicitudServicio.type';
import EditSolicitudServiciosButton from '../components/solicitudes_servicios/EditSolicitudServiciosButton';


import './styles/SolicitudesServicioDetailPage.css';
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
import DeleteSolicitudServicioButton from '../components/solicitudes_servicios/DeleteSolicitudServicioButton';
import UpdateIcon from '@mui/icons-material/Update';


const SolicitudesServicioDetailPage: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const { id } = useParams<{ id: string }>();
  const [solicitud, setSolicitud] = useState<SolicitudServicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    if (!id) {
      console.error('ID de la solicitud no encontrado en la URL');
      return;
    }

    const fetchSolicitudServicio = async () => {
      try {
        const token = loggedIn;
        const result = await getSolicitudServicioById(token, id);
        setSolicitud(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener detalles de la solicitud de servicio:', error);
      }
    };

    fetchSolicitudServicio();
  }, [loggedIn, id, navigate]);

  const renderEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <HelpOutlinedIcon className="SolicitudesServicioDetailPage-estado-pendiente" />;
      case 'Aprobada':
        return <CheckCircleIcon className="SolicitudesServicioDetailPage-estado-aprobada" />;
      case 'Rechazada':
        return <CancelIcon className="SolicitudesServicioDetailPage-estado-rechazada" />;
      default:
        return null; // o puedes poner un icono por defecto
    }
  };
  const handleEditSuccess = () => {
    console.log('Solicitud de servicio editada con éxito');
    setIsEditing(false);
  };

  const handleClickIdCreador = () => {
    if (solicitud !== null && solicitud.id_creador) {
      navigate(`/users/${solicitud.id_creador._id}`);
    }
  };
  
  const handleClickIdCambiador = () => {
    if (solicitud !== null && solicitud.id_cambiador) {
      navigate(`/users/${solicitud.id_cambiador._id}`);
    }
  };
  
  const handleClickIdCliente = () => {
    if (solicitud !== null && solicitud.id_equipo.id_sede.id_client._id) {
      navigate(`/clientes/${solicitud.id_equipo.id_sede.id_client._id}`);
    }
  };

  const handleClickIdEquipo = () => {
    if (solicitud !== null && solicitud.id_equipo._id) {
      navigate(`/equipos/${solicitud.id_equipo._id}`);
    }
  };

  const handleClickIdSede = () => {
    if (solicitud !== null && solicitud.id_equipo.id_sede._id) {
      navigate(`/sedes/${solicitud.id_equipo.id_sede._id}`);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className='SolicitudesServicioDetailPage-container1'>
      <DashboardMenuLateral />
      {isEditing ? (
        <EditSolicitudServiciosButton
          solicitudId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={solicitud}
        />
      ) : (
        <div className='SolicitudesServicioDetailPage-content'>
          {solicitud && (
            <>
            <div className="SolicitudesServicioDetailPage-solicitudes">
                  <div className="SolicitudesServicioDetailPage-overlap">
                    <div className="SolicitudesServicioDetailPage-container" />
                    <header className="SolicitudesServicioDetailPage-header">
                      <div className="SolicitudesServicioDetailPage-overlap-group">
                        <p className="SolicitudesServicioDetailPage-solicitud-id">SOLICITUD DE SERVICIO - {solicitud._id}</p>
                        <EditOutlinedIcon className="SolicitudesServicioDetailPage-edit-icon" onClick={() => setIsEditing(true)}/>
                        <DeleteSolicitudServicioButton solicitudId={solicitud._id} />
                      </div>
                    </header>
                    <div className="SolicitudesServicioDetailPage-geninfo-section">
                      <div className="SolicitudesServicioDetailPage-div">
                        <div className="SolicitudesServicioDetailPage-geninfo-title">GENERAL</div>
                        <HomeRepairServiceIcon className="SolicitudesServicioDetailPage-service-icon"/>
                        <div className="SolicitudesServicioDetailPage-service-value">{solicitud.id_servicio ? solicitud.id_servicio.servicio : 'N/A'}</div>
                        <CalendarMonthIcon className="SolicitudesServicioDetailPage-created-icon"/>
                        <div className="SolicitudesServicioDetailPage-created-value">{solicitud.creacion}</div>
                        <div className="SolicitudesServicioDetailPage-geninfo-separator" />
                        <AnnouncementIcon className="SolicitudesServicioDetailPage-aviso-icon"/>
                        <div className="SolicitudesServicioDetailPage-aviso-value">{solicitud.aviso}</div>
                        <DescriptionIcon className="SolicitudesServicioDetailPage-observacion-icon" />
                        <div className="SolicitudesServicioDetailPage-observacion-value">{solicitud.observacion}</div>
                      </div>
                    </div>
                    <div className="SolicitudesServicioDetailPage-estado-section">
                      <div className="SolicitudesServicioDetailPage-overlap-2">
                      {renderEstadoIcon(solicitud.id_solicitud_estado.estado)}
                        <div className="SolicitudesServicioDetailPage-estado-value">{solicitud.id_solicitud_estado ? solicitud.id_solicitud_estado.estado : 'N/A'}</div>
                        <div className="SolicitudesServicioDetailPage-estado-cambio-date">{solicitud.cambio_estado}</div>
                        <UpdateIcon className="SolicitudesServicioDetailPage-cambio-date-icon" />
                        <div className="SolicitudesServicioDetailPage-estado-separator" />
                        <div className="SolicitudesServicioDetailPage-text-wrapper">{solicitud.observacion_estado}</div>
                      </div>
                    </div>
                    <div className="SolicitudesServicioDetailPage-creator-section">
                      <div className="SolicitudesServicioDetailPage-overlap-3">
                        <div className="SolicitudesServicioDetailPage-overlap-4">
                          <div className="SolicitudesServicioDetailPage-creador-title">CREADOR SOLICITUD</div>
                          <div className="SolicitudesServicioDetailPage-creador-oid">ID: {solicitud.id_creador ? solicitud.id_creador._id : 'N/A'}</div>
                          <RemoveRedEyeIcon className="SolicitudesServicioDetailPage-eye" onClick={handleClickIdCreador}/>
                        </div>
                        <PersonIcon className="SolicitudesServicioDetailPage-username-icon"/>
                        <div className="SolicitudesServicioDetailPage-creador-username">{solicitud.id_creador ? solicitud.id_creador.username : 'N/A'}</div>
                        <CallIcon className="SolicitudesServicioDetailPage-telephone-icon"/>
                        <div className="SolicitudesServicioDetailPage-creador-telephone">{solicitud.id_creador ? solicitud.id_creador.telefono : 'N/A'}</div>
                        <ContactEmergencyIcon className="SolicitudesServicioDetailPage-cc-icon"/>
                        <div className="SolicitudesServicioDetailPage-creador-cc">{solicitud.id_creador ? solicitud.id_creador.cedula : 'N/A'}</div>
                        <EmailIcon className="SolicitudesServicioDetailPage-email-icon" />
                        <div className="SolicitudesServicioDetailPage-creador-email">{solicitud.id_creador ? solicitud.id_creador.email : 'N/A'}</div>
                        <div className="SolicitudesServicioDetailPage-separator"/>
                        <div className="SolicitudesServicioDetailPage-separator-info">
                          <div className="SolicitudesServicioDetailPage-overlap-group-2">
                            <div className="SolicitudesServicioDetailPage-line"/>
                            <div className="SolicitudesServicioDetailPage-img" />
                            <div className="SolicitudesServicioDetailPage-ellipse" />
                          </div>
                        </div>
                        <div className="SolicitudesServicioDetailPage-overlap-5">
                          <div className="SolicitudesServicioDetailPage-actualizador-title">ACTUALIZADOR ESTADO</div>
                          <div className="SolicitudesServicioDetailPage-actualizador-oid">ID: {solicitud.id_cambiador ? solicitud.id_cambiador._id : 'N/A'}</div>
                          <RemoveRedEyeIcon className="SolicitudesServicioDetailPage-eye" onClick={handleClickIdCambiador}/>
                        </div>
                        <PersonIcon className="SolicitudesServicioDetailPage-user" />
                        <div className="SolicitudesServicioDetailPage-actualizador">{solicitud.id_cambiador ? solicitud.id_cambiador.username : 'N/A'}</div>
                        <CallIcon className="SolicitudesServicioDetailPage-cc"/>
                        <div className="SolicitudesServicioDetailPage-actualizador-cc">{solicitud.id_cambiador ? solicitud.id_cambiador.cedula : 'N/A'}</div>
                        <ContactEmergencyIcon className="SolicitudesServicioDetailPage-telephone"/>
                        <div className="SolicitudesServicioDetailPage-actualizador-2">{solicitud.id_cambiador ? solicitud.id_cambiador.telefono : 'N/A'}</div>
                        <EmailIcon className="SolicitudesServicioDetailPage-email"/>
                        <div className="SolicitudesServicioDetailPage-actualizador-email">{solicitud.id_cambiador ? solicitud.id_cambiador.email : 'N/A'}</div>
                        <div className="SolicitudesServicioDetailPage-separator-2"/>
                      </div>
                    </div>
                    <div className="SolicitudesServicioDetailPage-equipo-section">
                      <div className="SolicitudesServicioDetailPage-client-info">
                        <div className="SolicitudesServicioDetailPage-overlap-group-3">
                          <div className="SolicitudesServicioDetailPage-client-title">CLIENTE</div>
                          <RemoveRedEyeIcon className="SolicitudesServicioDetailPage-eye-2" onClick={handleClickIdCliente}/>
                        </div>
                        <div className="SolicitudesServicioDetailPage-client-oid">ID: {solicitud.id_equipo ? solicitud.id_equipo.id_sede.id_client._id : 'N/A'}</div>
                        <AccountBalanceIcon className="SolicitudesServicioDetailPage-clientname-icon"/>
                        <div className="SolicitudesServicioDetailPage-clientname-value">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.id_client.client_name : 'N/A'}</div>
                        <ReceiptLongIcon className="SolicitudesServicioDetailPage-nit-icon"/>
                        <div className="SolicitudesServicioDetailPage-nit-value">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.id_client.client_nit : 'N/A'}</div>
                        <CallIcon className="SolicitudesServicioDetailPage-clientphone-icon"/>
                        <div className="SolicitudesServicioDetailPage-clientphone-value">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.id_client.client_telefono : 'N/A'}</div>
                        <div className="SolicitudesServicioDetailPage-clientinfo-separator" />
                        <EmailIcon className="SolicitudesServicioDetailPage-clientemail-icon"/>
                        <div className="SolicitudesServicioDetailPage-clientemail-value">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.id_client.client_email : 'N/A'}</div>
                      </div>
                      <div className="SolicitudesServicioDetailPage-separator-info-2">
                        <div className="SolicitudesServicioDetailPage-line-2"  />
                        <div className="SolicitudesServicioDetailPage-line-3"  />
                        <div className="SolicitudesServicioDetailPage-ellipse-2" />
                      </div>
                      <div className="SolicitudesServicioDetailPage-equipo-info">
                        <div className="SolicitudesServicioDetailPage-overlap-6">
                          <div className="SolicitudesServicioDetailPage-equipo-title">EQUIPO</div>
                          <div className="SolicitudesServicioDetailPage-equipo-oid">ID: {solicitud.id_equipo ? solicitud.id_equipo._id : 'N/A'}</div>
                          <RemoveRedEyeIcon className="SolicitudesServicioDetailPage-eye-3" onClick={handleClickIdEquipo}/>
                        </div>
                        <ClassIcon className="SolicitudesServicioDetailPage-class-icon"/>
                        <div className="SolicitudesServicioDetailPage-class-value">{solicitud.id_equipo ? solicitud.id_equipo.modelo_equipos.id_clase.clase: 'N/A'}</div>
                        <LocalOfferOutlinedIcon className="SolicitudesServicioDetailPage-marca-icon"/>
                        <div className="SolicitudesServicioDetailPage-marca-value">{solicitud.id_equipo ? solicitud.id_equipo.modelo_equipos.id_marca.marca : 'N/A'}</div>
                        <DevicesOtherOutlinedIcon className="SolicitudesServicioDetailPage-model-icon"/>
                        <div className="SolicitudesServicioDetailPage-model-value">{solicitud.id_equipo ? solicitud.id_equipo.modelo_equipos.modelo : 'N/A'}</div>
                        <div className="SolicitudesServicioDetailPage-equipoinfo-separator"/>
                        <QrCodeIcon className="SolicitudesServicioDetailPage-serial-icon" />
                        <div className="SolicitudesServicioDetailPage-serial-value">{solicitud.id_equipo ? solicitud.id_equipo.serie : 'N/A'}</div>
                        <div className="SolicitudesServicioDetailPage-client-wrapper">
                          <SpaceDashboardIcon className="SolicitudesServicioDetailPage-client"/>
                        </div>
                        <div className="SolicitudesServicioDetailPage-overlap-7">
                          <div className="SolicitudesServicioDetailPage-text-wrapper-2">{solicitud.id_equipo ? solicitud.id_equipo.id_area.area : 'N/A'}</div>
                        </div>
                        <LocationOnIcon className="SolicitudesServicioDetailPage-ubicacion-icon"/>
                        <div className="SolicitudesServicioDetailPage-ubicacion-value">{solicitud.id_equipo ? solicitud.id_equipo.ubicacion : 'N/A'}</div>
                      </div>
                      <div className="SolicitudesServicioDetailPage-overlap-wrapper">
                        <div className="SolicitudesServicioDetailPage-overlap-group-2">
                          <div className="SolicitudesServicioDetailPage-line-4"/>
                          <div className="SolicitudesServicioDetailPage-line-5" />
                          <div className="SolicitudesServicioDetailPage-ellipse-2" />
                        </div>
                      </div>
                      <div className="SolicitudesServicioDetailPage-sede-info">
                        <div className="SolicitudesServicioDetailPage-overlap-8">
                          <div className="SolicitudesServicioDetailPage-sede-title">SEDE</div>
                          <RemoveRedEyeIcon className="SolicitudesServicioDetailPage-eye-2" onClick={handleClickIdSede} />
                        </div>
                        <div className="SolicitudesServicioDetailPage-sede-oid">ID: {solicitud.id_equipo ? solicitud.id_equipo.id_sede._id : 'N/A'}</div>
                        <ApartmentIcon className="SolicitudesServicioDetailPage-sede-icon"/>
                        <div className="SolicitudesServicioDetailPage-sede-nombre">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.sede_nombre: 'N/A'}</div>
                        <LocationOnIcon className="SolicitudesServicioDetailPage-location-icon"/>
                        <div className="SolicitudesServicioDetailPage-sede-address">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.sede_address : 'N/A'}</div>
                        <div className="SolicitudesServicioDetailPage-sedeinfo-separator"/>
                        <CallIcon className="SolicitudesServicioDetailPage-sedetelephone-icon"/>
                        <div className="SolicitudesServicioDetailPage-sede-telefono">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.sede_telefono : 'N/A'}</div>
                        <EmailIcon className="SolicitudesServicioDetailPage-sedeemail-icon"/>
                        <div className="SolicitudesServicioDetailPage-sede-email">{solicitud.id_equipo ? solicitud.id_equipo.id_sede.sede_email : 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SolicitudesServicioDetailPage;
