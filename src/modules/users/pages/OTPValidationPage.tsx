import React from 'react';
import OTPValidationForm from '../components/forms/OTPValidationForm';
import { useLocation } from 'react-router-dom';

export const OTPValidationPage = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div>
      {email ? (
        <OTPValidationForm email={email} />
      ) : (
        <p>Correo electrónico no encontrado.</p>
      )}
    </div>
  );
};
