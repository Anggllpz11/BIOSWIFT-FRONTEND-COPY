import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createSede } from '../../../services/sedesService';
import { searchClientByKeyword } from '../../../services/clientsService';
import './styles/CreateSedeForm.css';
import { useNavigate } from 'react-router-dom';
import useUserRoleVerifier from '../../../hooks/useUserRoleVerifier';

const CreateSedeForm = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const [sedeData, setSedeData] = useState({
    id_client: '',
    sede_nombre: '',
    sede_address: '',
    sede_telefono: '',
    sede_email: '',
  });
  const [clientSearchResults, setClientSearchResults] = useState<any[]>([]);
  const [clientKeyword, setClientKeyword] = useState('');
  const navigate = useNavigate();
  const token = useSessionStorage('sessionJWTToken');

  // Si el usuario no está logueado o no es administrador, redirigir o mostrar mensaje
  if (!loggedIn) {
    navigate('/login');
    return null;
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

  const handleClientSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setClientKeyword(keyword);

    if (keyword.length > 2) {
      try {
        const results = await searchClientByKeyword(token, keyword);
        setClientSearchResults(results);
      } catch (error) {
        console.error('Error al buscar clientes', error);
      }
    } else {
      setClientSearchResults([]);
    }
  };

  const handleClientSelect = (client: any) => {
    setSedeData({ ...sedeData, id_client: client._id });
    setClientKeyword(client.client_name);
    setClientSearchResults([]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSede(token, sedeData)
      .then((response) => {
        // Manejar la respuesta
        window.alert(`Sede ${sedeData.sede_nombre} registrada correctamente`);
        navigate('/sedes');
      })
      .catch((error) => {
        // Manejar errores
        console.error('Error al crear la sede', error);
      });
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div>
      <div className="register-sede">
        <div className="div">
          <header className="header">
            <div className="overlap-group">
              <div className="register-title">REGISTRAR SEDE</div>
            </div>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="client-section">
              <div className="text-wrapper">Ingrese el cliente: *</div>
              <input
                className="client-search"
                type="text"
                value={clientKeyword}
                onChange={handleClientSearch}
              />
              <ul className="client-selected-div">
                {clientSearchResults.map((client) => (
                  <li
                    key={client._id}
                    className="client-selected"
                    onClick={() => handleClientSelect(client)}
                  >
                    {client.client_name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="name-section">
              <div className="text-wrapper">Nombre de Sede: *</div>
              <input
                className="img"
                type="text"
                id="sede_nombre"
                name="sede_nombre"
                value={sedeData.sede_nombre}
                onChange={handleInputChange}
              />
            </div>
            <div className="address-section">
              <div className="text-wrapper">Dirección: *</div>
              <input
                className="img"
                type="text"
                id="sede_address"
                name="sede_address"
                value={sedeData.sede_address}
                onChange={handleInputChange}
              />
            </div>
            <div className="municipio-section">
              <div className="text-wrapper">Ingrese el municipio: *</div>
              <input className="img" />
              <ul className="img-selected">
                <li className="img-2">municipio</li>
              </ul>
            </div>
            <div className="ordenes-section">
              <div className="text-wrapper">Enviar ordenes a: *</div>
              <input className="img" />
              <ul className="img-selected">
                <li className="img-2">ordenes</li>
              </ul>
            </div>
            <div className="preventivos-section">
              <div className="text-wrapper">Enviar preventivos a: *</div>
              <input className="img" />
              <ul className="img-selected">
                <li className="img-2">preventivos</li>
              </ul>
            </div>
            <div className="correctivos-section">
              <div className="text-wrapper">Enviar correctivos a: *</div>
              <input className="img" />
              <ul className="img-selected">
                <li className="img-2">correctivos</li>
              </ul>
            </div>
            <div className="sede-separator" />
            <div className="email-section">
              <div className="text-wrapper">Email: *</div>
              <input
                className="img"
                type="text"
                id="sede_email"
                name="sede_email"
                value={sedeData.sede_email}
                onChange={handleInputChange}
              />
            </div>
            <div className="telephone-section">
              <div className="text-wrapper">Teléfono: *</div>
              <input
                className="img"
                type="text"
                id="sede_telefono"
                name="sede_telefono"
                value={sedeData.sede_telefono}
                onChange={handleInputChange}
              />
            </div>
            <button className="register-b" type="submit">
              REGISTRAR
            </button>
            <button className="cancel-b" type="button" onClick={handleCancel}>
              CANCELAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSedeForm;
