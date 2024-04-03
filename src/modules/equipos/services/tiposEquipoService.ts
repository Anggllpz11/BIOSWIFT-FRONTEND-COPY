import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

// Obtener todos los tipos de equipos
export const getAllTiposEquipos = (token: string, limit?: number, page?: number) => {
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
    .get('/equipos/tipos', options)
    .then((response) => response.data.tiposEquipos)
    .catch((error) => handleError(error));
};

// Obtener un tipo de equipo por ID
export const getTipoEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/equipos/tipos/`, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Crear un nuevo tipo de equipo
export const createTipoEquipo = (token: string, tipoEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/equipos/tipos', tipoEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Actualizar un tipo de equipo por ID
export const updateTipoEquipo = (token: string, id: string, tipoEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/equipos/tipos?id=${id}`, tipoEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Eliminar un tipo de equipo por ID
export const deleteTipoEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/equipos/tipos/`, options)
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
