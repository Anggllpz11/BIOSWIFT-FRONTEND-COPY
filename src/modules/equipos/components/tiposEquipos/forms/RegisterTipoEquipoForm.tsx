import React, { useState, FormEvent, useEffect } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createTipoEquipo } from '../../../services/tiposEquipoService';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterTipoEquipoForm.css'
const RegisterTipoEquipoForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [tipoEquipoData, setTipoEquipoData] = useState({
    tipo: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTipoEquipoData({ ...tipoEquipoData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const token = loggedIn;
      await createTipoEquipo(token, tipoEquipoData);
      // Puedes redirigir o mostrar un mensaje de éxito aquí
      console.log('Tipo de equipo registrado exitosamente');
      navigate('/equipos/tipos')

    } catch (error) {
      // Maneja errores, muestra mensajes de error, etc.
      console.error('Error al registrar el tipo de equipo:', error);
    }
  }; 
  
  const hangleCancel = () => {
    navigate('/equipos/tipos')
  };
  useEffect(() => {
    if (!loggedIn) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="RegisterTipoEquipoForm-box">
        <div className="RegisterTipoEquipoForm-register-marca">
          <div className="RegisterTipoEquipoForm-overlap-group">
            <div className="RegisterTipoEquipoForm-overlap">
              <p className="RegisterTipoEquipoForm-register-marca-title">REGISTRAR NUEVO TIPO DE EQUIPO</p>
            </div>
            <label className="RegisterTipoEquipoForm-register-marca-label">Ingrese el nombre del tipo de equipo que desea registrar:</label>
            <input 
            className="RegisterTipoEquipoForm-register-marca-input"
            type="text"
            id="tipo"
            name="tipo"
            value={tipoEquipoData.tipo}
            onChange={handleChange}
            />
            <button className="RegisterTipoEquipoForm-registrar-button" type='submit'>Registrar</button>
            <button className="RegisterTipoEquipoForm-cancelar-button"  onClick={hangleCancel}>Cancelar</button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterTipoEquipoForm;
