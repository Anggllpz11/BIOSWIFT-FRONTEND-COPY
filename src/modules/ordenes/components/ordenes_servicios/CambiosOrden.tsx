import React, { useState } from 'react';
import { Orden, OrdenCambio } from '../../utils/types/Orden.type';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './styles/CambiosOrden.css';
import RegisterCambiosOrden from './RegisterCambiosOrden';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OrdenCambioDetails from './OrdenCambioDetails';

interface CambiosOrdenProps {
    cambios?: OrdenCambio[]; 
    idOrden?: string;
    onReloadNeeded: () => void; // Prop para manejar la actualización exitosa

}

const CambiosOrden: React.FC<CambiosOrdenProps> = ({ cambios, idOrden, onReloadNeeded}) => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [cambioSeleccionado, setCambioSeleccionado] = useState<OrdenCambio | null>(null); 

  const handleAgregarClick = () => {
    setMostrarRegistro(true);
  setCambioSeleccionado(null);

};

const handleCambioSuccess = () => {
  alert('Cambio registrado con éxito');
  setMostrarRegistro(false);
    onReloadNeeded();
};

const handleCambioClick = (cambio: OrdenCambio) => {
  setCambioSeleccionado(cambio); // Establece el cambio seleccionado
  setMostrarRegistro(false);
};

const handleCancelarClick = () => {
  setMostrarRegistro(false);
};



  return (
   <div className="CambiosOrden-cotizaciones-orden">
        <div className="CambiosOrden-div">
          <header className="CambiosOrden-header">
            <div className="CambiosOrden-overlap-group">
              <div className="CambiosOrden-cambios-t">CAMBIOS</div>
            </div>
          </header>
          <div className="CambiosOrden-overlap">
            <div className="CambiosOrden-resumen-section">
              <div className="CambiosOrden-resumen-header">
                <div className="CambiosOrden-overlap-group-2">
                  <div className="CambiosOrden-resumen-t">RESUMEN</div>
                  <AddCircleIcon className="CambiosOrden-add-icon" onClick={handleAgregarClick}/>
                </div>
              </div>
            </div>
            <div className="CambiosOrden-resume-list">
            {cambios && cambios.length > 0 ? (
                <ul>
                    {cambios.map((cambio, index) => (
                        <li className="CambiosOrden-cambio-card" key={index}>
                            <div className="CambiosOrden-overlap-group-3">
                            <p className="CambiosOrden-subestado-t">{cambio && cambio.ids_orden_sub_estado && cambio.ids_orden_sub_estado.sub_estado || 'N/A'}</p>
                            <div className="CambiosOrden-subestado-comments">{cambio && cambio.comentario || 'N/A'}</div>
                            <div className="CambiosOrden-separator"/>
                            <div className="CambiosOrden-registered-by">REGISTRADO POR:</div>
                            <div className="CambiosOrden-username">{cambio && cambio.id_creador && cambio.id_creador.name || 'N/A'}</div>
                            <div className="CambiosOrden-date-t">EL DÍA:</div>
                            <div className="CambiosOrden-date-value">{cambio && cambio.date_created || 'N/A'}</div>
                            </div>
                            <OpenInNewIcon className="CambiosOrden-open-icon" onClick={() => handleCambioClick(cambio)}/>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay cambios registrados para esta orden.</p>
              )}
            </div>
          </div>
          {mostrarRegistro && idOrden && (
                 <RegisterCambiosOrden
                 idOrden={idOrden}
                 onCambioSuccess={handleCambioSuccess}
                 cambiosExistentes={cambios} 
                 onCancel={handleCancelarClick}
               />
            )}

          {cambioSeleccionado && <OrdenCambioDetails cambio={cambioSeleccionado} />} {/* Renderizar detalles del cambio seleccionado */}
        </div>
    </div>
  );
};

export default CambiosOrden;