import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

// Obtener todas las áreas de equipos
export const getAllAreasEquipos = (token: string, limit?: number, page?: number) => {
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
    .get('/equipos/areas', options)
    .then((response) => response.data.areasEquipos)
    .catch((error) => handleError(error));
};

// Obtener un área de equipo por ID
export const getAreaEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/equipos/areas/`, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Crear una nueva área de equipo
export const createAreaEquipo = (token: string, areaEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/equipos/areas', areaEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Actualizar un área de equipo por ID
export const updateAreaEquipo = (token: string, id: string, areaEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/equipos/areas?id=${id}`, areaEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Eliminar un área de equipo por ID
export const deleteAreaEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/equipos/areas/`, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Manejar errores
const handleError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 500) {
      console.error(`Error 500: ${data}`);
      window.alert('ERROR: No puedes hacer esto')

    }
  } else {
    console.error('Error desconocido:', error);
    window.alert('ERROR: No puedes hacer esto')
  }
  throw error;
};
