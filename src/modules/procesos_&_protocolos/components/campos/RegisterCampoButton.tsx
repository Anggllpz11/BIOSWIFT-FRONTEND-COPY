import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterCampoButton.css'; 
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const RegisterCampoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/campos/register'); // Redirige a la ruta de registro de campos
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterCampo-button-redirec-container'>
        <button
          className='RegisterCampo-button-redirect'
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

export default RegisterCampoButton;
