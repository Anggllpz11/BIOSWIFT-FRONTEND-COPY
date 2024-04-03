import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterTipoEquipoButton.css';
import TypeSpecimenOutlinedIcon from '@mui/icons-material/TypeSpecimenOutlined';

const RegisterTipoEquipoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/equipos/tipos/register'); // Ajusta la ruta a la que deseas redirigir para registrar un tipo de equipo
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterTipoEquipo-button-redirec-container'>
        <button
          className='RegisterTipoEquipo-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <TypeSpecimenOutlinedIcon />
        </button>
      </div>
    );
  } else {
    // Si el usuario no cumple con los requisitos, puedes renderizar null o cualquier otro componente/mensaje
    return null;
  }
};

export default RegisterTipoEquipoButton;
