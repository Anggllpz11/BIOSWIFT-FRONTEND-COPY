import React, { useState } from 'react';
import { SolicitudDadoBaja } from '../../utils/types/SolicitudDadoBaja.type'; // Ensure correct import
import { updateSolicitudDadoBaja } from '../../services/solicitudesDadoBajaService'; // Ensure correct import

import './styles/SolicitudDadoBajaByIdPendiente.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useSessionStorage } from '../../hooks/useSessionStorage';

interface SolicitudDadoBajaByIdPendienteProps {
  solicitudDadoBaja: SolicitudDadoBaja;
  onBack?: () => void;
  onCambioSuccess?: () => void;
}

const SolicitudDadoBajaByIdPendiente: React.FC<SolicitudDadoBajaByIdPendienteProps> = ({ solicitudDadoBaja, onBack, onCambioSuccess }) => {
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
    <div className="SolicitudDadoBajaByIdPendiente-box">
      <div className='SolicitudDadoBajaByIdPendiente-register-container'>
        <div className="SolicitudDadoBajaByIdPendiente-overlap">
          <div className="SolicitudDadoBajaByIdPendiente-title-t">VER SOLICITUD DADO DE BAJA</div>
          <ArrowBackIcon className="SolicitudDadoBajaByIdPendiente-back-button" onClick={onBack}/>
        </div>

        <CheckCircleIcon className="SolicitudDadoBajaByIdPendiente-aprobar-button" onClick={() => handleOpenModal('aprobar')}/>
        <div className='SolicitudDadoBajaByIdPendiente-aprobar-text' onClick={() => handleOpenModal('aprobar')}>Aprobar</div>

        {showModal && (
          <div className="SolicitudDadoBajaByIdPendiente-modal-overlay">
            <div className="SolicitudDadoBajaByIdPendiente-modal-content">
              <h3 className='SolicitudDadoBajaByIdPendiente-modal-content-title'>{accionModal === 'aprobar' ? 'Aprobar Solicitud Dado de Baja' : 'Rechazar Solicitud Dado de Baja'}</h3>
              <textarea
                className="SolicitudDadoBajaByIdPendiente-textarea"
                value={observacionEstado}
                onChange={(e) => setObservacionEstado(e.target.value)}
                placeholder='Observaciones...'
              />
              <div className="SolicitudDadoBajaByIdPendiente-modal-actions">
                <button className="SolicitudDadoBajaByIdPendiente-modal-cancel-button" onClick={handleCloseModal}>Cancelar</button>
                <button className="SolicitudDadoBajaByIdPendiente-close-observacion-button" onClick={handleConfirmarAccion}>
                  {accionModal === 'aprobar' ? 'Aprobar Solicitud Dado de Baja' : 'Rechazar Solicitud Dado de Baja'}
                </button>
              </div>
            </div>
          </div>
        )}

        <DoDisturbIcon className="SolicitudDadoBajaByIdPendiente-rechazar-button" onClick={() => handleOpenModal('rechazar')}/>
        <div className='SolicitudDadoBajaByIdPendiente-rechazar-text' onClick={() => handleOpenModal('rechazar')}>Rechazar</div>

        <div className="SolicitudDadoBajaByIdPendiente-register-cotizacion">
          <div className='SolicitudDadoBajaByIdPendiente-id-t'>ID</div>
          <div className='SolicitudDadoBajaByIdPendiente-id-value'>{solicitudDadoBaja._id || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdPendiente-estado-t'>Estado</div>
          <div className='SolicitudDadoBajaByIdPendiente-estado-value'>{solicitudDadoBaja.id_solicitud_baja_estado.estado || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdPendiente-client-t'>Cliente</div>
          <div className='SolicitudDadoBajaByIdPendiente-client-name'>{solicitudDadoBaja.id_cliente.client_name || 'N/A'}</div>
          <div className='SolicitudDadoBajaByIdPendiente-orden-id-t'>Orden Relacionada</div>
          <div className='SolicitudDadoBajaByIdPendiente-orden-id'>{solicitudDadoBaja.id_orden._id || 'N/A'}</div>
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudDadoBajaByIdPendiente;
