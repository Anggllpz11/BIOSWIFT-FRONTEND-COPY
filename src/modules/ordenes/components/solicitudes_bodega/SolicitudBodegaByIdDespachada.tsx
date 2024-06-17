import React, { useState } from 'react';
import { SolicitudBodega } from '../../utils/types/SolicitudBodega.type';

import './styles/SolicitudBodegaByIdDespachada.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCommentIcon from '@mui/icons-material/AddComment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { updateSolicitudBodega } from '../../services/solicitudesBodegaService';
interface SolicitudBodegaByIdDespachadaProps {
  solicitudBodega: SolicitudBodega;
  onBack?: () => void;
  onCambioSuccess?: () => void;
  onNewNovedad?: () => void;

}

const SolicitudBodegaByIdDespachada: React.FC<SolicitudBodegaByIdDespachadaProps> = ({ solicitudBodega, onBack, onCambioSuccess, onNewNovedad }) => {
  const [showModal, setShowModal] = useState(false);
  const [showNovedadModal, setShowNovedadModal] = useState(false);
  const [novedadTexto, setNovedadTexto] = useState('');

   const [observacionFinalizacion, setObservacionFinalizacion] = useState('');
  const userId = useSessionStorage('userId');
  const token = useSessionStorage('sessionJWTToken');
  const now = new Date();
  const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  const repuestos = solicitudBodega.ids_repuestos || [];
  const itemsAdicionales = solicitudBodega.items_adicionales || [];

  const handleOpenModal = () => {
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setObservacionFinalizacion('');
  };

  const handleConfirmarDespacho = async () => {
    const finalizadaEstadoId = '662a979dd055dbc7729e9cf9'; 
    if (token && solicitudBodega._id) {
      const updateData = {
        id_estado: finalizadaEstadoId,
        id_finalizador: userId,
        date_finalizacion: formattedDateCreated,
        observacion_finalizacion: observacionFinalizacion
      };
      await updateSolicitudBodega(token, solicitudBodega._id, updateData);
      handleCloseModal();
      onBack && onBack();
      onCambioSuccess && onCambioSuccess();
    }
  };

  const handleOpenNovedadModal = () => {
    setShowNovedadModal(true);
  };
  
  const handleCloseNovedadModal = () => {
    setShowNovedadModal(false);
    setNovedadTexto('');
  };
  
  const handleConfirmarNovedad = async () => {
    if (token && solicitudBodega._id) {
      const novedadData = {
        novedades: [
          ...solicitudBodega.novedades || [],
          {
            id_user: userId,
            novedad: novedadTexto,
            date_novedad: formattedDateCreated
          }
        ]
      };
      await updateSolicitudBodega(token, solicitudBodega._id, novedadData);
      handleCloseNovedadModal();
      onNewNovedad && onNewNovedad();
    }
  };
  


  return (
    <div className="SolicitudBodegaByIdDespachada-box">
      <div className='SolicitudBodegaByIdDespachada-register-container'>
        <div className="SolicitudBodegaByIdDespachada-overlap">
            <div className="SolicitudBodegaByIdDespachada-title-t">VER SOLICITUD BODEGA</div>
            <ArrowBackIcon className="SolicitudBodegaByIdDespachada-back-button" onClick={onBack}/>
        </div>

        <HandymanIcon className="SolicitudBodegaByIdDespachada-aprobar-button" onClick={handleOpenModal} />
        <div className='SolicitudBodegaByIdDespachada-aprobar-text' onClick={handleOpenModal} >Repuestos Entregados al Técnico</div>

        {showModal && (
                <div className="SolicitudBodegaByIdDespachada-modal-overlay">
                        <div className="SolicitudBodegaByIdDespachada-modal-content">
                          <h3 className='SolicitudBodegaByIdDespachada-modal-content-title'>Observación Entrega de Repuestos al Técnico</h3>
                          <textarea
                            className="SolicitudBodegaByIdDespachada-textarea"
                            value={observacionFinalizacion}
                            onChange={(e) => setObservacionFinalizacion(e.target.value)}
                            placeholder='Observaciones...'
                          />
                          <div className="SolicitudBodegaByIdDespachada-modal-actions">
                            <button className="SolicitudBodegaByIdDespachada-modal-cancel-button" onClick={handleCloseModal}>Cancelar</button>
                            <button className="SolicitudBodegaByIdDespachada-close-observacion-button"  onClick={handleConfirmarDespacho}>Entregar Repuestos</button>
                          </div>
                        </div>
                      </div>
            )}

        <AddCommentIcon className="SolicitudBodegaByIdDespachada-novedad-button" onClick={handleOpenNovedadModal} />
        <div className='SolicitudBodegaByIdDespachada-rechazar-text' onClick={handleOpenNovedadModal}>Nueva Novedad</div>
        {showNovedadModal && (
            <div className="SolicitudBodegaByIdDespachada-modal-overlay">
                <div className="SolicitudBodegaByIdDespachada-modal-content">
                <h3 className='SolicitudBodegaByIdDespachada-modal-content-title'>Agregar Novedad</h3>
                <textarea
                    className="SolicitudBodegaByIdDespachada-textarea"
                    value={novedadTexto}
                    onChange={(e) => setNovedadTexto(e.target.value)}
                    placeholder='Ingrese la novedad...'
                    required
                />
                <div className="SolicitudBodegaByIdDespachada-modal-actions">
                    <button className="SolicitudBodegaByIdDespachada-modal-cancel-button" onClick={handleCloseNovedadModal}>Cancelar</button>
                    <button className="SolicitudBodegaByIdDespachada-close-observacion-button" onClick={handleConfirmarNovedad}>Confirmar Novedad</button>
                </div>
                </div>
            </div>
            )}

        <div className="SolicitudBodegaByIdDespachada-register-cotizacion">
                <div className='SolicitudBodegaByIdDespachada-id-t'>ID</div>
                <div className='SolicitudBodegaByIdDespachada-id-value'>{solicitudBodega._id || 'N/A'}</div>
                <div className='SolicitudBodegaByIdDespachada-estado-t'>Estado</div>
                <div className='SolicitudBodegaByIdDespachada-estado-value'>{solicitudBodega.id_estado.estado || 'N/A'} por {solicitudBodega.id_aprobador.name || 'N/A'} el día {solicitudBodega.date_aprobacion || 'N/A'}</div>
                <div className='SolicitudBodegaByIdDespachada-client-t'>Cliente</div>
                <div className='SolicitudBodegaByIdDespachada-client-name'>{solicitudBodega.id_cliente.client_name || 'N/A'}</div>
                <div className='SolicitudBodegaByIdDespachada-orden-id-t'>Orden Relacionada</div>
                <div className='SolicitudBodegaByIdDespachada-orden-id'>{solicitudBodega.id_orden._id || 'N/A'}</div>

                <div className="SolicitudBodegaByIdDespachada-repuestos-title">Repuestos</div>
                {repuestos.map((repuesto, index) => (
                <div key={index} className='SolicitudBodegaByIdDespachada-repuestos-selected-div'>
                    <div className='SolicitudBodegaByIdDespachada-repuestos-selected-title'>Repuesto</div>
                    <p className='SolicitudBodegaByIdDespachada-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name || 'N/A'}</p>
                    <div className='SolicitudBodegaByIdDespachada-repuestos-cantidad-title'>Cantidad</div>
                    <div className='SolicitudBodegaByIdDespachada-repuestos-cantidad-input'>{repuesto.cantidad || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdDespachada-repuestos-valoru-title'>Valor Unitario</div>
                    <div className='SolicitudBodegaByIdDespachada-repuestos-valoru-input'>{repuesto.valor_unitario || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdDespachada-repuestos-switch-label'>Sum Cliente</div>
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


                <div className='SolicitudBodegaByIdDespachada-items-div'>
                    <div className='SolicitudBodegaByIdDespachada-items-title'>Items Adicionales</div>
                    {itemsAdicionales.map((item, index) => (
                        <div key={index} className='SolicitudBodegaByIdDespachada-items-section'>
                            <div className='SolicitudBodegaByIdDespachada-items-description-title'>Descripción</div>
                            <div className='SolicitudBodegaByIdDespachada-items-description-input'>{item.descripcion || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdDespachada-items-cantidad-title'>Cantidad</div>
                            <div className='SolicitudBodegaByIdDespachada-items-cantidad-input'>{item.cantidad || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdDespachada-items-valoru-title'>Valor Unitario</div>
                            <div className='SolicitudBodegaByIdDespachada-items-valoru-input'>{item.valor_unitario || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdDespachada-repuestos-switch-label'>Sum Cliente</div>
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

                <div className="SolicitudBodegaByIdDespachada-novedades-section">
                    <h3 className='SolicitudBodegaByIdDespachada-novedades-title'>Novedades</h3>
                    {solicitudBodega.novedades && solicitudBodega.novedades.length > 0 ? (
                        solicitudBodega.novedades.map((novedad, index) => (
                        <div key={index} className="SolicitudBodegaByIdDespachada-novedad-detail">
                            <AccountCircleIcon className='SolicitudBodegaByIdDespachada-novedad-user-t'/>
                            <div className='SolicitudBodegaByIdDespachada-novedad-user'>{novedad && novedad.id_user && novedad.id_user.name || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdDespachada-novedad-text'>{novedad.novedad || 'N/A'}</div>
                            <CalendarMonthIcon className='SolicitudBodegaByIdDespachada-novedad-date-t'/>
                            <div className='SolicitudBodegaByIdDespachada-novedad-date'>{novedad.date_novedad || 'N/A'}</div>
                        </div>
                        ))
                    ) : (
                        <div className='SolicitudBodegaByIdDespachada-novedades-undefined-title'>No hay novedades registradas.</div>
                    )}
                    </div>


                {/* LUGAR PARA RENDERIZAR NOVEDADES */}
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudBodegaByIdDespachada;