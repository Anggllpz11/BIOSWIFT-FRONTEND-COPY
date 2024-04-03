import React from 'react';
import { deleteMarcaEquipoById } from '../../services/marcasEquipoService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

type DeleteMarcaEquipoButtonProps = {
  marcaEquipoId: string;
  onDeleteSuccess: () => void;
};

const DeleteMarcaEquipoButton: React.FC<DeleteMarcaEquipoButtonProps> = ({ marcaEquipoId, onDeleteSuccess }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      return;
    }

    try {
      const token = loggedIn;
      await deleteMarcaEquipoById(token, marcaEquipoId);

      navigate('/equipos/marcas');
      window.alert('La marca de equipo se ha eliminado satisfactoriamente');
      onDeleteSuccess();
    } catch (error) {
      console.error('Error al eliminar la marca de equipo:', error);
    }
  };

  return (

    <DeleteOutlinedIcon  className="MarcaEquipoDetailPage-marcaequipo-delete" onClick={handleDelete}></DeleteOutlinedIcon>
  );
};

export default DeleteMarcaEquipoButton;
