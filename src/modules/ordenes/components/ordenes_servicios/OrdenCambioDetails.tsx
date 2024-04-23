import React from 'react';
import { OrdenCambio } from '../../utils/types/Orden.type';
import './styles/OrdenCambioDetails.css'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


interface OrdenCambioDetailsProps {
  cambio: OrdenCambio; // Prop para recibir el cambio seleccionado
}

const OrdenCambioDetails: React.FC<OrdenCambioDetailsProps> = ({ cambio }) => {
  return (
      <div className="OrdenCambioDetails-box">
            <div className="OrdenCambioDetails-ver-cambio">
              <header className="OrdenCambioDetails-header">
                <div className="OrdenCambioDetails-overlap-group">
                  <div className="OrdenCambioDetails-header-t">VER CAMBIO</div>
                </div>
              </header>
              <div className="OrdenCambioDetails-geninfo">
                <div className="OrdenCambioDetails-overlap">
                  <div className="OrdenCambioDetails-substate-t">SUBESTADO</div>
                  <div className="OrdenCambioDetails-substate-value">{cambio && cambio.ids_orden_sub_estado && cambio.ids_orden_sub_estado.sub_estado || 'N/A'}</div>
                  <div className="OrdenCambioDetails-separator"/>
                  <div className="OrdenCambioDetails-comments-t">OBSERVACIONES</div>
                  <div className="OrdenCambioDetails-comments-value">{cambio.comentario || 'No hay comentario'}</div>
                </div>
              </div>
              <div className="OrdenCambioDetails-register-info">
                <div className="OrdenCambioDetails-div">
                  <div className="OrdenCambioDetails-register-infot">INFORMACIÓN DE REGISTRO</div>
                  <PersonIcon className="OrdenCambioDetails-user-icon"/>
                  <div className="OrdenCambioDetails-username-t">{cambio.id_creador.name || 'N/A'}</div>
                  <EmailIcon className="OrdenCambioDetails-email-icon"/>
                  <div className="OrdenCambioDetails-emai-t">{cambio.id_creador.email || 'N/A'}</div>
                  <div className="OrdenCambioDetails-separator-register"/>
                  <CallIcon className="OrdenCambioDetails-telephone-icon"/>
                  <div className="OrdenCambioDetails-telephone-t">{cambio.id_creador.telefono || 'N/A'}</div>
                  <CalendarMonthIcon className="OrdenCambioDetails-date-icon"/>
                  <div className="OrdenCambioDetails-date-t">{cambio.date_created || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
  );
};

export default OrdenCambioDetails;

