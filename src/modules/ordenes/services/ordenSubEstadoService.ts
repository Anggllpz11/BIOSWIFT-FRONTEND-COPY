import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllOrdenesSubEstado = (token: string, limit?: number, page?: number) => {
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
    .get('/ordenes-sub-estados', options)
    .then((response) => response.data.ordenesSubEstados)
    .catch(handleError);
};

export const getOrdenSubEstadoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/ordenes-sub-estados/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createOrdenSubEstado = (token: string, ordenSubEstadoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/ordenes-sub-estados', ordenSubEstadoData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateOrdenSubEstado = (token: string, id: string, ordenSubEstadoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/ordenes-sub-estados?id=${id}`, ordenSubEstadoData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteOrdenSubEstadoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/ordenes-sub-estados/`, options)
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
