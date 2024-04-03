import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../services/authService";
import './styles/UpdatePasswordForm.css';
import ZiriuzLog from './img/ziriuzLogoPNG.png';

interface UpdatePasswordFormProps {
  email: string; // Prop para recibir el correo electrónico
}

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ email }) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updatePassword(email, newPassword);
      console.log(response);

      if (response.status === 200) {
        console.log("Contraseña actualizada exitosamente");
        navigate("/pass-update-successfull"); // Redirigir a la página de inicio de sesión
      } else {
        console.log("Error al actualizar la contraseña");
        // Puedes mostrar un mensaje de error al usuario si lo deseas
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
    }
  };

  return (
    <div className="UpdatePasswordForm-box">
      <div>
           <img src={ZiriuzLog} alt="ZiriuzLogoWithLeters" className="UpdateForm-ZiriuzLogo" /> 
           <br></br>
          </div>

            <form onSubmit={handleSubmit} className="UpdatePasswordForm-form">
            <h2>Actualizar Clave</h2>
            <h4 className="UpdatePasswordForm-center-text">--- {email} ---</h4>
          
            <p className="UpdatePasswordForm-p">Por favor, ingrese su nueva contraseña:</p>
              <div className="UpdatePasswordForm-inputBox">

                <input className="UpdatePasswordForm-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  />
                <span>Nueva Contraseña</span>
                <i></i>
              </div>
              <br></br>
                <button className='UpdatePasswordForm-button' type="submit">Actualizar</button>
            </form>
    
      </div>
    
  );
};

export default UpdatePasswordForm;
