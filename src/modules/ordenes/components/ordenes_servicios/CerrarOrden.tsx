import React, { useState } from 'react';
import { updateOrden } from '../../services/ordenesService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/CerrarOrden.css';
import MuiAlertComponent from '../../../../components/MuiAlertsComponent';

interface CerrarOrdenProps {
  idOrden: any;
  onClose: () => void;
  onUpdate: () => void;
}

const CerrarOrden: React.FC<CerrarOrdenProps> = ({ idOrden, onClose, onUpdate }) => {
  const [observacionesCierre, setObservacionesCierre] = useState('');
  const [alerts, setAlerts] = useState<{ id: number, message: string, severity: 'error' | 'warning' | 'info' | 'success' }[]>([]);
  const userId = useSessionStorage('userId');
  const loggedIn = useSessionStorage('sessionJWTToken');

  const addAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message, severity }]);
  };

 const handleSubmitCierre = async () => {
  if (!observacionesCierre.trim()) {
    // Si las observaciones están vacías, mostramos una alerta y no continuamos
    addAlert('Las observaciones de cierre son obligatorias.', 'error');
    return; // Salimos de la función para evitar hacer la llamada a la API
  }

  const now = new Date();
  const cierre = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const ordenData = {
    id_orden_estado: "65c5962b66a5a36f3df90639",
    id_cerrador: userId,
    cierre: cierre,
    observaciones_cierre: observacionesCierre
  };

  try {
    const token = loggedIn;
    await updateOrden(token, idOrden, ordenData);
    addAlert(`Orden con ID ${idOrden} CERRADA correctamente.`, 'success');
    setTimeout(() => {
      onClose();
      onUpdate();  // Llamamos a fetchOrden para actualizar la lista de órdenes
    }, 2000); 
  } catch (error) {
    addAlert('Error al cerrar la orden.', 'error');
  }
};

const handleCloseAlert = (id: number) => {
  setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
};

  return (
    <div className="CerrarOrden-modal-overlay">
      <div className="CerrarOrden-modal-content">
        <h3 className='CerrarOrden-modal-content-title'>Cerrar Orden</h3>
        <textarea
          className="CerrarOrden-textarea"
          value={observacionesCierre}
          onChange={(e) => setObservacionesCierre(e.target.value)}
          placeholder='Observaciones...'
          required
        />
        <div className="CerrarOrden-modal-actions">
          <button className="CerrarOrden-modal-cancel-button" onClick={onClose}>Cancelar</button>
          <button className="CerrarOrden-close-observacion-button" onClick={handleSubmitCierre}>Confirmar Cierre</button>
        </div>
      </div>
      <MuiAlertComponent alerts={alerts} onClose={handleCloseAlert} />
    </div>
  );
};

export default CerrarOrden;
