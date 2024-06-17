import React, { useState } from 'react';
import { SolicitudBodega } from '../../utils/types/SolicitudBodega.type';

import './styles/SolicitudBodegaByIdRechazada.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCommentIcon from '@mui/icons-material/AddComment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { updateSolicitudBodega } from '../../services/solicitudesBodegaService';
interface SolicitudBodegaByIdRechazadaProps {
  solicitudBodega: SolicitudBodega;
  onBack?: () => void;
  onCambioSuccess?: () => void;
  onNewNovedad?: () => void;

}

const SolicitudBodegaByIdRechazada: React.FC<SolicitudBodegaByIdRechazadaProps> = ({ solicitudBodega, onBack, onCambioSuccess, onNewNovedad }) => {

  const repuestos = solicitudBodega.ids_repuestos || [];
  const itemsAdicionales = solicitudBodega.items_adicionales || [];

  return (
    <div className="SolicitudBodegaByIdRechazada-box">
      <div className='SolicitudBodegaByIdRechazada-register-container'>
        <div className="SolicitudBodegaByIdRechazada-overlap">
            <div className="SolicitudBodegaByIdRechazada-title-t">VER SOLICITUD BODEGA</div>
            <ArrowBackIcon className="SolicitudBodegaByIdRechazada-back-button" onClick={onBack}/>
        </div>

        <div className="SolicitudBodegaByIdRechazada-register-cotizacion">
                <div className='SolicitudBodegaByIdRechazada-id-t'>ID</div>
                <div className='SolicitudBodegaByIdRechazada-id-value'>{solicitudBodega._id || 'N/A'}</div>
                <div className='SolicitudBodegaByIdRechazada-estado-t'>Estado</div>
                <div className='SolicitudBodegaByIdRechazada-estado-value'>{solicitudBodega.id_estado.estado || 'N/A'} por {solicitudBodega.id_rechazador.name || 'N/A'} el día {solicitudBodega.date_rechazo || 'N/A'}</div>
                <div className='SolicitudBodegaByIdRechazada-client-t'>Cliente</div>
                <div className='SolicitudBodegaByIdRechazada-client-name'>{solicitudBodega.id_cliente.client_name || 'N/A'}</div>
                <div className='SolicitudBodegaByIdRechazada-orden-id-t'>Orden Relacionada</div>
                <div className='SolicitudBodegaByIdRechazada-orden-id'>{solicitudBodega.id_orden._id || 'N/A'}</div>

                <div className="SolicitudBodegaByIdRechazada-repuestos-title">Repuestos</div>
                {repuestos.map((repuesto, index) => (
                <div key={index} className='SolicitudBodegaByIdRechazada-repuestos-selected-div'>
                    <div className='SolicitudBodegaByIdRechazada-repuestos-selected-title'>Repuesto</div>
                    <p className='SolicitudBodegaByIdRechazada-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name || 'N/A'}</p>
                    <div className='SolicitudBodegaByIdRechazada-repuestos-cantidad-title'>Cantidad</div>
                    <div className='SolicitudBodegaByIdRechazada-repuestos-cantidad-input'>{repuesto.cantidad || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdRechazada-repuestos-valoru-title'>Valor Unitario</div>
                    <div className='SolicitudBodegaByIdRechazada-repuestos-valoru-input'>{repuesto.valor_unitario || 'N/A'}</div>
                    <div className='SolicitudBodegaByIdRechazada-repuestos-switch-label'>Sum Cliente</div>
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


                <div className='SolicitudBodegaByIdRechazada-items-div'>
                    <div className='SolicitudBodegaByIdRechazada-items-title'>Items Adicionales</div>
                    {itemsAdicionales.map((item, index) => (
                        <div key={index} className='SolicitudBodegaByIdRechazada-items-section'>
                            <div className='SolicitudBodegaByIdRechazada-items-description-title'>Descripción</div>
                            <div className='SolicitudBodegaByIdRechazada-items-description-input'>{item.descripcion || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdRechazada-items-cantidad-title'>Cantidad</div>
                            <div className='SolicitudBodegaByIdRechazada-items-cantidad-input'>{item.cantidad || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdRechazada-items-valoru-title'>Valor Unitario</div>
                            <div className='SolicitudBodegaByIdRechazada-items-valoru-input'>{item.valor_unitario || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdRechazada-repuestos-switch-label'>Sum Cliente</div>
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

                <div className="SolicitudBodegaByIdRechazada-novedades-section">
                    <h3 className='SolicitudBodegaByIdRechazada-novedades-title'>Novedades</h3>
                    {solicitudBodega.novedades && solicitudBodega.novedades.length > 0 ? (
                        solicitudBodega.novedades.map((novedad, index) => (
                        <div key={index} className="SolicitudBodegaByIdRechazada-novedad-detail">
                            <AccountCircleIcon className='SolicitudBodegaByIdRechazada-novedad-user-t'/>
                            <div className='SolicitudBodegaByIdRechazada-novedad-user'>{novedad && novedad.id_user && novedad.id_user.name || 'N/A'}</div>
                            <div className='SolicitudBodegaByIdRechazada-novedad-text'>{novedad.novedad || 'N/A'}</div>
                            <CalendarMonthIcon className='SolicitudBodegaByIdRechazada-novedad-date-t'/>
                            <div className='SolicitudBodegaByIdRechazada-novedad-date'>{novedad.date_novedad || 'N/A'}</div>
                        </div>
                        ))
                    ) : (
                        <div className='SolicitudBodegaByIdRechazada-novedades-undefined-title'>No hay novedades registradas.</div>
                    )}
                    </div>


                {/* LUGAR PARA RENDERIZAR NOVEDADES */}
        </div>
        
      </div>
    </div>
  );
};

export default SolicitudBodegaByIdRechazada;