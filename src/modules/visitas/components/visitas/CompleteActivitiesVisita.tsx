import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getPresignedUrlForGet, getVisitaById } from '../../services/visitasService'; // Asegúrate de que la ruta sea correcta
import './styles/CompleteActivitiesVisita.css';
import { useSessionStorage } from '../../hooks/useSessionStorage'; // Asegúrate de que la ruta sea correcta
import CambiarRepuestoRegistrar from './CambiarRepuestoRegistrar';
import CambiarRepuestoVer from './CambiarRepuestoVer';
import PreventivoVisitaRegistrar from './PreventivoVisitaRegistrar';
import PreventivoVisitaVer from './PreventivoVisitaVer';
import PruebaDiagnosticaRegistrar from './PruebaDiagnosticaRegistrar';
import PruebaDiagnosticaVer from './PruebaDiagnosticaVer';
import ImagenActividadRegistrar from './ImagenActividadRegistrar';
import ImagenActividadVer from './ImagenActividadVer';
import PruebaElectricaRegister from './PruebaElectricaRegister';
import PruebaElectricaVer from './PruebaElectricaVer';

interface CompleteActivitiesVisitaProps {
  idVisita: string;
  onActividadesUpdated: () => void;
}

const CompleteActivitiesVisita: React.FC<CompleteActivitiesVisitaProps> = ({ idVisita, onActividadesUpdated }) => {
  const [idProtocolo, setIdProtocolo] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Inicializado en true para mostrar carga inicialmente
  const [actividades, setActividades] = useState<any[]>([]);
  const token = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    if (token && idVisita) {
      getVisitaById(token, idVisita).then(async (data) => {
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
                const presignedUrlData = await getPresignedUrlForGet(token, s3ObjectKey);
                // Agregar la URL firmada al objeto de actividad
                return { ...actividad, presignedImageUrl: presignedUrlData.presignedUrl };
              } catch (error) {
                console.error('Error al obtener la URL firmada para la imagen:', error);
                // Mantener la actividad sin la imagen si hay un error
                return actividad;
              }
            }
            return actividad;
          }));
          // Actualizar el estado con las actividades que incluyen las URLs firmadas
          setActividades(actividadesConUrls);
        }
        setIsLoading(false);
      });
    }
  }, [token, idVisita]);

  // Revisa si ya existe la actividad "Equipo Disponible"
  const equipoDisponibleExistente = actividades.some(actividad => actividad.id_protocolo.title === 'Equipo disponible');

  // Revisa si ya existe la actividad "Cambiar Repuesto"
  const cambioRepuestoExistente = actividades.some(actividad => actividad.id_protocolo.title === 'Cambiar Repuesto');

  // Revisa si ya existe la actividad "Preventivo"
  const preventivoExistente = actividades.some(actividad => actividad.id_protocolo.title === 'Preventivo');

  // Revisa si ya existe la actividad "Inicio prueba diagnostica"
  const pruebaDiagnosticaExistente = actividades.some(actividad => actividad.id_protocolo.title === 'Inicio prueba diagnostica');
  

  // Revisa si ya existe la actividad "Prueba de Seguridad Eléctrica"
  const pruebaSeguridadElectricaExistente = actividades.some(actividad => actividad.id_protocolo.title === 'Prueba de Seguridad Eléctrica');
  


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdProtocolo(e.target.value);
    setIsLoading(true); // Simula la carga al cambiar de opción

    // Simula un retraso para mostrar el indicador de carga
    setTimeout(() => {
      setIsLoading(false); // Finaliza la carga
    }, 1000);
  }; 

  // Función que retorna el componente correspondiente a un tipo de actividad
  const getActividadComponent = (actividad: any) => {
    switch (actividad.id_protocolo.title) {

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
        return null; 
    }
  };

  return (
    <div className="CompleteActivitiesVisita-visita-actividad">

         {/* Renderización condicional de componentes de visualización */}
         {actividades.map((actividad) => getActividadComponent(actividad))}

        {(equipoDisponibleExistente) && (
          <div className="EquipoDisponibilidad-actividad-group">
            <div className="EquipoDisponibilidad-overlap-group">
              <div className="EquipoDisponibilidad-actividad-title">ACTIVIDAD A EJECUTAR</div>
              <select
                className="EquipoDisponibilidad-actividad-select"
                value={idProtocolo}
                onChange={handleSelectChange}
              >
                <option value="" disabled selected>Seleccione una opción</option>
                {!pruebaDiagnosticaExistente && <option value="65a93de089a02ef211e75ecf">Inicio Prueba Diagnósitca</option>}
                <option value="65a93d9e89a02ef211e75ec5">Cambiar Repuesto</option>
                {!preventivoExistente && <option value="65a93dc689a02ef211e75ec9">Preventivo</option>}
                {!pruebaSeguridadElectricaExistente && <option value="65a93e0689a02ef211e75ed7">Prueba de Seguridad Eléctrica</option>}
                <option value="65a93dcf89a02ef211e75ecb">Toma de Imagen</option>


              </select>
            </div>
          </div>
        )}
        {isLoading ? (
          <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#00ddfa' }}>
            <CircularProgress className='EquipoDisponibilidad-loading-icon' />
          </div>
        ) : (
          <>
            {idProtocolo === '65a93d9e89a02ef211e75ec5' && <CambiarRepuestoRegistrar idVisita={idVisita} onActividadesUpdated={onActividadesUpdated}/>}
            {idProtocolo === '65a93dc689a02ef211e75ec9' && <PreventivoVisitaRegistrar idVisita={idVisita} onActividadesUpdated={onActividadesUpdated}/>}
            {idProtocolo === '65a93de089a02ef211e75ecf' && <PruebaDiagnosticaRegistrar idVisita={idVisita} onActividadesUpdated={onActividadesUpdated}/>}
            {idProtocolo === '65a93dcf89a02ef211e75ecb' && <ImagenActividadRegistrar idVisita={idVisita} onActividadesUpdated={onActividadesUpdated}/>}
            {idProtocolo === '65a93e0689a02ef211e75ed7' && <PruebaElectricaRegister idVisita={idVisita} onActividadesUpdated={onActividadesUpdated}/>}
          </>

        )}
    </div>
  );
};

export default CompleteActivitiesVisita;

