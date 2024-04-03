import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterMarcaEquipoButton.css';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';


const RegisterMarcaEquipoButton: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/equipos/marcas/register'); 
  };

  if (loggedIn && isAdmin) {
    return (
      <div className='RegisterMarcaEquipo-button-redirec-container'>
        <button
          className='RegisterMarcaEquipo-button-redirect'
          type='button'
          onClick={handleRedirect}
        >
          <LocalOfferOutlinedIcon />
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default RegisterMarcaEquipoButton;
