import React, { useEffect, useState } from 'react';
import { getPresignedUrlForGet, getVisitaById } from '../../../visitas/services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import TecnicoEnSede from './TecnicoEnSede'; // Asegúrate de que la ruta de importación sea correcta
import RegisterTecnicoEnSede from './RegisterTecnicoEnSede';
import './styles/ActividadesEjecutar.css'
import EquipoDisponibilidad from './EquipoDisponibilidad';
import CompleteActivitiesVisita from './CompleteActivitiesVisita';

interface ActividadesEjecutarProps {
  idVisita: string;
}

const ActividadesEjecutar: React.FC<ActividadesEjecutarProps> = ({ idVisita }) => {
  const token = useSessionStorage('sessionJWTToken');
  const [visita, setVisita] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para actualizar el estado y forzar re-renderización
  const refreshActividades = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    if (token && idVisita) {
      getVisitaById(token, idVisita)
        .then(async (data) => {
          if (data && data.actividades) {
            // Procesar cada actividad para obtener las URLs firmadas para las imágenes
            const actividadesConUrls = await Promise.all(data.actividades.map(async (actividad: any) => {
              if (actividad.id_image) {
                // Extraer la clave del objeto S3 de la URL
                const urlPath = new URL(actividad.id_image).pathname;
                // Remover el slash inicial del path si existe
                const s3ObjectKey = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
                // Obtener la URL firmada para la imagen
                const presignedUrlData = await getPresignedUrlForGet(token, s3ObjectKey);
                // Agregar la URL firmada al objeto de actividad
                return { ...actividad, presignedImageUrl: presignedUrlData.presignedUrl };
              }
              return actividad;
            }));
  
            // Actualizar el estado con las actividades que incluyen las URLs firmadas
            setVisita({ ...data, actividades: actividadesConUrls });
          }
        })
        .catch(error => {
          console.error('Error al obtener la visita por ID:', error);
        });
    }
  }, [token, idVisita, refreshKey]);
  
  
  // Lógica para decidir qué componente renderizar
  const renderActividad = () => {
    if (!visita || !visita.actividades || visita.actividades.length === 0) {
      // No hay actividades, mostrar componente para registrar actividad "Técnico en sede"
      return <RegisterTecnicoEnSede idVisita={idVisita} onActividadRegistrada={refreshActividades}/>;
    } else if (visita.actividades[0].id_protocolo.title === "Técnico en sede") {
      // La actividad en posición 0 es "Técnico en sede", mostrar componente para ver detalles y la seleccion de disponibilidad del equipo

      return (
        <>
          <TecnicoEnSede actividad={visita.actividades[0]} />
          <EquipoDisponibilidad idVisita={idVisita} onActividadesUpdated={refreshActividades}/> 
          <CompleteActivitiesVisita idVisita={idVisita} onActividadesUpdated={refreshActividades} />
        </>
      );
        
    }
    // Opcionalmente, manejar otros casos o simplemente no renderizar nada
    return null;
  };

  return (
    <div>
      <div className='ActividadesEjecutar-title'>EJECUTANDO VISITA</div>
      <div className='ActividadesEjecutar-container' key={refreshKey}>
        {renderActividad()}
      </div>
    </div>
  );
};

export default ActividadesEjecutar;
