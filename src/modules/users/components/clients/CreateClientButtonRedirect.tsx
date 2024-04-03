import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import './styles/CreateClientButtonRedirect.css';

const CreateClientButtonRedirect: React.FC = () => {
  // Obtener el estado de autenticación y el rol del usuario
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/crear-cliente'); // Cambia '/create-sede' a '/create-cliente' para la ruta de creación de cliente
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='CreateClient-button-redirect-container'> {/* Ajusta las clases CSS según tus estilos */}
        <button
          className='CreateClient-button-redirect' // Ajusta la clase CSS según tus estilos
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

export default CreateClientButtonRedirect;
