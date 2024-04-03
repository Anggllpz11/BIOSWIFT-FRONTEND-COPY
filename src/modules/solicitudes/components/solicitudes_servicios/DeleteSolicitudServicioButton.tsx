import React from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { deleteSolicitudServicio } from '../../services/solicitudesServiciosService';

const DeleteSolicitudServicioButton: React.FC<{ solicitudId: string }> = ({ solicitudId }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      // Manejar la redirección si el usuario no está autenticado
      return;
    }

    try {
      const token = loggedIn;
      await deleteSolicitudServicio(token, solicitudId);

      // Realizar la redirección y mostrar un mensaje de éxito
      navigate('/solicitudes-servicios'); // Reemplaza '/ruta-donde-quieras-redirigir' por la ruta deseada
      window.alert('La solicitud de servicio se ha eliminado satisfactoriamente');
    } catch (error) {
      console.error('Error al eliminar la solicitud de servicio:', error);
    }
  };

  return (
    <DeleteOutlinedIcon className="SolicitudesServicioDetailPage-delete-icon" onClick={handleDelete}>
    </DeleteOutlinedIcon>
  );
};

export default DeleteSolicitudServicioButton;
