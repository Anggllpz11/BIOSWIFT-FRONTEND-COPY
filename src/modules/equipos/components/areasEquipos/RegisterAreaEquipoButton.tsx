import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterAreaEquipoButton.css';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

const RegisterAreaEquipoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/equipos/areas/register'); // Ajusta la ruta a la que deseas redirigir para registrar un área de equipo
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterAreaEquipo-button-redirec-container'>
        <button
          className='RegisterAreaEquipo-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <SpaceDashboardIcon />
        </button>
      </div>
    );
  } else {
    // Si el usuario no cumple con los requisitos, puedes renderizar null o cualquier otro componente/mensaje
    return null;
  }
};

export default RegisterAreaEquipoButton;
