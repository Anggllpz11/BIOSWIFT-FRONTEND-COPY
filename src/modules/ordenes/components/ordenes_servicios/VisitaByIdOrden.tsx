import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import VisitaByIdPendiente from './VisitaByIdPendiente';
import { getVisitaById } from '../../../visitas/services/visitasService';
import VisitaByIdAbierta from './VisitaByIdAbierta';
import VisitaByIdCerrada from './VisitaByIdCerrada';
import VisitaByIdRechazada from './VisitaByIdRechazada';

interface VisitaByIdOrdenProps {
  idVisita: string;
  onVisitaSelect: (id: string | null) => void; // Añade esta línea
}

const VisitaByIdOrden: React.FC<VisitaByIdOrdenProps> = ({ idVisita, onVisitaSelect  }) => {
  const [visita, setVisita] = useState<any>(null);
  const [showVisitaByIdPendiente, setShowVisitaByIdPendiente] = useState(true);
  const token = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    if (token && idVisita) {
      getVisitaById(token, idVisita)
        .then(data => {
          setVisita(data);
        })
        .catch(error => console.error('Error al obtener la visita por ID:', error));
    }
  }, [token, idVisita]);

  const handleCloseVisitaByIdPendiente = () => {
    onVisitaSelect(null); // Llama a onVisitaSelect cuando se cierre VisitaByIdPendiente
  };


  return (
    <div>

      {/* Renderiza VisitaByIdPendiente solo si el estado de la visita es Pendiente */}
      {visita && visita.id_visita_estado.estado === 'Pendiente' && (
        <VisitaByIdPendiente idVisita={visita._id} onClose={() => onVisitaSelect(null)}/>
      )}

      {/* Renderiza VisitaByIdAbierta solo si el estado de la visita es Abierta */}
      {visita && visita.id_visita_estado.estado === 'Abierta' && (
        <VisitaByIdAbierta idVisita={visita._id} onClose={() => onVisitaSelect(null)}/>
      )}

      {/* Renderiza VisitaByIdCerrada solo si el estado de la visita es Cerrada */}
      {visita && visita.id_visita_estado.estado === 'Cerrada' && (
        <VisitaByIdCerrada idVisita={visita._id}  onClose={() => onVisitaSelect(null)}/>
      )}

      {/* Renderiza VisitaByIdRechazada solo si el estado de la visita es Rechazada */}
      {visita && visita.id_visita_estado.estado === 'Rechazada' && (
        <VisitaByIdRechazada idVisita={visita._id}  onClose={() => onVisitaSelect(null)} />
      )}
    </div>
  );
};

export default VisitaByIdOrden;
