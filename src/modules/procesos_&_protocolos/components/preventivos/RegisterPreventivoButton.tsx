import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterPreventivoButton.css'; // Asegúrate de importar el archivo CSS correcto
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const RegisterPreventivoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/preventivos/register'); // Ajusta la ruta a la que deseas redirigir para registrar un preventivo
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterPreventivo-button-redirec-container'>
        <button
          className='RegisterPreventivo-button-redirect'
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

export default RegisterPreventivoButton;
