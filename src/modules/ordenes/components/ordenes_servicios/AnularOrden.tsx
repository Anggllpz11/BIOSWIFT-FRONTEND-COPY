import React, { useState } from 'react';
import { updateOrden } from '../../services/ordenesService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/AnularOrden.css';
import MuiAlertComponent from '../../../../components/MuiAlertsComponent';

interface AnularOrdenProps {
  idOrden: any;
  onClose: () => void;
  onUpdate: () => void;
}

const AnularOrden: React.FC<AnularOrdenProps> = ({ idOrden, onClose, onUpdate }) => {
  const [observacionesAnulacion, setObservacionesAnulacion] = useState('');
  const [alerts, setAlerts] = useState<{ id: number, message: string, severity: 'error' | 'warning' | 'info' | 'success' }[]>([]);
  const userId = useSessionStorage('userId');
  const loggedIn = useSessionStorage('sessionJWTToken');


  const addAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message, severity }]);
  };
  
  const handleSubmitAnulacion = async () => {
    if (!observacionesAnulacion.trim()) {
      addAlert('Las observaciones de cierre son obligatorias.', 'error');
      return;
    }
  
    const now = new Date();
    const anulacion_date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
    const ordenData = {
      id_orden_estado: "65c5962f66a5a36f3df9063b",
      id_anulador: userId,
      anulacion_date: anulacion_date,
      observaciones_anulacion: observacionesAnulacion
    };
  
    try {
      const token = loggedIn;
      await updateOrden(token, idOrden, ordenData);
      addAlert(`Orden con ID ${idOrden} anulada correctamente.`, 'success');
      setTimeout(() => {
        onClose();
        onUpdate();
      }, 2000);
    } catch (error) {
      addAlert('Error al anular la orden.', 'error');
    }
  };

  const handleCloseAlert = (id: number) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };
  return (
    <div className="AnularOrden-modal-overlay">
      <div className="AnularOrden-modal-content">
        <h3 className='AnularOrden-modal-content-title'>Anular Orden</h3>
        <textarea
          className="AnularOrden-textarea"
          value={observacionesAnulacion}
          onChange={(e) => setObservacionesAnulacion(e.target.value)}
          placeholder='Observaciones...'
          required
        />
        <div className="AnularOrden-modal-actions">
          <button className="AnularOrden-modal-cancel-button" onClick={onClose}>Cancelar</button>
          <button className="AnularOrden-close-observacion-button" onClick={handleSubmitAnulacion}>Confirmar Anulación</button>
        </div>
      </div>
      <MuiAlertComponent alerts={alerts} onClose={handleCloseAlert}  />
    </div>
  );
};

export default AnularOrden;
