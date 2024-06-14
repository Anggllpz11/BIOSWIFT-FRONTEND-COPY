import React, { useState } from 'react';
import { SolicitudDadoBaja } from '../../utils/types/SolicitudDadoBaja.type'; // Ensure correct import
import { updateSolicitudDadoBaja } from '../../services/solicitudesDadoBajaService'; // Ensure correct import

import './styles/SolicitudDadoBajaByIdAbierta.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSessionStorage } from '../../hooks/useSessionStorage';

interface SolicitudDadoBajaByIdAbiertaProps {
  solicitudDadoBaja: SolicitudDadoBaja;
  onBack?: () => void;
  onCambioSuccess?: () => void;
}

const SolicitudDadoBajaByIdAbierta: React.FC<SolicitudDadoBajaByIdAbiertaProps> = ({ solicitudDadoBaja, onBack, onCambioSuccess }) => {
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
    <div className="SolicitudDadoBajaByIdAbierta-box">
      <div className='SolicitudDadoBajaByIdAbierta-register-container'>
        <div className="SolicitudDadoBajaByIdAbierta-overlap">
          <div className="SolicitudDadoBajaByIdAbierta-title-t">VER SOLICITUD DADO DE BAJA</div>
          <ArrowBackIcon className="SolicitudDadoBajaByIdAbierta-back-button" onClick={onBack}/>
        </div>
        <div className="SolicitudDadoBajaByIdAbierta-register-cotizacion">
          <div className='SolicitudDadoBajaByIdAbierta-id-t'>ID</div>
          <div className='SolicitudDadoBajaByIdAbierta-id-value'>{solicitudDadoBaja._id || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdAbierta-estado-t'>Estado</div>
                <div className='SolicitudDadoBajaByIdAbierta-estado-value'>{solicitudDadoBaja.id_solicitud_baja_estado.estado || 'N/A'} por {solicitudDadoBaja.id_cambiador.name || 'N/A'} el día {solicitudDadoBaja.date_cambio_estado || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdAbierta-client-t'>Cliente</div>
          <div className='SolicitudDadoBajaByIdAbierta-client-name'>{solicitudDadoBaja.id_cliente.client_name || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdAbierta-orden-id-t'>Orden Relacionada</div>
          <div className='SolicitudDadoBajaByIdAbierta-orden-id'>{solicitudDadoBaja.id_orden._id || 'N/A'}</div>

          <div className="SolicitudDadoBajaByIdAbierta-novedades-section">
                        <div  className="SolicitudDadoBajaByIdAbierta-novedad-detail">
                            <h3 className='SolicitudDadoBajaByIdAbierta-novedades-title'>Observaciones Aprobación</h3>
                            <div className='SolicitudDadoBajaByIdAbierta-novedad-text'>{solicitudDadoBaja.observacion_estado || 'N/A'}</div>
                        </div>
                    </div>
                    
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudDadoBajaByIdAbierta;
