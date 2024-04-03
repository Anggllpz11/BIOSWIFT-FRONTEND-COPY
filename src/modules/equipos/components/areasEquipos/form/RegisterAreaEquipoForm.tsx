import React, { useState, FormEvent, useEffect } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createAreaEquipo } from '../../../services/areasEquiposService';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterAreaEquipoForm.css'
import { logoutService } from '../../../../users/services/authService';
const RegisterAreaEquipoForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [areaEquipoData, setAreaEquipoData] = useState({
    area: '',
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAreaEquipoData({ ...areaEquipoData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const token = loggedIn;
      await createAreaEquipo(token, areaEquipoData);
      // Puedes redirigir o mostrar un mensaje de éxito aquí
      console.log('Área de equipo registrada exitosamente');
      navigate('/equipos/areas')
      
    } catch (error) {
      // Maneja errores, muestra mensajes de error, etc.
      console.error('Error al registrar el área de equipo:', error);
    }
  };
  const hangleCancel = () => {
    navigate('/equipos/areas')
  };

  useEffect(() => {
    if (!loggedIn) {
      logoutService();
    }
  }, [loggedIn, navigate]);


  return (
    <div>
      <form onSubmit={handleSubmit} className="RegisterAreaEquipoForm-box">
        <div className="RegisterAreaEquipoForm-register-marca">
          <div className="RegisterAreaEquipoForm-overlap-group">
            <div className="RegisterAreaEquipoForm-overlap">
              <p className="RegisterAreaEquipoForm-register-marca-title">REGISTRAR NUEVA ÁREA DE EQUIPO</p>
            </div>
            <label className="RegisterAreaEquipoForm-register-marca-label">Ingrese el nombre del área de equipo que desea registrar:</label>
            <input 
            className="RegisterAreaEquipoForm-register-marca-input"
            type="text"
            id="area"
            name="area"
            value={areaEquipoData.area}
            onChange={handleChange}
            />
            <button className="RegisterAreaEquipoForm-registrar-button" type='submit'>Registrar</button>
            <button className="RegisterAreaEquipoForm-cancelar-button"  onClick={hangleCancel}>Cancelar</button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterAreaEquipoForm;
