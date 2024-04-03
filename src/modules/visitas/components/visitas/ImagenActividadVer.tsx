import React from 'react';
import './styles/ImagenActividadRegistrar.css'; 
import DateRangeIcon from '@mui/icons-material/DateRange';

interface Actividad {
  _id: string;
  id_protocolo: {
    title: string;
  };
  observacion: string;
  date_created: string;
  id_image?: string;
  presignedImageUrl?: string;

}

interface ImagenActividadVerProps {
  actividad: Actividad; 
}

const ImagenActividadVer: React.FC<ImagenActividadVerProps> = ({ actividad }) => {
  return (
    <div key={actividad._id} className="ImagenActividadVer-box">
      <div className="ImagenActividadVer-view">
        <div className="ImagenActividadVer-detail-view">
          <div className="ImagenActividadVer-title">{actividad.id_protocolo.title || 'N/A'}</div>
          <div className="ImagenActividadVer-observacion-t">Observación:</div>
          <div className="ImagenActividadVer-observacion-text">{actividad.observacion || 'N/A'}</div>
          <DateRangeIcon className='ImagenActividadVer-date-icon'/>
          <p className='ImagenActividadVer-date-value'>{actividad.date_created || 'N/A'}</p>
          {actividad.presignedImageUrl && (
            <img className='ImagenActividadVer-img-value' src={actividad.presignedImageUrl} alt="Imagen de la actividad" />
          )}

        </div>
      </div>
    </div>
  );
};

export default ImagenActividadVer;
