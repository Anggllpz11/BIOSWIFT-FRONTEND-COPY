import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllPreventivos = (token: string, limit?: number, page?: number) => {
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
    .get('/preventivos', options)
    .then((response) => response.data.preventivos)
    .catch((error) => handleRequestError(error));
};

export const getPreventivoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/preventivos/`, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

export const createPreventivo = (token: string, preventivoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/preventivos', preventivoData, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

export const updatePreventivo = (token: string, id: string, preventivoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/preventivos?id=${id}`, preventivoData, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

export const deletePreventivoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/preventivos/`, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

const handleRequestError = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 500) {
      window.location.href = '/login';
    }
  }
  throw error;
};
