
import React, { useState } from 'react';
import { forgotPassword } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import './styles/ForgotPasswordForm.css'
function ForgotPasswordForm() {

    


    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();
   
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          await forgotPassword(email);
          console.log('Solicitud de recuperación de contraseña enviada');
          
          // Redirigir a la página de validación de OTP y pasar el correo electrónico como estado
          navigate('/otp-validator', { state: { email } });
        } catch (error) {
          console.error('Error al enviar la solicitud de recuperación de contraseña:', error);
          // Puedes mostrar un mensaje de error al usuario
        }
      };
    return (
        <div>
          <div className='ForgotPasswordForm-box'>
              
                <form onSubmit={handleFormSubmit} className='ForgotPasswordForm-form'>
                   
                    <h2>Recuperación de Clave</h2>
                    <br></br>
                    <div className='ForgotPasswordForm-inputBox'> 
                    <p className='ForgotPasswordForm-p'>Para establecer una nueva clave,
                       por favor ingrese su dirección correo electrónico,
                        recibirá un mensaje en la bandeja de entrada con las instrucciones.</p>
                        <br></br>
                      <input className='ForgotPasswordForm-input' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      <span>Dirección de Email</span>
                      <i></i>
                    </div>
                    <br></br>
                    <button className='ForgotPasswordForm-button' type="submit">Enviar</button>
                </form>
            
           </div>
        </div>
    );
}

export default ForgotPasswordForm;