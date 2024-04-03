import React, { useState, FormEvent, useEffect } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createMarcaEquipo } from '../../../services/marcasEquipoService';
import './styles/RegisterMarcaEquipoForm.css'
import { useNavigate } from 'react-router-dom';

const RegisterMarcaEquipoForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [marcaEquipoData, setMarcaEquipoData] = useState({
    marca: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMarcaEquipoData({ ...marcaEquipoData, [name]: value });
  };
  const hangleCancel = () => {
    navigate('/equipos/marcas')
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const token = loggedIn;
      await createMarcaEquipo(token, marcaEquipoData);
      // Puedes redirigir o mostrar un mensaje de éxito aquí
      console.log('Marca de equipo registrada exitosamente');
      window.alert('Marca de equipo registrada exitosamente');
      navigate('/equipos/marcas')
    } catch (error) {
      // Maneja errores, muestra mensajes de error, etc.
      console.error('Error al registrar la marca de equipo:', error);
    }
  };
  useEffect(() => {
    if (!loggedIn) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  return (
    <div>
        <form onSubmit={handleSubmit} className="RegisterMarcaEquipoForm-box">
        <div className="RegisterMarcaEquipoForm-register-marca">
          <div className="RegisterMarcaEquipoForm-overlap-group">
            <div className="RegisterMarcaEquipoForm-overlap">
              <p className="RegisterMarcaEquipoForm-register-marca-title">REGISTRAR NUEVA MARCA DE EQUIPO</p>
            </div>
            <label className="RegisterMarcaEquipoForm-register-marca-label">Ingrese el nombre de la marca de equipo que desea registrar:</label>
            <input 
            className="RegisterMarcaEquipoForm-register-marca-input"
            type="text"
            id="marca"
            name="marca"
            value={marcaEquipoData.marca}
            onChange={handleChange}
            />
            <button className="RegisterMarcaEquipoForm-registrar-button" type='submit'>Registrar</button>
            <button className="RegisterMarcaEquipoForm-cancelar-button"  onClick={hangleCancel}>Cancelar</button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterMarcaEquipoForm;
