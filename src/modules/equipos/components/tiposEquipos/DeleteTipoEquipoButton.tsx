import React from 'react';
import { deleteTipoEquipoById } from '../../services/tiposEquipoService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

type DeleteTipoEquipoButtonProps = {
  tipoEquipoId: string;
  onDeleteSuccess: () => void;
};

const DeleteTipoEquipoButton: React.FC<DeleteTipoEquipoButtonProps> = ({ tipoEquipoId, onDeleteSuccess }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      return;
    }

    try {
      const token = loggedIn;
      await deleteTipoEquipoById(token, tipoEquipoId);

      navigate('/equipos/tipos');
      window.alert('El tipo de equipo se ha eliminado satisfactoriamente');
      onDeleteSuccess();
    } catch (error) {
      console.error('Error al eliminar el tipo de equipo:', error);
    }
  };

  return (
    <DeleteOutlinedIcon  className="TipoEquipoDetailPage-marcaequipo-delete" onClick={handleDelete}>Eliminar Tipo de Equipo</DeleteOutlinedIcon>
  );
};

export default DeleteTipoEquipoButton;
