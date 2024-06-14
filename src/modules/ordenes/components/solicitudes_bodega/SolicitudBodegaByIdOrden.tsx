import React, { useEffect, useState } from 'react';
import { getSolicitudBodegaById } from '../../services/solicitudesBodegaService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import CircularProgress from '@mui/material/CircularProgress';
import { SolicitudBodega } from '../../utils/types/SolicitudBodega.type';
import SolicitudBodegaByIdPendiente from './SolicitudBodegaByIdPendiente';
import SolicitudBodegaByIdAprobada from './SolicitudBodegaByIdAprobada';
import SolicitudBodegaByIdDespachada from './SolicitudBodegaByIdDespachada';
import SolicitudBodegaByIdTerminada from './SolicitudBodegaByIdTerminada';
import SolicitudBodegaByIdRechazada from './SolicitudBodegaByIdRechazada';

interface SolicitudBodegaByIdOrdenProps {
  idSolicitudBodega?: string;
  onBack?: () => void;
  onCambioSuccess?: () => void;
}

const SolicitudBodegaByIdOrden: React.FC<SolicitudBodegaByIdOrdenProps> = ({ idSolicitudBodega, onBack, onCambioSuccess }) => {
  const [solicitudBodega, setSolicitudBodega] = useState<SolicitudBodega | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    const fetchSolicitudBodega = async () => {
      if (!idSolicitudBodega || !token) {
        setLoading(false);
        return;
      }

      try {
        const fetchedSolicitud = await getSolicitudBodegaById(token, idSolicitudBodega);
        setSolicitudBodega(fetchedSolicitud);
      } catch (error) {
        console.error('Failed to fetch solicitud bodega:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudBodega();
  }, [idSolicitudBodega, token]);

  const refreshSolicitudBodega = async () => {
    if (!idSolicitudBodega || !token) {
      return;
    }
  
    setLoading(true);
    try {
      const fetchedSolicitud = await getSolicitudBodegaById(token, idSolicitudBodega);
      setSolicitudBodega(fetchedSolicitud);
    } catch (error) {
      console.error('Failed to fetch solicitud bodega:', error);
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

  if (!solicitudBodega) {
    return <div>No se encontró la solicitud de bodega.</div>;
  }

  return (
    <div>
        {solicitudBodega.id_estado.estado === "Pendiente" && (
            <SolicitudBodegaByIdPendiente solicitudBodega={solicitudBodega} onBack={onBack} onCambioSuccess={onCambioSuccess}/>
        )}
        {solicitudBodega.id_estado.estado === "Aprobada" && (
            <SolicitudBodegaByIdAprobada solicitudBodega={solicitudBodega} onBack={onBack} onCambioSuccess={onCambioSuccess} onNewNovedad={refreshSolicitudBodega}/>
        )}
        {solicitudBodega.id_estado.estado === "Rechazada" && (
            <SolicitudBodegaByIdRechazada solicitudBodega={solicitudBodega} onBack={onBack} onCambioSuccess={onCambioSuccess} onNewNovedad={refreshSolicitudBodega}/>
        )}
        {solicitudBodega.id_estado.estado === "Despachada" && (
            <SolicitudBodegaByIdDespachada solicitudBodega={solicitudBodega} onBack={onBack} onCambioSuccess={onCambioSuccess} onNewNovedad={refreshSolicitudBodega}/>
        )}
        {solicitudBodega.id_estado.estado === "Terminada" && (
            <SolicitudBodegaByIdTerminada solicitudBodega={solicitudBodega} onBack={onBack} onCambioSuccess={onCambioSuccess} onNewNovedad={refreshSolicitudBodega}/>
        )}
    </div>
  );
};

export default SolicitudBodegaByIdOrden;
