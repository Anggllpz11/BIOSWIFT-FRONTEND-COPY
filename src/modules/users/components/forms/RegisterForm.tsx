import React, { useState } from 'react';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/RegisterForm.css';
import MuiAlertComponent from '../../../../components/MuiAlertsComponent';

const RegisterUserForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: '',
    password: 'ClaveTemporal1234',
    firstName: '',
    lastName: '',
    cedula: '',
    telefono: '',
    email: '',
    more_info: '',
    roles: '',
    type: '',
    titulo: '',
    reg_invima: '',
  });
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alerts, setAlerts] = useState<{ id: number, message: string, severity: 'error' | 'warning' | 'info' | 'success' }[]>([]);

  if (!isAdmin) {
    return <div><p>No puedes hacer esto</p></div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    if (name === 'roles' && value === 'tecnico') {
      setShowAdditionalFields(true);
    } else if (name === 'roles') {
      setShowAdditionalFields(false);
    }
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
    return usernameRegex.test(username);
  };

  const validateForm = (): boolean => {
    const { username, firstName, lastName, cedula, telefono, email, roles } = formValues;
    return Boolean(username && firstName && lastName && cedula && telefono && email && roles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message: 'Todos los campos son obligatorios, excepto Información adicional', severity: 'warning' }]);
      return;
    }

    if (!validateUsername(formValues.username)) {
      setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message: 'El formato de username debe ser firstname.lastname', severity: 'warning' }]);
      return;
    }

    setIsSubmitting(true);

    const {
      username, password, firstName, lastName, cedula, telefono, email, more_info, roles, type, titulo, reg_invima
    } = formValues;

    const name = `${firstName} ${lastName}`;
    const rolesArray = [{ name: roles }];

    try {
      await register(
        username,
        password,
        name,
        Number(cedula),
        telefono,
        email,
        more_info,
        rolesArray,
        type,
        titulo,
        reg_invima
      );
      setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message: 'Usuario registrado con éxito', severity: 'success' }]);
      setTimeout(() => {
        navigate('/users');
      }, 1000); // Espera 1 segundo antes de navegar
    } catch (error) {
      setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message: 'Error al registrar el usuario', severity: 'error' }]);
      console.error(`[REGISTER ERROR]: Something went wrong: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const handleCloseAlert = (id: number) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div>
      <form className="register-user" onSubmit={handleSubmit}>
        <div className="div">
          <header className="header">
            <div className="overlap-group">
              <div className="register-title">REGISTRAR USUARIO</div>
            </div>
          </header>
          <div className="fullname-section">
            <p className="text-wrapper">Nombres y apellidos del usuario: *</p>
            <div className="name-title"> Nombres</div>
            <input 
              className="name-input"
              id='firstName'
              type='text'
              name='firstName'
              value={formValues.firstName}
              onChange={handleChange}
            />
            <div className="lastname-title">Apellidos</div>
            <input 
              className="lastname-input"
              id='lastName'
              type='text'
              name='lastName'
              value={formValues.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="username-section">
            <div className="text-wrapper">Username: *</div>
            <input 
              className="input"
              id='username'
              type='text'
              name='username'
              value={formValues.username}
              onChange={handleChange}
            />
          </div>
          <div className="cedula-section">
            <div className="text-wrapper">Cédula: *</div>
            <input 
              className="input"
              id='cedula'
              type='text'
              name='cedula'
              value={formValues.cedula}
              onChange={handleChange}
            />
          </div>
          <div className="telephone-section">
            <div className="text-wrapper">Teléfono: *</div>
            <input 
              className="input"
              id='telefono'
              type='text'
              name='telefono'
              value={formValues.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="repuesto-separator" />
          <div className="email-section">
            <div className="text-wrapper">Email: *</div>
            <input 
              className="input"
              id='email'
              type='text'
              name='email'
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <div className="aditional-section">
            <div className="text-wrapper">Información adicional:</div>
            <input 
              className="input"
              id='more_info'
              type='text'
              name='more_info'
              value={formValues.more_info}
              onChange={handleChange}
            />
          </div>
          <div className="role-section">
            <div className="text-wrapper">Tipo de rol: *</div>
            <select 
              className="input"
              name='roles'
              id='roles'
              onChange={handleChange}
              value={formValues.roles}
            >
              <option value='' disabled>Seleccione un rol</option>
              <option value='user'>Invitado</option>
              <option value='tecnico'>Técnico</option>
              <option value='coordinador'>Coordinador</option>
              <option value='analista'>Analista</option>
              <option value='comercial'>Comercial</option>
              <option value='contabilidad'>Contable</option>
              <option value='almacen'>Almacén</option>
            </select>
          </div>
          {showAdditionalFields && (
            <div className="tecnico-section">
              <div className="type-section">
                <div className="text-wrapper-2">Tipo de técnico:</div>
                <input 
                  className="input-2"
                  id='type'
                  type='text'
                  name='type'
                  value={formValues.type}
                  onChange={handleChange}
                />
              </div>
              <div className="invima-section">
                <div className="text-wrapper-2">Reg Invima:</div>
                <input 
                  className="invima-input"
                  id='reg_invima'
                  type='text'
                  name='reg_invima'
                  value={formValues.reg_invima}
                  onChange={handleChange}
                />
              </div>
              <div className="title-section">
                <div className="text-wrapper-2">Titulo:</div>
                <input 
                  className="input-2"
                  id='titulo'
                  type='text'
                  name='titulo'
                  value={formValues.titulo}
                  onChange={handleChange}
                />
              </div>
              <div className="location-section">
                <div className="text-wrapper-2">Ubicación:</div>
                <input 
                  className="input-2"
                />
              </div>
            </div>
          )}
          <button className="register-b" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'REGISTRAR'}
          </button>
          <button className="cancel-b" type="button" onClick={handleCancel}>
            CANCELAR
          </button>
        </div>
      </form>
      <MuiAlertComponent alerts={alerts} onClose={handleCloseAlert} />
    </div>
  );
};

export default RegisterUserForm;
