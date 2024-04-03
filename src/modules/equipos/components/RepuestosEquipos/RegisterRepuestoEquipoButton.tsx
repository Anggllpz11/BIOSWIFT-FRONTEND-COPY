import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterRepuestoEquipoButton.css'; // Ajusta la ruta a tus estilos
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';


const RegisterRepuestoEquipoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/equipos-repuestos/register'); // Ajusta la ruta para registrar un repuesto equipo
  };

  // Verificar si el usuario está loggeado y es administrador antes de renderizar el botón
  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterRepuestoEquipo-button-redirec-container'>
        <button
          className='RegisterRepuestoEquipo-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <HandymanOutlinedIcon />+
        </button>
      </div>
    );
  } else {
    // Si el usuario no cumple con los requisitos, puedes renderizar null o cualquier otro componente/mensaje
    return null;
  }
};

export default RegisterRepuestoEquipoButton;
