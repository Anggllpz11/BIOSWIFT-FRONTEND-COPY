import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterSolicitudServicioButton.css'; // Asegúrate de tener los estilos correspondientes
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import useUserRoleVerifier from '../../../users/hooks/useUserRoleVerifier';
import { useSessionStorage } from '../../../users/hooks/useSessionStorage';

const RegisterSolicitudServicioButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']); // Asegúrate de ajustar los roles según tu lógica de autorización
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/solicitudes-servicios/register'); // Asegúrate de que esta ruta lleve al formulario de registro de solicitudes de servicio
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterSolicitudServicio-button-redirect-container'>
        <button
          className='RegisterSolicitudServicio-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <AddOutlinedIcon /> 
        </button>
      </div>
    );
  } else {
    // Si el usuario no cumple con los requisitos, puedes renderizar null o cualquier otro componente/mensaje
    return null;
  }
};

export default RegisterSolicitudServicioButton;
