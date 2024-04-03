import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterModeloEquipoButton.css';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
const RegisterModeloEquipoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/equipos/modelos/register'); 
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterModeloEquipo-button-redirec-container'>
        <button
          className='RegisterModeloEquipo-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <DevicesOtherOutlinedIcon />
        </button>
      </div>
    );
  } else {
    // Si el usuario no cumple con los requisitos, puedes renderizar null o cualquier otro componente/mensaje
    return null;
  }
};

export default RegisterModeloEquipoButton;
