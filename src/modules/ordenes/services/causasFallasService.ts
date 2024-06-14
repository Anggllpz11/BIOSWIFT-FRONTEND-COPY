import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllCausasFallas = (token: string, limit?: number, page?: number) => {
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
    .get('/fallas-causas', options)
    .then((response) => response.data.fallasCausas) 
    .catch(handleError);
};

export const getCausaFallasById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/fallas-causas/${id}`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createCausaFallas = (token: string, causaFallasData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/fallas-causas', causaFallasData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateCausaFallas = (token: string, id: string, causaFallasData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/fallas-causas?id=${id}`, causaFallasData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteCausaFallasById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/fallas-causas/${id}`, options)
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
