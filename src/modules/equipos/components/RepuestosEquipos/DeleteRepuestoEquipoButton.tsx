import React, { useState } from 'react';
import { AxiosResponse } from 'axios';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { deleteRepuestoEquipoById } from '../../services/repuestosEquiposService';

const DeleteRepuestoEquipoButton: React.FC<{ repuestoEquipoId: string, repuestoName: string }> = ({ repuestoEquipoId, repuestoName }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!loggedIn) {
      // Manejar la redirección si el usuario no está autenticado
      return;
    }

    try {
      const token = loggedIn;
      await deleteRepuestoEquipoById(token, repuestoEquipoId);

      // Realizar la redirección y mostrar un mensaje de éxito
      navigate('/equipos-repuestos');
      window.alert(`El repuesto ${repuestoName} se ha eliminado satisfactoriamente`);
    } catch (error) {
      console.error('Error al eliminar el repuesto equipo:', error);
    }
  };

  return (
    <DeleteOutlinedIcon className="RepuestoEquipoDetailPage-delete-icon-header"  onClick={handleDelete}>Eliminar Repuesto Equipo</DeleteOutlinedIcon>
  );
};

export default DeleteRepuestoEquipoButton;
