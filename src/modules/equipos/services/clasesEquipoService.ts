import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

// Obtener todas las clases de equipos
export const getAllClasesEquipos = (token: string, limit?: number, page?: number) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      limit,
      page,
    },
  };

  return axios
    .get('/equipos/clases', options)
    .then((response) => response.data.clasesEquipos)
    .catch((error) => handleError(error));
};

// Obtener una clase de equipo por ID
export const getClaseEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/equipos/clases/`, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Crear una nueva clase de equipo
export const createClaseEquipo = (token: string, claseEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/equipos/clases', claseEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Actualizar una clase de equipo por ID
export const updateClaseEquipo = (token: string, id: string, claseEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/equipos/clases?id=${id}`, claseEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Eliminar una clase de equipo por ID
export const deleteClaseEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/equipos/clases/`, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Manejar errores
const handleError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 500) {
      console.error(`Error 500: ${data}`);
      window.alert('ERROR: No puedes hacer esto');
    }
  } else {
    console.error('Error desconocido:', error);
    window.alert('ERROR: No puedes hacer esto');
  }
  throw error;
};
