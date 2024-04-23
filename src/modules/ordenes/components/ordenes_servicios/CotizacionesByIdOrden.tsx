import React, { useEffect, useState } from 'react';
import { Cotizacion } from '../../utils/types/Cotizacion.type';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getCotizacionById, getPresignedUrlForGetFirma } from '../../services/cotizacionesService';
import CotizacionByIdPendiente from './CotizacionByIdPendiente';
import CotizacionByIdAprobada from './CotizacionByIdAprobada';
import CotizacionByIdRechazada from './CotizacionByIdRechazada';

interface CotizacionesByIdOrdenProps {
    idCotizacion: string;
    onBack?: () => void;
    onCambioSuccess?: () => void;

  }
  
  const CotizacionesByIdOrden: React.FC<CotizacionesByIdOrdenProps> = ({ idCotizacion, onBack, onCambioSuccess}) => {
    const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
    const token = useSessionStorage('sessionJWTToken');
  
    useEffect(() => {
      const fetchCotizacionData = async () => {
        if (!idCotizacion || !token) return;

        try {
          const cotizacionData = await getCotizacionById(token, idCotizacion);
          if (cotizacionData.firma) {
            // Extraemos la clave del objeto S3 a partir de la URL de la firma
            const urlPath = new URL(cotizacionData.firma).pathname;
            const s3ObjectKey = urlPath.substring(1); // Eliminamos el primer '/' si existe

            // Obtenemos la URL firmada para la imagen de la firma
            const presignedUrlResponse = await getPresignedUrlForGetFirma(token, s3ObjectKey);
            if (presignedUrlResponse.presignedUrl) {
              // Actualizamos el estado con la cotización y la URL firmada
              cotizacionData.firma = presignedUrlResponse.presignedUrl;
            }
          }
          // Actualizamos el estado con los datos de la cotización
          setCotizacion(cotizacionData);
        } catch (error) {
          console.error("Error al obtener la cotización por ID:", error);
        }
      };

      fetchCotizacionData();
    }, [idCotizacion, token]);


  
    if (!cotizacion) return <div>Cargando cotización...</div>;
  
    return (
      <div>
        {cotizacion.id_estado.estado === 'Pendiente' && (
            <CotizacionByIdPendiente cotizacion={cotizacion} onBack={onBack} onCambioSuccess={onCambioSuccess} />
        )}
        {cotizacion.id_estado.estado === 'Aprobada' && (
            <CotizacionByIdAprobada cotizacion={cotizacion} onBack={onBack}/>
        )}
        {cotizacion.id_estado.estado === 'Rechazada' && (
            <CotizacionByIdRechazada cotizacion={cotizacion} onBack={onBack}/>
        )}
      </div>
    );
  };
  
  export default CotizacionesByIdOrden;
  