import React, { useEffect, useState } from 'react';
import { getVisitaById } from '../../../visitas/services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/CambiarRepuestoVer.css'; // Ajusta la ruta a los estilos de este componente
import DateRangeIcon from '@mui/icons-material/DateRange';

interface Actividad {
  id_protocolo: {
    title: string;
  };
  date_created: string;
  id_repuesto: {
    repuesto_name: string;
  };
  cantidad: number;
  total: number;
}

interface CambiarRepuestoVerProps {
  actividad: Actividad;
}
const CambiarRepuestoVer: React.FC<CambiarRepuestoVerProps> = ({ actividad }) => {
 
  return (
    <div className="CambiarRepuestoVer-box">
      <div className="CambiarRepuestoVer-cambio-view">
        <div className="CambiarRepuestoVer-cambio-view-2">
          <div className="CambiarRepuestoVer-title">{actividad.id_protocolo.title || 'N/A'}</div>
          <DateRangeIcon className='CambiarRepuestoVer-date-icon'/>
          <p className='CambiarRepuestoVer-date-value'>{actividad.date_created || 'N/A'}</p>

          <div className="CambiarRepuestoVer-select-repuestot">Repuesto Seleccionado: </div>
          <div className="CambiarRepuestoVer-select-repuestoi">{actividad.id_repuesto.repuesto_name || 'N/A'}</div>
          <div className="CambiarRepuestoVer-select-quantityt">Cantidad: </div>
          <div className="CambiarRepuestoVer-select-quantity-i">{actividad.cantidad || 'N/A'}</div>
          <div className="CambiarRepuestoRegistrar-separator"/>
          <div className="CambiarRepuestoVer-valor-unitariot">Valor Unitario: </div>
          <div className="CambiarRepuestoVer-valor-unitarioi">{actividad.cantidad || 'N/A'}</div>
          <div className="CambiarRepuestoVer-total-t">Total: </div>
          <div className="CambiarRepuestoVer-total-input">{actividad.total || 'N/A'}</div>

        </div>
      </div>
    </div>
  );
};

export default CambiarRepuestoVer;
