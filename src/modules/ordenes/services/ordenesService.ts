import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllOrdenes = (token: string, limit?: number, page?: number) => {
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
    .get('/ordenes', options)
    .then((response) => response.data.ordenes) // Ajusta para obtener la propiedad "ordenes" de la respuesta
    .catch(handleError);
};

export const getOrdenById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/ordenes/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createOrden = (token: string, ordenData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/ordenes', ordenData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateOrden = (token: string, id: string, ordenData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/ordenes?id=${id}`, ordenData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteOrdenById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/ordenes/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

// Función para manejar errores de las respuestas axios
const handleError = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 500) {
      // window.location.href = '/login';
      console.log(error);
    }
  }
  throw error;
};
