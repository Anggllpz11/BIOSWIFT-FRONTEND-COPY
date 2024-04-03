import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { deleteCamposById } from '../../services/camposService';

const DeleteCampoButton: React.FC<{ campoId: string, title: string }> = ({ campoId, title }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      // Manejar la redirección si el usuario no está autenticado
      return;
    }

    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el campo '${title}'?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const token = loggedIn;
      await deleteCamposById(token, campoId);

      // Realizar la redirección y mostrar un mensaje de éxito
      navigate('/campos');
      window.alert(`El campo ${title} se ha eliminado satisfactoriamente`);
    } catch (error) {
      console.error('Error al eliminar el campo:', error);
    }
  };

  return (
    <DeleteOutlinedIcon className="CampoDetailPage-delete-icon" onClick={handleDelete} />
  );
};

export default DeleteCampoButton;
