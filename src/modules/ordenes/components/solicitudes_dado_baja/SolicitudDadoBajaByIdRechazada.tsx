import React, { useState } from 'react';
import { SolicitudDadoBaja } from '../../utils/types/SolicitudDadoBaja.type'; // Ensure correct import
import { updateSolicitudDadoBaja } from '../../services/solicitudesDadoBajaService'; // Ensure correct import

import './styles/SolicitudDadoBajaByIdRechazada.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSessionStorage } from '../../hooks/useSessionStorage';

interface SolicitudDadoBajaByIdRechazadaProps {
  solicitudDadoBaja: SolicitudDadoBaja;
  onBack?: () => void;
  onCambioSuccess?: () => void;
}

const SolicitudDadoBajaByIdRechazada: React.FC<SolicitudDadoBajaByIdRechazadaProps> = ({ solicitudDadoBaja, onBack, onCambioSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [accionModal, setAccionModal] = useState<'aprobar' | 'rechazar'>('aprobar');
  const [observacionEstado, setObservacionEstado] = useState('');
  const userId = useSessionStorage('userId');
  const token = useSessionStorage('sessionJWTToken');
  const now = new Date();
  const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const handleOpenModal = (accion: 'aprobar' | 'rechazar') => {
    setAccionModal(accion);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setObservacionEstado('');
  };

  const handleConfirmarAccion = async () => {
    const idEstado = accionModal === 'aprobar' ? '6642656ac858b4a7a115053e' : '6642656ec858b4a7a1150540';
    const solicitudDadoBajaData = {
      id_solicitud_baja_estado: idEstado,
      id_cambiador: userId,
      date_cambio_estado: formattedDateCreated,
      observacion_estado: observacionEstado,
    };

    if (token && solicitudDadoBaja._id) {
      await updateSolicitudDadoBaja(token, solicitudDadoBaja._id, solicitudDadoBajaData);
      handleCloseModal();
      onBack && onBack();
      onCambioSuccess && onCambioSuccess();
    }
  };

  return (
    <div className="SolicitudDadoBajaByIdRechazada-box">
      <div className='SolicitudDadoBajaByIdRechazada-register-container'>
        <div className="SolicitudDadoBajaByIdRechazada-overlap">
          <div className="SolicitudDadoBajaByIdRechazada-title-t">VER SOLICITUD DADO DE BAJA</div>
          <ArrowBackIcon className="SolicitudDadoBajaByIdRechazada-back-button" onClick={onBack}/>
        </div>
        <div className="SolicitudDadoBajaByIdRechazada-register-cotizacion">
          <div className='SolicitudDadoBajaByIdRechazada-id-t'>ID</div>
          <div className='SolicitudDadoBajaByIdRechazada-id-value'>{solicitudDadoBaja._id || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdRechazada-estado-t'>Estado</div>
                <div className='SolicitudDadoBajaByIdRechazada-estado-value'>{solicitudDadoBaja.id_solicitud_baja_estado.estado || 'N/A'} por {solicitudDadoBaja.id_cambiador.name || 'N/A'} el día {solicitudDadoBaja.date_cambio_estado || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdRechazada-client-t'>Cliente</div>
          <div className='SolicitudDadoBajaByIdRechazada-client-name'>{solicitudDadoBaja.id_cliente.client_name || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdRechazada-orden-id-t'>Orden Relacionada</div>
          <div className='SolicitudDadoBajaByIdRechazada-orden-id'>{solicitudDadoBaja.id_orden._id || 'N/A'}</div>

          <div className="SolicitudDadoBajaByIdRechazada-novedades-section">
                        <div  className="SolicitudDadoBajaByIdRechazada-novedad-detail">
                            <h3 className='SolicitudDadoBajaByIdRechazada-novedades-title'>Observaciones Rechazo</h3>
                            <div className='SolicitudDadoBajaByIdRechazada-novedad-text'>{solicitudDadoBaja.observacion_estado || 'N/A'}</div>
                        </div>
                    </div>
                    
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudDadoBajaByIdRechazada;
