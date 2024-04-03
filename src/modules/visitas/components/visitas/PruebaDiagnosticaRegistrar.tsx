import React, { useState } from 'react';
import { getVisitaById, updateVisita } from '../../services/visitasService'; // Asegúrate de que la ruta sea correcta
import { CircularProgress } from '@mui/material';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EquipoDisponibilidadRegistrar.css'; // Asegúrate de crear y referenciar los estilos específicos para este componente

interface PruebaDiagnosticaRegistrarProps {
  idVisita: string;
  onActividadesUpdated: () => void;
}

const PruebaDiagnosticaRegistrar: React.FC<PruebaDiagnosticaRegistrarProps> = ({ idVisita, onActividadesUpdated }) => {
  const token = useSessionStorage('sessionJWTToken');
  const [observacion, setObservacion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!observacion) {
      alert('Por favor, complete el campo de observación.');
      return;
    }

    const formattedDateCreated = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const visitaActual = await getVisitaById(token, idVisita);

    // Añade la nueva actividad al array existente de actividades
    const actividadesActualizadas = [
      ...visitaActual.actividades,
      {
        id_protocolo: '65a93de089a02ef211e75ecf', // ID fijo para "Inicio prueba diagnostica"
        observacion: observacion,
        date_created: formattedDateCreated,
      }
    ];

    // Prepara el objeto para actualizar la visita
    const datosActualizados = {
      ...visitaActual,
      actividades: actividadesActualizadas
    };

    try {
      if (token && idVisita) {
        await updateVisita(token, idVisita, datosActualizados);
        alert('Actividad "Inicio Prueba Diagnóstica" agregada a la visita con éxito.');
        onActividadesUpdated(); 
      } else {
        alert('No se encontró token de sesión.');
      }
    } catch (error) {
      console.error('Error al actualizar la visita:', error);
      alert('Error al actualizar la visita.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="EquipoDisponibleRegistrar-actividad">
      <form onSubmit={handleSubmit}>
        <div className="EquipoDisponibleRegistrar-div">
          <div className="EquipoDisponibleRegistrar-overlap-group">
            <div className="EquipoDisponibleRegistrar-disponible-t">Inicio Prueba Diagnóstica</div>
          </div>
          <label className="EquipoDisponibleRegistrar-disponible" htmlFor="observacion">Observación: *</label>
          <textarea 
            className="EquipoDisponibleRegistrar-disponible-2"
            id="observacion"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Escribe tu observación aquí..."
          />
          <button type='submit' className="EquipoDisponibleRegistrar-overlap">
            CREAR ACTIVIDAD
          </button>
        </div>
      </form>
    </div>
  );
}

export default PruebaDiagnosticaRegistrar;
