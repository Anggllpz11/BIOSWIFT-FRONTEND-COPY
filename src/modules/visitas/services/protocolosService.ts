import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllProtocolos = (token: string, limit?: number, page?: number) => {
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
    .get('/protocolos', options)
    .then((response) => response.data.protocolos)
    .catch(handleError);
};

export const getProtocoloById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/protocolos/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createProtocolo = (token: string, protocoloData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/protocolos', protocoloData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateProtocolo = (token: string, id: string, protocoloData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/protocolos?id=${id}`, protocoloData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteProtocoloById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/protocolos/`, options)
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
