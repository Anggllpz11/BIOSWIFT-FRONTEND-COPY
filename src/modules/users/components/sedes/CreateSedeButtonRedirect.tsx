import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import './styles/CreateSedeButtonRedirect.css';

const CreateSedeButtonRedirect: React.FC = () => {
  // Obtener el estado de autenticación y el rol del usuario
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/create-sede');
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='CreateSede-button-redirect-container'>
        <button
          className='CreateSede-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <AddBusinessIcon /> 
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default CreateSedeButtonRedirect;
