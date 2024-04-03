import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createSede } from '../../../services/sedesService';
import './styles/CreateSedeForm.css';
import { useNavigate } from 'react-router-dom';
import useUserRoleVerifier from '../../../hooks/useUserRoleVerifier';
import { logoutService } from '../../../services/authService';

const CreateSedeForm = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const [sedeData, setSedeData] = useState({
    sede_nombre: '',
    sede_address: '',
    sede_telefono: '',
    sede_email: '',
  });
  const navigate = useNavigate();
  const token = useSessionStorage('sessionJWTToken');

  // Si el usuario no está logueado o no es administrador, redirigir o mostrar mensaje
  if (!loggedIn) {
    navigate('/login'); // Redirige al usuario
    return null; // Opcional: puedes devolver null o cualquier otro elemento si deseas
  }
  

  if (!isAdmin) {
    return (
      <div>
        <p>No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSedeData({
      ...sedeData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSede(token, sedeData)
      .then((response) => {
        // Manejar la respuesta
        window.alert(`Sede ${sedeData.sede_nombre} registrada correctamente`);
        navigate('/sedes'); // Redirigir al usuario a la página de sedes
      })
      .catch((error) => {
        // Manejar errores
        console.error('Error al crear la sede', error);
      });
  };

  return (
    <div>
      <div className="CreateSedeForm-box">
        <form className="CreateSedeForm-form" onSubmit={handleSubmit}>
          <h2>Crear Sede</h2>
          <div className="CreateSedeForm-inputBox">
            <input
              className="CreateSedeForm-input"
              type="text"
              id="sede_nombre"
              name="sede_nombre"
              value={sedeData.sede_nombre}
              onChange={handleInputChange}
            />
            <span className="CreateSedeForm-span">Nombre de Sede</span>
            <i></i>
          </div>
          <div className="CreateSedeForm-inputBox">
            <input
              type="text"
              className="CreateSedeForm-input"
              id="sede_address"
              name="sede_address"
              value={sedeData.sede_address}
              onChange={handleInputChange}
            />
            <span className="CreateSedeForm-span">Dirección</span>
            <i></i>
          </div>
          <div className="CreateSedeForm-inputBox">
            <input
              type="text"
              className="CreateSedeForm-input"
              id="sede_telefono"
              name="sede_telefono"
              value={sedeData.sede_telefono}
              onChange={handleInputChange}
            />
            <span className="CreateSedeForm-span">Teléfono</span>
            <i></i>
          </div>
          <div className="CreateSedeForm-inputBox">
            <input
              type="text"
              className="CreateSedeForm-input"
              id="sede_email"
              name="sede_email"
              value={sedeData.sede_email}
              onChange={handleInputChange}
            />
            <span className="CreateSedeForm-span">Email</span>
            <i></i>
          </div>
          <button className="CreateSedeForm-button" type="submit">
            Crear Sede
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSedeForm;
