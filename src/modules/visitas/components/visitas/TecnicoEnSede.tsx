import React, { useEffect, useState } from 'react';
import { getVisitaById } from '../../../visitas/services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/TecnicoEnSede.css';
import DateRangeIcon from '@mui/icons-material/DateRange';

interface Actividad {
  id_protocolo: {
    title: string;
  };
  observacion: string;
  date_created: string;
  id_image?: string;
  presignedImageUrl?: string;
}

interface TecnicoEnSedeProps {
  actividad: Actividad; // Usaremos este prop para pasar la actividad desde el componente padre
}

const TecnicoEnSede: React.FC<TecnicoEnSedeProps> = ({ actividad }) => {


  return (
    <div className="TecnicoEnSede-box"> 
      <div className="TecnicoEnSede-en-sede-view">
        <div className="TecnicoEnSede-tecnico-en-sede-view-2">
          <div className="TecnicoEnSede-tecsede-title-2">{actividad.id_protocolo.title || 'N/A'}</div>
          <div className="TecnicoEnSede-observacion-t">Observación:</div>
          <div className="TecnicoEnSede-observacion-text">{actividad.observacion || 'N/A'}</div>
          <DateRangeIcon className='TecnicoEnSede-date-icon'/>
          <p className='TecnicoEnSede-date-value'>{actividad.date_created || 'N/A'}</p>
          {actividad.presignedImageUrl && (
            <img className="TecnicoEnSede-img-value" src={actividad.presignedImageUrl} alt="Imagen de la actividad" />
          )}

        </div>
      </div>
    </div>
  );
};

export default TecnicoEnSede;
