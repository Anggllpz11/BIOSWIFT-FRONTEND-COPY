import React, { useState, useEffect } from 'react';
import { updateOrden } from '../../services/ordenesService';
import { getAllOrdenesSubEstado } from '../../services/ordenSubEstadoService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/RegisterCambiosOrden.css';
import { OrdenSubEstado } from '../../utils/types/OrdenSubEstado.type';
import { OrdenCambio } from '../../utils/types/Orden.type';

interface RegisterCambioOrdenProps {
  idOrden: string;
  onCambioSuccess: () => void;
  cambiosExistentes?: OrdenCambio[];
  onCancel: () => void;
}


const RegisterCambioOrden: React.FC<RegisterCambioOrdenProps> = ({ idOrden, onCambioSuccess, cambiosExistentes, onCancel }) => {
  const [comentario, setComentario] = useState('');
  const [subEstadoId, setSubEstadoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subEstados, setSubEstados] = useState<OrdenSubEstado[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const userId = useSessionStorage('userId');
  const now = new Date();
  const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  useEffect(() => {
    const fetchSubEstados = async () => {
      try {
        const token = loggedIn;
        const response = await getAllOrdenesSubEstado(token);
        if (response) {
          setSubEstados(response); // Aquí está la corrección
        }
      } catch (error) {
        console.error('Error al obtener los subestados:', error);
      }
    };
  
    fetchSubEstados();
  }, [loggedIn]);
  
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!loggedIn || !userId) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    try {
      const nuevoCambio = {
        ids_orden_sub_estado: subEstadoId,
        id_creador: userId,
        date_created: formattedDateCreated,
        comentario,
      };

      // Combina los cambios existentes con el nuevo cambio
      const cambiosActualizados = cambiosExistentes
        ? [...cambiosExistentes, nuevoCambio]
        : [nuevoCambio];

      const cambioData = { orden_cambios: cambiosActualizados };

      await updateOrden(loggedIn, idOrden, cambioData);
      setLoading(false);
      onCambioSuccess(); // Notificar al componente padre sobre el éxito
    } catch (error) {
      console.error('Error al registrar el cambio en la orden:', error);
      setError('Ocurrió un error al registrar el cambio');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="RegisterCambioOrden-box">
      <div className="RegisterCambioOrden-register-cambio">
        <div className="RegisterCambioOrden-overlap-group">
          <div className="RegisterCambioOrden-overlap">
            <div className="RegisterCambioOrden-title-t">AGREGAR CAMBIO</div>
          </div>
          <p className="RegisterCambioOrden-select-input">Seleccione el subestado a registrar: *</p>
          <select
            className="RegisterCambioOrden-subestado-li"
            value={subEstadoId}
            onChange={(e) => setSubEstadoId(e.target.value)}
            required
          >
            <option value="">Selecciona un Sub Estado</option>
            {subEstados.map((subEstado) => (
              <option key={subEstado._id} value={subEstado._id}>
                {subEstado.sub_estado}
              </option>
            ))}
          </select>
          <div className="RegisterCambioOrden-comments-i">Ingrese las observaciones: *</div>
          <textarea
            className="RegisterCambioOrden-comments-t"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comentario"
            required
          />
          <button className="RegisterCambioOrden-register-button" disabled={loading} type='submit'>
            {loading ? 'Cargando...' : 'AGREGAR CAMBIO'}
          </button>
          <button 
          className="RegisterCambioOrden-cancel-button"
          type="button" 
          onClick={onCancel} 
          disabled={loading}
          >
            CANCELAR
          </button>
          {error && <p className="RegisterCambioOrden-error-message">{error}</p>}
        </div>
      </div>
    </form>
  );
};

export default RegisterCambioOrden;
