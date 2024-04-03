import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getVisitaById } from '../../services/visitasService'; // Asegúrate de que la ruta sea correcta
import './styles/EquipoDisponibilidad.css';
import { useSessionStorage } from '../../hooks/useSessionStorage'; // Asegúrate de que la ruta sea correcta
import EquipoDisponibleRegistrar from './EquipoDisponibilidadRegistrar';
import EquipoDisponibleEsperaRegistrar from './EquipoDisponibilidadEsperaRegistrar';
import EquipoDisponibilidadVer from './EquipoDisponibilidadVer';
import EquipoDisponibilidadEsperaVer from './EquipoDisponibilidadEsperaVer';

interface EquipoDisponibilidadProps {
  idVisita: string;
  onActividadesUpdated: () => void;
}

const EquipoDisponibilidad: React.FC<EquipoDisponibilidadProps> = ({ idVisita, onActividadesUpdated }) => {
  const [idProtocolo, setIdProtocolo] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Inicializado en true para mostrar carga inicialmente
  const [visita, setVisita] = useState<any>(null);
  const [actividades, setActividades] = useState<any[]>([]);
  const token = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    if (token && idVisita) {
      getVisitaById(token, idVisita)
        .then(data => {
          setVisita(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener la visita por ID:', error);
          setIsLoading(false);
        });
    }
  }, [token, idVisita]);
  

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdProtocolo(e.target.value);
    setIsLoading(true); // Simula la carga al cambiar de opción

    // Simula un retraso para mostrar el indicador de carga
    setTimeout(() => {
      setIsLoading(false); // Finaliza la carga
    }, 1000);
  }; 

  // Preparar componentes de actividades fuera del return
  let equipoDisponibilidadVerComponent = null;
  let equipoDisponibilidadEsperaVerComponent = null;

  if (visita && visita.actividades.length > 0) {

    const equipoDisponibleEsperaActividad = visita.actividades.find((act: any) => act.id_protocolo.title === "En espera de disponibilidad");
    if (equipoDisponibleEsperaActividad) {
      equipoDisponibilidadEsperaVerComponent = <EquipoDisponibilidadEsperaVer actividad={equipoDisponibleEsperaActividad} />;
    }
    const equipoDisponibleActividad = visita.actividades.find((act: any) => act.id_protocolo.title === "Equipo disponible");
    if (equipoDisponibleActividad) {
      equipoDisponibilidadVerComponent = <EquipoDisponibilidadVer actividad={equipoDisponibleActividad} />;
    }
  }

  // Revisa si ya existe la actividad "Equipo Disponible"
  const equipoDisponibleExistente = visita && visita.actividades.find((act: any) => act.id_protocolo.title === "Equipo disponible");
  
  // Revisa si ya existe la actividad "En Espera de Disponibilidad"
  const esperaDisponibilidadExistente = visita && visita.actividades.find((act: any) => act.id_protocolo.title === "En espera de disponibilidad");

  
  return (
    <div className="EquipoDisponibilidad-visita-actividad">


        {equipoDisponibilidadEsperaVerComponent}
        {equipoDisponibilidadVerComponent}

        {((!equipoDisponibleExistente && !esperaDisponibilidadExistente) || (!equipoDisponibleExistente && esperaDisponibilidadExistente)) &&(
          <div className="EquipoDisponibilidad-actividad-group">
            <div className="EquipoDisponibilidad-overlap-group">
              <div className="EquipoDisponibilidad-actividad-title">ACTIVIDAD A EJECUTAR</div>
              <select
                className="EquipoDisponibilidad-actividad-select"
                value={idProtocolo}
                onChange={handleSelectChange}
              >
                <option value="" disabled selected>Seleccione una opción</option>
                {!equipoDisponibleExistente && <option value="65a93df489a02ef211e75ed3">Equipo Disponible</option>}
                {!esperaDisponibilidadExistente && <option value="65a93dec89a02ef211e75ed1">En Espera de Disponibilidad</option>}
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
            {idProtocolo === '65a93df489a02ef211e75ed3' && <EquipoDisponibleRegistrar idVisita={idVisita} onActividadesUpdated={onActividadesUpdated}/>}
            {idProtocolo === '65a93dec89a02ef211e75ed1' && <EquipoDisponibleEsperaRegistrar idVisita={idVisita} onActividadesUpdated={onActividadesUpdated}/>}
          </>

        )}
    </div>
  );
};

export default EquipoDisponibilidad;
