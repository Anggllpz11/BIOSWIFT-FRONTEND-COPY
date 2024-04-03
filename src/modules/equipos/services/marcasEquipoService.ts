import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

// Obtener todas las marcas de equipos
export const getAllMarcasEquipos = (token: string, limit?: number, page?: number) => {
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
    .get('/equipos/marcas', options)
    .then((response) => response.data.marcasEquipos)
    .catch((error) => handleError(error));
};

// Obtener una marca de equipo por ID
export const getMarcaEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/equipos/marcas/`, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Crear una nueva marca de equipo
export const createMarcaEquipo = (token: string, marcaEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/equipos/marcas', marcaEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Actualizar una marca de equipo por ID
export const updateMarcaEquipo = (token: string, id: string, marcaEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/equipos/marcas?id=${id}`, marcaEquipoData, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

// Eliminar una marca de equipo por ID
export const deleteMarcaEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/equipos/marcas/`, options)
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
    // Maneja otros errores aquí
  }
  throw error;
};
