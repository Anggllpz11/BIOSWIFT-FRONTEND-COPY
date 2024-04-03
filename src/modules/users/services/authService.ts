
import axios from '../../../utils/config/axios.config';

/***
 * 
 * @param {string} username to login
 * @param {string} password to log in
 */
export const login = (username: string, password: string)=>{
    
    // Declare Body to POST
    let body = {
        username: username, 
        password: password
    }
    

    // Send POST request to login endpoint
    // https://localhost:8080/api/auth/login
    return axios.post('/auth/login', body)
}   

export const logoutService = () =>{
  sessionStorage.removeItem('sessionJWTToken');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userRoles');
  window.location.href = '/login';
 
}


/***
 * 
 * @param {number} number to register 
 * @param {string} username to register
 * @param {string} password to register
 * @param {string} name to register
 * @param {number} cedula to register 
 * @param {string} telefono to register
 * @param {string} email to register
 * @param {string} more_info to register
 */

export const register = (
  number: number,
  username: string,
  password: string,
  name: string,
  cedula: number,
  telefono: string,
  email: string,
  more_info: string,
  roles: { name: string }[],
  type?: string, // Campo opcional: type
  titulo?: string, // Campo opcional: titulo
  reg_invima?: string // Campo opcional: reg_invima
) => {
  // Declarar un tipo explícito para additionalFields
  const additionalFields: Record<string, string> = {};

  if (type) {
    additionalFields.type = type;
  }
  if (titulo) {
    additionalFields.titulo = titulo;
  }
  if (reg_invima) {
    additionalFields.reg_invima = reg_invima;
  }

  // Combinar los campos adicionales con el resto de la solicitud
  const body = {
    number: number,
    username: username,
    password: password,
    name: name,
    cedula: cedula,
    telefono: telefono,
    email: email,
    more_info: more_info,
    roles: roles,
    ...additionalFields, // Agregar los campos adicionales al objeto body
  };

  // Enviar POST request al endpoint de registro
  return axios.post('/auth/register', body).catch((error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 500) {
        // Token inválido o expirado
        // Redirigir al usuario a la página de inicio de sesión (/login)
        window.location.href = '/login';
        window.alert("An error ocurred while registering new user")
      }
    }
    throw error;
  });
};



export const forgotPassword = (email: string) => {

    let body = {
        email: email
    }
    return axios.post('/auth/forgot-password', body )
}

export const validateOTP = (email: string, otp: string) => {
    let body = {
      email: email,
      otp: otp,
    };
    return axios.post('/auth/otp-validator', body);
  }
  


  export const updatePassword = (email: string, newPassword: string) => {
    const body = {
      email: email,
      newPassword: newPassword
    };
    return axios.put('/auth/update-password', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };



