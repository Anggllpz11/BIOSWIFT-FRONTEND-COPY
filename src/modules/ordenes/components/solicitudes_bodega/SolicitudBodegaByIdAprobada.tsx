import React, { useState } from 'react';
import { SolicitudBodega } from '../../utils/types/SolicitudBodega.type';

import './styles/SolicitudBodegaByIdAprobada.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCommentIcon from '@mui/icons-material/AddComment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { updateSolicitudBodega } from '../../services/solicitudesBodegaService';

interface SolicitudBodegaByIdAprobadaProps {
  solicitudBodega: SolicitudBodega;
  onBack?: () => void;
  onCambioSuccess?: () => void;
  onNewNovedad?: () => void;

}

const SolicitudBodegaByIdAprobada: React.FC<SolicitudBodegaByIdAprobadaProps> = ({ solicitudBodega, onBack, onCambioSuccess, onNewNovedad }) => {
  const [showModal, setShowModal] = useState(false);
  const [showNovedadModal, setShowNovedadModal] = useState(false);
  const [novedadTexto, setNovedadTexto] = useState('');

  const [accionModal, setAccionModal] = useState('aprobar');
  const [observacionEstado, setObservacionEstado] = useState('');
  const [observacionDespacho, setObservacionDespacho] = useState('');
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
    setObservacionDespacho('');
  };

  const handleConfirmarDespacho = async () => {
    const despachadaEstadoId = '662a97a2d055dbc7729e9cfb'; 
    if (token && solicitudBodega._id) {
      const updateData = {
        id_estado: despachadaEstadoId,
        id_despachador: userId,
        date_despacho: formattedDateCreated,
        observacion_despacho: observacionDespacho
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
    <div className="SolicitudBodegaByIdAprobada-box">
      <div className='SolicitudBodegaByIdAprobada-register-container'>
        <div className="SolicitudBodegaByIdAprobada-overlap">
            <div className="SolicitudBodegaByIdAprobada-title-t">VER SOLICITUD BODEGA</div>
            <ArrowBackIcon className="SolicitudBodegaByIdAprobada-back-button" onClick={onBack}/>
        </div>

        <LocalShippingIcon className="SolicitudBodegaByIdAprobada-aprobar-button" onClick={handleOpenModal} />
        <div className='SolicitudBodegaByIdAprobada-aprobar-text' onClick={handleOpenModal} >Repuestos Despachados</div>

        {showModal && (
                <div className="SolicitudBodegaByIdAprobada-modal-overlay">
                        <div className="SolicitudBodegaByIdAprobada-modal-content">
                          <h3 className='SolicitudBodegaByIdAprobada-modal-content-title'>Observación Despacho</h3>
                          <textarea
                            className="SolicitudBodegaByIdAprobada-textarea"
                            value={observacionDespacho}
                            onChange={(e) => setObservacionDespacho(e.target.value)}
                            placeholder='Observaciones...'
                          />
                          <div className="SolicitudBodegaByIdAprobada-modal-actions">
                            <button className="SolicitudBodegaByIdAprobada-modal-cancel-button" onClick={handleCloseModal}>Cancelar</button>
                            <button className="SolicitudBodegaByIdAprobada-close-observacion-button"  onClick={handleConfirmarDespacho}>Despachar</button>
                          </div>
                        </div>
                      </div>
            )}

        <AddCommentIcon className="SolicitudBodegaByIdAprobada-novedad-button" onClick={handleOpenNovedadModal} />
        <div className='SolicitudBodegaByIdAprobada-rechazar-text' onClick={handleOpenNovedadModal}>Nueva Novedad</div>
        {showNovedadModal && (
            <div className="SolicitudBodegaByIdAprobada-modal-overlay">
                <div className="SolicitudBodegaByIdAprobada-modal-content">
                <h3 className='SolicitudBodegaByIdAprobada-modal-content-title'>Agregar Novedad</h3>
                <textarea
                    className="SolicitudBodegaByIdAprobada-textarea"
                    value={novedadTexto}
                    onChange={(e) => setNovedadTexto(e.target.value)}
                    placeholder='Ingrese la novedad...'
                    required
                />
                <div className="SolicitudBodegaByIdAprobada-modal-actions">
                    <button className="SolicitudBodegaByIdAprobada-modal-cancel-button" onClick={handleCloseNovedadModal}>Cancelar</button>
                    <button className="SolicitudBodegaByIdAprobada-close-observacion-button" onClick={handleConfirmarNovedad}>Confirmar Novedad</button>
                </div>
                </div>
            </div>
            )}

        <div className="SolicitudBodegaByIdAprobada-register-cotizacion">
                <div className='SolicitudBodegaByIdAprobada-id-t'>ID</div>
                <div className='SolicitudBodegaByIdAprobada-id-value'>{solicitudBodega._id || 'N/A'}</div>
                <div className='SolicitudBodegaByIdAprobada-estado-t'>Estado</div>
                <div className='SolicitudBodegaByIdAprobada-estado-value'>{solicitudBodega.id_estado.estado || 'N/A'} por {solicitudBodega.id_aprobador.name || 'N/A'} el día {solicitudBodega.date_aprobacion || 'N/A'}</div>
                <div className='SolicitudBodegaByIdAprobada-client-t'>Cliente</div>
                <div className='SolicitudBodegaByIdAprobada-client-name'>{solicitudBodega.id_cliente.client_name || 'N/A'}</div>
                <div className='SolicitudBodegaByIdAprobada-orden-id-t'>Orden Relacionada</div>
                <div className='SolicitudBodegaByIdAprobada-orden-id'>{solicitudBodega.id_orden._id || 'N/A'}</div>

                <div className="SolicitudBodegaByIdAprobada-repuestos-title">Repuestos</div>
                {repuestos.map((repuesto, index) => (
                <div key={index} className='SolicitudBodegaByIdAprobada-repuestos-selected-div'>
                    <div className='SolicitudBodegaByIdAprobada-repuestos-selected-title'>Repuesto</div>
                    <p className='SolicitudBodegaByIdAprobada-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name || 'N/A'}</p>
                    <div className='SolicitudBodegaByIdAprobada-repuestos-cantidad-title'>Cantidad</div>
                    <div className='SolicitudBodegaByIdAprobada-repuestos-cantidad-input'>{repuesto.cantidad || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdAprobada-repuestos-valoru-title'>Valor Unitario</div>
                    <div className='SolicitudBodegaByIdAprobada-repuestos-valoru-input'>{repuesto.valor_unitario || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdAprobada-repuestos-switch-label'>Sum Cliente</div>
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


                <div className='SolicitudBodegaByIdAprobada-items-div'>
                    <div className='SolicitudBodegaByIdAprobada-items-title'>Items Adicionales</div>
                    {itemsAdicionales.map((item, index) => (
                        <div key={index} className='SolicitudBodegaByIdAprobada-items-section'>
                            <div className='SolicitudBodegaByIdAprobada-items-description-title'>Descripción</div>
                            <div className='SolicitudBodegaByIdAprobada-items-description-input'>{item.descripcion || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdAprobada-items-cantidad-title'>Cantidad</div>
                            <div className='SolicitudBodegaByIdAprobada-items-cantidad-input'>{item.cantidad || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdAprobada-items-valoru-title'>Valor Unitario</div>
                            <div className='SolicitudBodegaByIdAprobada-items-valoru-input'>{item.valor_unitario || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdAprobada-repuestos-switch-label'>Sum Cliente</div>
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

                <div className="SolicitudBodegaByIdAprobada-novedades-section">
                    <h3 className='SolicitudBodegaByIdAprobada-novedades-title'>Novedades</h3>
                    {solicitudBodega.novedades && solicitudBodega.novedades.length > 0 ? (
                        solicitudBodega.novedades.map((novedad, index) => (
                        <div key={index} className="SolicitudBodegaByIdAprobada-novedad-detail">
                            <AccountCircleIcon className='SolicitudBodegaByIdAprobada-novedad-user-t'/>
                            <div className='SolicitudBodegaByIdAprobada-novedad-user'>{novedad && novedad.id_user && novedad.id_user.name || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdAprobada-novedad-text'>{novedad.novedad || 'N/A'}</div>
                            <CalendarMonthIcon className='SolicitudBodegaByIdAprobada-novedad-date-t'/>
                            <div className='SolicitudBodegaByIdAprobada-novedad-date'>{novedad.date_novedad || 'N/A'}</div>
                        </div>
                        ))
                    ) : (
                        <div className='SolicitudBodegaByIdAprobada-novedades-undefined-title'>No hay novedades registradas.</div>
                    )}
                    </div>


                {/* LUGAR PARA RENDERIZAR NOVEDADES */}
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudBodegaByIdAprobada;