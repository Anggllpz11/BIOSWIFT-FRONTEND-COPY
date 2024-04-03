import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Navigate, useNavigate } from 'react-router-dom';
import { validateOTP } from '../../services/authService';
import './styles/OTPValidatorForm.css';
interface OTPValidationFormProps {
  email: string; 
}

const OTPValidationForm: React.FC<OTPValidationFormProps> = ({ email }) => {
  const [validationMessage, setValidationMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (values: { otp: string }) => {
    try {
      const response = await validateOTP(email, values.otp);
      // console.log('Response from backend:', response);
  
      if (response.status === 200) {
        console.log('OTP is valid, redirecting to update-password');
        // OTP válido, redirigir a la página de cambio de contraseña (/update-password)
        navigate(`/update-password`, { state: { email } });
      } else {
        // console.log('OTP is not valid, setting validation message');
        // OTP no válido, muestra un mensaje al usuario
        setValidationMessage('El código OTP no es válido o está expirado. Inténtalo nuevamente.');
      }
    } catch (error) {
      // console.error('Error while validating OTP:', error);
      // Manejar el error de manera adecuada aquí, si es necesario
      setValidationMessage('Error al validar el código OTP. Inténtalo nuevamente.');
    }
  };
  

  return (
    <div>
      <Formik initialValues={{ otp: '' }} onSubmit={handleSubmit}>
      <div className='OTPValidatorForm-box'>
        <Form className='OTPValidatorForm-form'>
          <h2>¡Hola!</h2>
          <div className='OTPValidatorForm-inputBox'>
            <p className='OTPValidatorForm-p'>Por favor, ingrese el código de 6 digitos que recibió
              en su bandeja de mensajes en su dirección de
               correo electrónico: {email}</p> {/* Mostrar el correo electrónico */}
               <br></br>
               <br></br>
            <Field className='OTPValidatorForm-Field' type="text" id="otp" name="otp" />
            <span>Ej: xxx-xxx</span>
            <i></i>
          </div>
          <br></br>
          <br></br>
            <button className='OTPValidatorForm-button' type="submit">Validar</button>
          
        </Form>
      </div>  
      </Formik>
      {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
    </div>
  );
};

export default OTPValidationForm;
