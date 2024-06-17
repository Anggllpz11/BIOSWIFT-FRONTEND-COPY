import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllFallosSistemas = (token: string, limit?: number, page?: number) => {
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
    .get('/fallo-sistemas', options)
    .then((response) => response.data.falloSistemas) 
    .catch(handleError);
};

export const getFalloSistemaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/fallo-sistemas/${id}`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createFalloSistema = (token: string, falloSistemaData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/fallo-sistemas', falloSistemaData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateFalloSistema = (token: string, id: string, falloSistemaData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/fallo-sistemas?id=${id}`, falloSistemaData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteFalloSistemaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/fallo-sistemas/${id}`, options)
    .then((response) => response.data)
    .catch(handleError);
};

// Función para manejar errores de las respuestas axios
const handleError = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 500) {
      console.log(error);
    }
  }
  throw error;
};
