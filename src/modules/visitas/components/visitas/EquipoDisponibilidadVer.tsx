import React, { useEffect, useState } from 'react';
import { getVisitaById } from '../../../visitas/services/visitasService'; 
import { useSessionStorage } from '../../hooks/useSessionStorage'; 
import './styles/EquipoDisponibilidad.css';
import DateRangeIcon from '@mui/icons-material/DateRange';

interface Actividad {
  id_protocolo: {
    title: string;
  };
  observacion: string;
  date_created: string;
}

interface EquipoDisponibilidadVerProps {
  actividad: Actividad;
}

const EquipoDisponibilidadVer: React.FC<EquipoDisponibilidadVerProps> = ({ actividad }) => {

  return (
    <div className="EquipoDisponibilidadVer-box"> 
      <div className="EquipoDisponibilidadVer-en-sede-view">
        <div className="EquipoDisponibilidadVer-tecnico-en-sede-view-2">
          <div className="EquipoDisponibilidadVer-tecsede-title-2">{actividad.id_protocolo.title || 'N/A'}</div>
          <div className="EquipoDisponibilidadVer-observacion-t">Observación:</div>
          <div className="EquipoDisponibilidadVer-observacion-text">{actividad.observacion || 'N/A'}</div>
          <DateRangeIcon className='EquipoDisponibilidadVer-date-icon'/>
          <p className='EquipoDisponibilidadVer-date-value'>{actividad.date_created || 'N/A'}</p>
        </div>
      </div>
      <div className='EquipoDisponibilidadVer-div-separator'></div>
    </div>
  );
};

export default EquipoDisponibilidadVer;
