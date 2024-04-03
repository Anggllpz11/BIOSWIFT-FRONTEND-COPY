import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterEquipoButton.css';
import FaxOutlinedIcon from '@mui/icons-material/FaxOutlined';
import AddIcon from '@mui/icons-material/Add';

const RegisterEquipoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/equipos/register'); // Ajusta la ruta a la que deseas redirigir para registrar un equipo
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterEquipo-button-redirec-container'>
        <button
          className='RegisterEquipo-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <FaxOutlinedIcon /> 
        </button>
          <AddIcon className='RegisterEquipo-button-redirect-add' onClick={handleRedirect}/>
      </div>
    );
  } else {
    // Si el usuario no cumple con los requisitos, puedes renderizar null o cualquier otro componente/mensaje
    return null;
  }
};

export default RegisterEquipoButton;
