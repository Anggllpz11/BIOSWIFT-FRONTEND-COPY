import React, { useEffect, useState } from 'react';
import { getSolicitudDadoBajaById } from '../../services/solicitudesDadoBajaService'; // Import the correct service
import { useSessionStorage } from '../../hooks/useSessionStorage';
import CircularProgress from '@mui/material/CircularProgress';
import { SolicitudDadoBaja } from '../../utils/types/SolicitudDadoBaja.type'; // Update to use the correct type
import SolicitudDadoBajaByIdPendiente from './SolicitudDadoBajaByIdPendiente';
import SolicitudDadoBajaByIdAbierta from './SolicitudDadoBajaByIdAbierta';
import SolicitudDadoBajaByIdRechazada from './SolicitudDadoBajaByIdRechazada';

interface SolicitudDadoBajaByIdOrdenProps {
  idSolicitudDadoBaja?: string;
  onBack?: () => void;
  onCambioSuccess?: () => void;
}

const SolicitudDadoBajaByIdOrden: React.FC<SolicitudDadoBajaByIdOrdenProps> = ({ idSolicitudDadoBaja, onBack, onCambioSuccess }) => {
  const [solicitudDadoBaja, setSolicitudDadoBaja] = useState<SolicitudDadoBaja | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    const fetchSolicitudDadoBaja = async () => {
      if (!idSolicitudDadoBaja || !token) {
        setLoading(false);
        return;
      }

      try {
        const fetchedSolicitud = await getSolicitudDadoBajaById(token, idSolicitudDadoBaja);
        setSolicitudDadoBaja(fetchedSolicitud);
      } catch (error) {
        console.error('Failed to fetch solicitud dado de baja:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudDadoBaja();
  }, [idSolicitudDadoBaja, token]);

  const refreshSolicitudDadoBaja = async () => {
    if (!idSolicitudDadoBaja || !token) {
      return;
    }
  
    setLoading(true);
    try {
      const fetchedSolicitud = await getSolicitudDadoBajaById(token, idSolicitudDadoBaja);
      setSolicitudDadoBaja(fetchedSolicitud);
    } catch (error) {
      console.error('Failed to fetch solicitud dado de baja:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#00ddfa', position: 'relative', top: '270px', left: '290px' }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }

  if (!solicitudDadoBaja) {
    return <div>No se encontró la solicitud de dado de baja.</div>;
  }

  return (
    <div>
      
      
      {solicitudDadoBaja.id_solicitud_baja_estado.estado === "Pendiente" && (
          <SolicitudDadoBajaByIdPendiente solicitudDadoBaja={solicitudDadoBaja} onBack={onBack} onCambioSuccess={onCambioSuccess}/>
      )}
      
      {solicitudDadoBaja.id_solicitud_baja_estado.estado === "Aprobada" && (
          <SolicitudDadoBajaByIdAbierta solicitudDadoBaja={solicitudDadoBaja} onBack={onBack} onCambioSuccess={onCambioSuccess}/>
      )}

      {solicitudDadoBaja.id_solicitud_baja_estado.estado === "Rechazada" && (
          <SolicitudDadoBajaByIdRechazada solicitudDadoBaja={solicitudDadoBaja} onBack={onBack} onCambioSuccess={onCambioSuccess}/>
      )}
     
    </div>
  );
};

export default SolicitudDadoBajaByIdOrden;

