import React from 'react';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { deletePreventivoById } from '../../services/preventivosService';

const DeletePreventivoButton: React.FC<{ preventivoId: string, title: string }> = ({ preventivoId, title }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      // Manejar la redirección si el usuario no está autenticado
      return;
    }

    try {
      const token = loggedIn;
      await deletePreventivoById(token, preventivoId);

      // Realizar la redirección y mostrar un mensaje de éxito
      navigate('/preventivos');
      window.alert(`El preventivo ${title} se ha eliminado satisfactoriamente`);
    } catch (error) {
      console.error('Error al eliminar el preventivo:', error);
    }
  };

  return (
    <DeleteOutlinedIcon className="PreventivoDetailPage-delete-icon" onClick={handleDelete} />
  );
};

export default DeletePreventivoButton;
