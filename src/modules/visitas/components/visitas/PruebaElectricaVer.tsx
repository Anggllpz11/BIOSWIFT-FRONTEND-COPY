import React from 'react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import './styles/PruebaElectricaVer.css'; // Ajusta la ruta a tus estilos

interface PruebaElectrica {
  title: string;
  resultado: string;
  minimo: number;
  maximo: number;
  unidad: string;
  medida: number;
  _id: string;
}

interface PruebaElectricaVerProps {
  actividad: {
    id_protocolo: {
        _id?: string;
        title?: string;
      };
    prueba_electrica: PruebaElectrica[];
    date_created?: string;
  };
}

const PruebaElectricaVer: React.FC<PruebaElectricaVerProps> = ({ actividad }) => {
  return (
    <div className="PruebaElectricaVer-box">
      <div className="PruebaElectricaVer-actividad-prueba">
        <div className="PruebaElectricaVer-div">
          <div className="PruebaElectricaVer-prueba-electrica-t">{actividad.id_protocolo.title || 'N/A'}</div>
          {actividad.date_created && (
              <div>
                <DateRangeIcon className="PruebaElectricaVer-date"/>
                <div className="PruebaElectricaVer-date-value">{actividad.date_created}</div>
              </div>
            )}
          <div className="PruebaElectricaVer-form-container">
            <div className="PruebaElectricaVer-title-section">
              <div className="PruebaElectricaVer-form-t-wrapper">
                <div className="PruebaElectricaVer-form-t">PRUEBAS CUALITATIVAS</div>
              </div>
            </div>
            <div className='PruebaElectricaVer-container-list'>
              {actividad.prueba_electrica.map((prueba, index) => (
                <ul key={index} className='PruebaElectricaVer-ul'>
                  <li className="PruebaElectricaVer-section">
                    <div className="PruebaElectricaVer-campo-title">{prueba.title}</div>
                    <div className="PruebaElectricaVer-input">{`${prueba.medida}`}</div>
                    <p className="PruebaElectricaVer-range">En {prueba.unidad} Rango ( {prueba.minimo} a {prueba.maximo} ) </p>
                    <button className="PruebaElectricaVer-paso" style={{ backgroundColor: prueba.resultado === 'Pasó' ? '#00ff47' : '#ffffff' }} disabled >Pasó</button>
                    <button className="PruebaElectricaVer-fallo" style={{ backgroundColor: prueba.resultado === 'Falló' ? '#ff0000' : '#ffffff' }} disabled >Falló</button>
                  </li>
                </ul>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PruebaElectricaVer;
