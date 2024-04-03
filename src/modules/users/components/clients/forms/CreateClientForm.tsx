import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createClient } from '../../../services/clientsService'; // Asegúrate de importar la función createClient correcta
import './styles/CreateClientForm.css'; // Ajusta las clases CSS según tus estilos
import { useNavigate } from 'react-router-dom';
import useUserRoleVerifier from '../../../hooks/useUserRoleVerifier';
import { logoutService } from '../../../services/authService';

const CreateClientForm = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const [clientData, setClientData] = useState({
    client_name: '',
    client_address: '',
    client_telefono: '',
    client_email: '',
    client_nit: '', // Agregamos el campo client_nit
    // Agrega otros campos necesarios para la creación de clientes
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
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createClient(token, clientData)
      .then((response) => {
        // Manejar la respuesta
        window.alert(`Cliente ${clientData.client_name} registrado correctamente`);
        navigate('/clientes'); // Redirigir al usuario a la página de clientes
      })
      .catch((error) => {
        // Manejar errores
        console.error('Error al crear el cliente', error);
      });
  };

  return (
    <div>
      <div className="CreateClientForm-box"> {/* Ajusta las clases CSS según tus estilos */}
        <form className="CreateClientForm-form" onSubmit={handleSubmit}>
          <h2>Crear Cliente</h2>
          <div className="CreateClientForm-inputBox">
            <input
              className="CreateClientForm-input" // Ajusta la clase CSS según tus estilos
              type="text"
              id="client_name"
              name="client_name"
              value={clientData.client_name}
              onChange={handleInputChange}
            />
            <span className="CreateClientForm-span">Nombre de Cliente</span>
            <i></i>
          </div>
          <div className="CreateClientForm-inputBox">
            <input
              type="number"
              className="CreateClientForm-input" // Ajusta la clase CSS según tus estilos
              id="client_nit"
              name="client_nit"
              value={clientData.client_nit}
              onChange={handleInputChange}
            />
            <span className="CreateClientForm-span">NIT</span>
            <i></i>
          </div>
          <div className="CreateClientForm-inputBox">
            <input
              type="text"
              className="CreateClientForm-input" // Ajusta la clase CSS según tus estilos
              id="client_address"
              name="client_address"
              value={clientData.client_address}
              onChange={handleInputChange}
            />
            <span className="CreateClientForm-span">Dirección</span>
            <i></i>
          </div>
          <div className="CreateClientForm-inputBox">
            <input
              type="text"
              className="CreateClientForm-input" // Ajusta la clase CSS según tus estilos
              id="client_telefono"
              name="client_telefono"
              value={clientData.client_telefono}
              onChange={handleInputChange}
            />
            <span className="CreateClientForm-span">Teléfono</span>
            <i></i>
          </div>
          <div className="CreateClientForm-inputBox">
            <input
              type="text"
              className="CreateClientForm-input" // Ajusta la clase CSS según tus estilos
              id="client_email"
              name="client_email"
              value={clientData.client_email}
              onChange={handleInputChange}
            />
            <span className="CreateClientForm-span">Email</span>
            <i></i>
          </div>
          {/* Agrega otros campos de formulario según sea necesario */}
          <button className="CreateClientForm-button" type="submit">
            Crear Cliente
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClientForm;
