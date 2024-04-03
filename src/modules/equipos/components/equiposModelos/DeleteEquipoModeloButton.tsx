import React from 'react';
import { deleteModeloEquipoById } from '../../services/equiposModeloService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

type DeleteEquipoModeloButtonProps = {
  modeloEquipoId: string;
  onDeleteSuccess: () => void; // Agregamos la prop onDeleteSuccess
};

const DeleteEquipoModeloButton: React.FC<DeleteEquipoModeloButtonProps> = ({ modeloEquipoId, onDeleteSuccess }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      // Manejar la redirección si el usuario no está autenticado
      return;
    }

    try {
      const token = loggedIn;
      await deleteModeloEquipoById(token, modeloEquipoId);

      // Realizar la redirección y mostrar un mensaje de éxito
      window.alert(`El modelo de equipo se ha eliminado satisfactoriamente`);
    setTimeout(() => {
      navigate('/equipos/modelos')
    }, 2000); 
      
      onDeleteSuccess(); // Llamamos a la función onDeleteSuccess para notificar el éxito
    } catch (error) {
      console.error('Error al eliminar el modelo de equipo:', error);
    }
  };

  return (
    <DeleteOutlinedIcon className="EquipoModeloDetailPage-delete" onClick={handleDelete} />
  );
};

export default DeleteEquipoModeloButton;
