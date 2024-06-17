import React, { useState } from 'react';
import { SolicitudBodega } from '../../utils/types/SolicitudBodega.type';

import './styles/SolicitudBodegaByIdTerminada.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCommentIcon from '@mui/icons-material/AddComment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { updateSolicitudBodega } from '../../services/solicitudesBodegaService';
interface SolicitudBodegaByIdTerminadaProps {
  solicitudBodega: SolicitudBodega;
  onBack?: () => void;
  onCambioSuccess?: () => void;
  onNewNovedad?: () => void;

}

const SolicitudBodegaByIdTerminada: React.FC<SolicitudBodegaByIdTerminadaProps> = ({ solicitudBodega, onBack, onCambioSuccess, onNewNovedad }) => {

  const repuestos = solicitudBodega.ids_repuestos || [];
  const itemsAdicionales = solicitudBodega.items_adicionales || [];

  return (
    <div className="SolicitudBodegaByIdTerminada-box">
      <div className='SolicitudBodegaByIdTerminada-register-container'>
        <div className="SolicitudBodegaByIdTerminada-overlap">
            <div className="SolicitudBodegaByIdTerminada-title-t">VER SOLICITUD BODEGA</div>
            <ArrowBackIcon className="SolicitudBodegaByIdTerminada-back-button" onClick={onBack}/>
        </div>

        <div className="SolicitudBodegaByIdTerminada-register-cotizacion">
                <div className='SolicitudBodegaByIdTerminada-id-t'>ID</div>
                <div className='SolicitudBodegaByIdTerminada-id-value'>{solicitudBodega._id || 'N/A'}</div>
                <div className='SolicitudBodegaByIdTerminada-estado-t'>Estado</div>
                <div className='SolicitudBodegaByIdTerminada-estado-value'>{solicitudBodega.id_estado.estado || 'N/A'} por {solicitudBodega.id_aprobador.name || 'N/A'} el día {solicitudBodega.date_aprobacion || 'N/A'}</div>
                <div className='SolicitudBodegaByIdTerminada-client-t'>Cliente</div>
                <div className='SolicitudBodegaByIdTerminada-client-name'>{solicitudBodega.id_cliente.client_name || 'N/A'}</div>
                <div className='SolicitudBodegaByIdTerminada-orden-id-t'>Orden Relacionada</div>
                <div className='SolicitudBodegaByIdTerminada-orden-id'>{solicitudBodega.id_orden._id || 'N/A'}</div>

                <div className="SolicitudBodegaByIdTerminada-repuestos-title">Repuestos</div>
                {repuestos.map((repuesto, index) => (
                <div key={index} className='SolicitudBodegaByIdTerminada-repuestos-selected-div'>
                    <div className='SolicitudBodegaByIdTerminada-repuestos-selected-title'>Repuesto</div>
                    <p className='SolicitudBodegaByIdTerminada-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name || 'N/A'}</p>
                    <div className='SolicitudBodegaByIdTerminada-repuestos-cantidad-title'>Cantidad</div>
                    <div className='SolicitudBodegaByIdTerminada-repuestos-cantidad-input'>{repuesto.cantidad || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdTerminada-repuestos-valoru-title'>Valor Unitario</div>
                    <div className='SolicitudBodegaByIdTerminada-repuestos-valoru-input'>{repuesto.valor_unitario || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdTerminada-repuestos-switch-label'>Sum Cliente</div>
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


                <div className='SolicitudBodegaByIdTerminada-items-div'>
                    <div className='SolicitudBodegaByIdTerminada-items-title'>Items Adicionales</div>
                    {itemsAdicionales.map((item, index) => (
                        <div key={index} className='SolicitudBodegaByIdTerminada-items-section'>
                            <div className='SolicitudBodegaByIdTerminada-items-description-title'>Descripción</div>
                            <div className='SolicitudBodegaByIdTerminada-items-description-input'>{item.descripcion || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdTerminada-items-cantidad-title'>Cantidad</div>
                            <div className='SolicitudBodegaByIdTerminada-items-cantidad-input'>{item.cantidad || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdTerminada-items-valoru-title'>Valor Unitario</div>
                            <div className='SolicitudBodegaByIdTerminada-items-valoru-input'>{item.valor_unitario || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdTerminada-repuestos-switch-label'>Sum Cliente</div>
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

                <div className="SolicitudBodegaByIdTerminada-novedades-section">
                    <h3 className='SolicitudBodegaByIdTerminada-novedades-title'>Novedades</h3>
                    {solicitudBodega.novedades && solicitudBodega.novedades.length > 0 ? (
                        solicitudBodega.novedades.map((novedad, index) => (
                        <div key={index} className="SolicitudBodegaByIdTerminada-novedad-detail">
                            <AccountCircleIcon className='SolicitudBodegaByIdTerminada-novedad-user-t'/>
                            <div className='SolicitudBodegaByIdTerminada-novedad-user'>{novedad && novedad.id_user && novedad.id_user.name || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdTerminada-novedad-text'>{novedad.novedad || 'N/A'}</div>
                            <CalendarMonthIcon className='SolicitudBodegaByIdTerminada-novedad-date-t'/>
                            <div className='SolicitudBodegaByIdTerminada-novedad-date'>{novedad.date_novedad || 'N/A'}</div>
                        </div>
                        ))
                    ) : (
                        <div className='SolicitudBodegaByIdTerminada-novedades-undefined-title'>No hay novedades registradas.</div>
                    )}
                    </div>


                {/* LUGAR PARA RENDERIZAR NOVEDADES */}
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudBodegaByIdTerminada;