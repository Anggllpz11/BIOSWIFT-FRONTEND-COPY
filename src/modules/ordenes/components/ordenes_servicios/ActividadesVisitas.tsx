import React, { useEffect, useState } from 'react';
import { getPresignedUrlForGet, getVisitaById } from '../../../visitas/services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import TecnicoEnSede from '../../../visitas/components/visitas/TecnicoEnSede';
import './styles/ActividadesVisitas.css';
import EquipoDisponibilidadVer from '../../../visitas/components/visitas/EquipoDisponibilidadVer';
import EquipoDisponibilidadEsperaVer from '../../../visitas/components/visitas/EquipoDisponibilidadEsperaVer';
import CambiarRepuestoVer from '../../../visitas/components/visitas/CambiarRepuestoVer';
import PreventivoVisitaVer from '../../../visitas/components/visitas/PreventivoVisitaVer';
import PruebaDiagnosticaVer from '../../../visitas/components/visitas/PruebaDiagnosticaVer';
import ImagenActividadVer from '../../../visitas/components/visitas/ImagenActividadVer';
import PruebaElectricaVer from '../../../visitas/components/visitas/PruebaElectricaVer';

interface ActividadesVisitasProps {
  idVisita: string;
}

const ActividadesVisitas: React.FC<ActividadesVisitasProps> = ({ idVisita }) => {
  const token = useSessionStorage('sessionJWTToken');
  const [visita, setVisita] = useState<{ actividades: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token && idVisita) {
      setIsLoading(true); // Comenzamos a cargar
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
                try {
                  const presignedUrlResponse = await getPresignedUrlForGet(token, s3ObjectKey);
                  // Agregar la URL firmada al objeto de actividad
                  return { ...actividad, presignedImageUrl: presignedUrlResponse.presignedUrl };
                } catch (error) {
                  console.error('Error al obtener la URL firmada para la imagen:', error);
                  // Mantener la actividad sin la imagen si hay un error
                  return actividad;
                }
              }
              return actividad;
            }));
    
            // Actualizar el estado con las actividades que incluyen las URLs firmadas
            setVisita({ ...data, actividades: actividadesConUrls });
          } else {
            // Si no hay actividades, solo establecer la visita
            setVisita(data);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener la visita por ID:', error);
          setIsLoading(false);
        });
    }
  }, [token, idVisita]);
  

  
  if (isLoading) {
    return <div className='ActividadesVisitas-set-loading'>Cargando detalles de la visita...</div>;
  }

    if (!visita) {
      return (
        <div style={{
          color: '#00ddfa', // Color del texto
          textAlign: 'center', // Alineación del texto
          fontSize: '18px', // Tamaño del texto
          position: 'relative',
          top: '305px',
        }}>
          No se encontraron actividades para esta visita.
        </div>
      );
    }
  

  // Función que retorna el componente correspondiente a un tipo de actividad
  const getActividadComponent = (actividad: any) => {
    switch (actividad.id_protocolo.title) {
      case 'Técnico en sede':
        return <TecnicoEnSede key={actividad._id} actividad={actividad} />;
      case 'En espera de disponibilidad':
        return <EquipoDisponibilidadEsperaVer key={actividad._id} actividad={actividad} />;
      case 'Equipo disponible':
        return <EquipoDisponibilidadVer key={actividad._id} actividad={actividad} />;
      case 'Cambiar Repuesto':
        return <CambiarRepuestoVer key={actividad._id} actividad={actividad} />;
      case 'Preventivo':
        return <PreventivoVisitaVer key={actividad._id} actividad={actividad} />;
      case 'Inicio prueba diagnostica':
        return <PruebaDiagnosticaVer key={actividad._id} actividad={actividad} />;
      case 'Imagen':
        return <ImagenActividadVer key={actividad._id} actividad={actividad} />;
      case 'Prueba de Seguridad Eléctrica':
        return <PruebaElectricaVer key={actividad._id} actividad={actividad} />;
      default:
        return null; // o un componente de fallback si es necesario
    }
  };

  return (
    <div>
      <div className='ActividadesVisitas-title'>ACTIVIDADES</div>
      <div className="ActividadesVisitas-container">
      {visita.actividades.map((actividad) => getActividadComponent(actividad))}
      </div>
    </div>
  );
};

export default ActividadesVisitas;