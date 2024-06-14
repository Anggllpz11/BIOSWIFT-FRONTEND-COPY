import React, { useState } from 'react';
import { SolicitudBodega } from '../../utils/types/SolicitudBodega.type';

import './styles/SolicitudBodegaByIdPendiente.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { updateSolicitudBodega } from '../../services/solicitudesBodegaService';

interface SolicitudBodegaByIdPendienteProps {
  solicitudBodega: SolicitudBodega;
  onBack?: () => void;
  onCambioSuccess?: () => void;
}

const SolicitudBodegaByIdPendiente: React.FC<SolicitudBodegaByIdPendienteProps> = ({ solicitudBodega, onBack, onCambioSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [accionModal, setAccionModal] = useState('aprobar');
  const [observacionEstado, setObservacionEstado] = useState('');
  const userId = useSessionStorage('userId');
  const token = useSessionStorage('sessionJWTToken');
  const now = new Date();
  const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  const repuestos = solicitudBodega.ids_repuestos || [];
  const itemsAdicionales = solicitudBodega.items_adicionales || [];

  const handleOpenModal = (accion: 'aprobar' | 'rechazar') => {
    setAccionModal(accion);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setObservacionEstado('');
  };

  const handleConfirmarAccion = async () => {
    const idEstado = accionModal === 'aprobar' ? '662a978cd055dbc7729e9cf5' : '662a9797d055dbc7729e9cf7';
    const solicitudBodegaData = {
      id_estado: idEstado,
      ...(accionModal === 'aprobar'
        ? {
            id_aprobador: userId,
            date_aprobacion: formattedDateCreated,
            observacion_aprobacion: observacionEstado
          }
        : {
            id_rechazador: userId,
            date_rechazo: formattedDateCreated,
            observacion_rechazo: observacionEstado
          })
    };

    if (token && solicitudBodega._id) {
      await updateSolicitudBodega(token, solicitudBodega._id, solicitudBodegaData);
      handleCloseModal();
      onBack && onBack();
      onCambioSuccess && onCambioSuccess();
    }
  };


  return (
    <div className="SolicitudBodegaByIdPendiente-box">
      <div className='SolicitudBodegaByIdPendiente-register-container'>
        <div className="SolicitudBodegaByIdPendiente-overlap">
            <div className="SolicitudBodegaByIdPendiente-title-t">VER SOLICITUD BODEGA</div>
            <ArrowBackIcon className="SolicitudBodegaByIdPendiente-back-button" onClick={onBack}/>
        </div>

        <CheckCircleIcon className="SolicitudBodegaByIdPendiente-aprobar-button" onClick={() => handleOpenModal('aprobar')}/>
        <div className='SolicitudBodegaByIdPendiente-aprobar-text' onClick={() => handleOpenModal('aprobar')}>Aprobar</div>

        {showModal && (
                <div className="SolicitudBodegaByIdPendiente-modal-overlay">
                        <div className="SolicitudBodegaByIdPendiente-modal-content">
                          <h3 className='SolicitudBodegaByIdPendiente-modal-content-title'>{accionModal === 'aprobar' ? 'Aprobar Solicitud Bodega' : 'Rechazar Solicitud Bodega'}</h3>
                          <textarea
                            className="SolicitudBodegaByIdPendiente-textarea"
                            value={observacionEstado}
                            onChange={(e) => setObservacionEstado(e.target.value)}
                            placeholder='Observaciones...'
                          />
                          <div className="SolicitudBodegaByIdPendiente-modal-actions">
                            <button className="SolicitudBodegaByIdPendiente-modal-cancel-button" onClick={handleCloseModal}>Cancelar</button>
                            <button className="SolicitudBodegaByIdPendiente-close-observacion-button"  onClick={handleConfirmarAccion}>{accionModal === 'aprobar' ? 'Aprobar Solicitud Bodega' : 'Rechazar Solicitud Bodega'}</button>
                          </div>
                        </div>
                      </div>
            )}

        <DoDisturbIcon className="SolicitudBodegaByIdPendiente-rechazar-button" onClick={() => handleOpenModal('rechazar')}/>
        <div className='SolicitudBodegaByIdPendiente-rechazar-text' onClick={() => handleOpenModal('rechazar')}>Rechazar</div>

        <div className="SolicitudBodegaByIdPendiente-register-cotizacion">
                <div className='SolicitudBodegaByIdPendiente-id-t'>ID</div>
                <div className='SolicitudBodegaByIdPendiente-id-value'>{solicitudBodega._id || 'N/A'}</div>
                <div className='SolicitudBodegaByIdPendiente-estado-t'>Estado</div>
                <div className='SolicitudBodegaByIdPendiente-estado-value'>{solicitudBodega.id_estado.estado || 'N/A'}</div>
                <div className='SolicitudBodegaByIdPendiente-client-t'>Cliente</div>
                <div className='SolicitudBodegaByIdPendiente-client-name'>{solicitudBodega.id_cliente.client_name || 'N/A'}</div>
                <div className='SolicitudBodegaByIdPendiente-orden-id-t'>Orden Relacionada</div>
                <div className='SolicitudBodegaByIdPendiente-orden-id'>{solicitudBodega.id_orden._id || 'N/A'}</div>

                <div className="SolicitudBodegaByIdPendiente-repuestos-title">Repuestos</div>
                {repuestos.map((repuesto, index) => (
                <div key={index} className='SolicitudBodegaByIdPendiente-repuestos-selected-div'>
                    <div className='SolicitudBodegaByIdPendiente-repuestos-selected-title'>Repuesto</div>
                    <p className='SolicitudBodegaByIdPendiente-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name || 'N/A'}</p>
                    <div className='SolicitudBodegaByIdPendiente-repuestos-cantidad-title'>Cantidad</div>
                    <div className='SolicitudBodegaByIdPendiente-repuestos-cantidad-input'>{repuesto.cantidad || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdPendiente-repuestos-valoru-title'>Valor Unitario</div>
                    <div className='SolicitudBodegaByIdPendiente-repuestos-valoru-input'>{repuesto.valor_unitario || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdPendiente-repuestos-switch-label'>Sum Cliente</div>
                    <label className="RegisterSolicitudBodega-repuestos-switch">
                    <input
                      className='RegisterSolicitudBodega-repuestos-switch-input'
                      type="checkbox"
                      name="sum_client"
                      checked={repuesto.sum_client}
                      readOnly
                    />
                      <span className="RegisterSolicitudBodega-slider round"></span>
                  </label>
                </div>
                ))}


                <div className='SolicitudBodegaByIdPendiente-items-div'>
                    <div className='SolicitudBodegaByIdPendiente-items-title'>Items Adicionales</div>
                    {itemsAdicionales.map((item, index) => (
                        <div key={index} className='SolicitudBodegaByIdPendiente-items-section'>
                            <div className='SolicitudBodegaByIdPendiente-items-description-title'>Descripción</div>
                            <div className='SolicitudBodegaByIdPendiente-items-description-input'>{item.descripcion || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdPendiente-items-cantidad-title'>Cantidad</div>
                            <div className='SolicitudBodegaByIdPendiente-items-cantidad-input'>{item.cantidad || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdPendiente-items-valoru-title'>Valor Unitario</div>
                            <div className='SolicitudBodegaByIdPendiente-items-valoru-input'>{item.valor_unitario || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdPendiente-repuestos-switch-label'>Sum Cliente</div>
                            <label className="RegisterSolicitudBodega-repuestos-switch">
                            <input
                            className='RegisterSolicitudBodega-repuestos-switch-input'
                            type="checkbox"
                            name="sum_client"
                            checked={item.sum_client}
                            readOnly
                            />
                            <span className="RegisterSolicitudBodega-slider round"></span>
                        </label>
                        </div>
                    ))}
                </div>
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudBodegaByIdPendiente;