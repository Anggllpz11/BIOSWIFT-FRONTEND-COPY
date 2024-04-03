import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterButtonRedirect.css'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const RegisterButtonRedirect: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/register');
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterUser-button-redirec-container'>
          <button
            className='RegisterUser-button-redirect'
            type='button' // Usamos type='button' en lugar de type='submit' para evitar envíos de formulario
            onClick={handleRedirect}
          >
            <PersonAddIcon />
          </button>
      </div>
    );
  } else {
    // Si el usuario no cumple con los requisitos, puedes renderizar null o cualquier otro componente/mensaje
    return null;
  }
};

export default RegisterButtonRedirect;
