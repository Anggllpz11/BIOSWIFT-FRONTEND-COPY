import React, { useState } from 'react';
import './styles/LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/authService';
import { AxiosResponse } from 'axios';
import ZiriuzLogo from './img/ziriuzLogoPNG.png';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Importar íconos de Material Icons

// Define Schema of validation with Yup
export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z]+\.[a-zA-Z]+$/, 'Invalid username format: TRY [firstname.lastname]')
    .required('El username es obligatorio'),
  password: Yup.string().required('La Clave es obligatoria'),
});

// Login Component
const LogInForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

  const initialCredentials = {
    username: '',
    password: '',
  };

  let navigate = useNavigate();
  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div>
        <img src={ZiriuzLogo} alt="ZiriuzLogoWithLeters" className="LoginForm-ZiriuzLogo" />
        <br></br>
      </div>
      <Formik
        initialValues={initialCredentials}
        validationSchema={loginSchema}
        onSubmit={async (values) => {
          try {
            await loginSchema.validate(values, { abortEarly: false });
            login(values.username, values.password)
              .then(async (response: AxiosResponse) => {
                if (response.status === 200) {
                  if (response.data.token) {
                    await sessionStorage.setItem('sessionJWTToken', response.data.token);
                     // Almacena el rol en el sessionStorage
                    await sessionStorage.setItem('userRoles', JSON.stringify([response.data.roleName]));
                      // Almacena el userId en el sessionStorage
                    await sessionStorage.setItem('userId', response.data.userId);
                    navigate('/home');
                  } else {
                    throw new Error('Error generating Login token');
                  }
                } else {
                  throw Error('Invalid Credentials');
                }
              })
              .catch((error: any) => {
                console.error(`[LOGIN ERROR]: Something went wrong: ${error}`);
                window.alert('Usuario y/o Clave incorrectos, por favor revise sus credenciales y vuelva a ingresarlas. Gracias!');
              });
          } catch (validationErrors) {
            if (validationErrors instanceof Yup.ValidationError) {
              const errorMessage = validationErrors.errors.join('\n');
              window.alert(errorMessage);
            }
          }
        }}
      >
        {({ values, touched, errors, isSubmitting, handleChange, handleBlur }) => (
          <div className="LoginForm-box">
            <Form className="LoginForm-form">
              <h2>Iniciar Sesión</h2>
              <div className="LoginForm-inputBox">
                <div className="UsernameFieldContainer">
                  <Field
                    className="LoginForm-Field"
                    id="username"
                    type="username"
                    name="username"
                    required
                  />
                  <span>Nombre de Usuario</span>
                  <i></i>
                  {errors.username && touched.username && <ErrorMessage name="username" component="div"></ErrorMessage>}
                </div>
              </div>
              <div className="LoginForm-inputBox">
                <div className="PasswordFieldContainer">
                  <Field
                    className="LoginForm-Field"
                    id="password"
                    type={showPassword ? 'text' : 'password'} // Cambiar el tipo de campo según el estado showPassword
                    name="password"
                    required
                  />
                  <span>Clave</span>
                  <i></i>
                  {errors.password && touched.password && <ErrorMessage name="password" component="div"></ErrorMessage>}
                </div>
                  <div className="PasswordFieldIcon" onClick={toggleShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </div>
              </div>
              <br></br>
              <div className="LoginForm-links">
                <a href="#" onClick={handleForgotPasswordClick}>
                  Restaurar Clave
                </a>
              </div>
              <br></br>
              <button className="LoginForm-button" type="submit" value="LogIn">
                LogIn
              </button>
              {isSubmitting ? <p>Ingresando...</p> : null}
              {error && <div className="LoginForm-error">{error}</div>}
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default LogInForm;
