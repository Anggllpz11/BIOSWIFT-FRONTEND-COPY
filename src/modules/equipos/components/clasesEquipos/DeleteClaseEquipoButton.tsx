import React from 'react';
import { deleteClaseEquipoById } from '../../services/clasesEquipoService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

type DeleteClaseEquipoButtonProps = {
  claseEquipoId: string;
  onDeleteSuccess: () => void;
};

const DeleteClaseEquipoButton: React.FC<DeleteClaseEquipoButtonProps> = ({ claseEquipoId, onDeleteSuccess }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      return;
    }

    try {
      const token = loggedIn;
      await deleteClaseEquipoById(token, claseEquipoId);

      navigate('/equipos/clases/');
      window.alert('La clase de equipo se ha eliminado satisfactoriamente');
      onDeleteSuccess();
    } catch (error) {
      console.error('Error al eliminar la clase de equipo:', error);
    }
  };

  return (
    <DeleteOutlinedIcon className='ClaseEquipoDetailPage-marcaequipo-delete' onClick={handleDelete}></DeleteOutlinedIcon>
  );
};

export default DeleteClaseEquipoButton;
