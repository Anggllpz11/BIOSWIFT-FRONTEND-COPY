import React, { useState, FormEvent, useEffect } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createClaseEquipo } from '../../../services/clasesEquipoService';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterClaseEquipoForm.css';

const RegisterClaseEquipoForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [claseEquipoData, setClaseEquipoData] = useState({
    clase: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClaseEquipoData({ ...claseEquipoData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const token = loggedIn;
      await createClaseEquipo(token, claseEquipoData);
      // Puedes redirigir o mostrar un mensaje de éxito aquí
      console.log('Clase de equipo registrada exitosamente');
      navigate('/equipos/clases');
    } catch (error) {
      // Maneja errores, muestra mensajes de error, etc.
      console.error('Error al registrar la clase de equipo:', error);
    }
  };

  const handleCancel = () => {
    navigate('/equipos/clases');
  };

  useEffect(() => {
    if (!loggedIn) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="RegisterClaseEquipoForm-box">
        <div className="RegisterClaseEquipoForm-register-marca">
          <div className="RegisterClaseEquipoForm-overlap-group">
            <div className="RegisterClaseEquipoForm-overlap">
              <p className="RegisterClaseEquipoForm-register-marca-title">REGISTRAR NUEVA CLASE DE EQUIPO</p>
            </div>
            <label className="RegisterClaseEquipoForm-register-marca-label">
              Ingrese el nombre de la clase de equipo que desea registrar:
            </label>
            <input
              className="RegisterClaseEquipoForm-register-marca-input"
              type="text"
              id="clase"
              name="clase"
              value={claseEquipoData.clase}
              onChange={handleChange}
            />
            <button className="RegisterClaseEquipoForm-registrar-button" type="submit">
              Registrar
            </button>
            <button className="RegisterClaseEquipoForm-cancelar-button" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterClaseEquipoForm;
