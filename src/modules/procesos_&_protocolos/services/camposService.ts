import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllCampos = (token: string, limit?: number, page?: number) => {
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
    .get('/campos', options)
    .then((response) => response.data.campos)
    .catch((error) => handleRequestError(error));
};

export const getCamposById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/campos/`, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

export const createCampos = (token: string, camposData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/campos', camposData, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

export const updateCampos = (token: string, id: string, camposData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/campos?id=${id}`, camposData, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

export const deleteCamposById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/campos/`, options)
    .then((response) => response.data)
    .catch((error) => handleRequestError(error));
};

const handleRequestError = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 500) {
      // window.location.href = '/login';
      console.log(error.message);
    }
  }
  throw error;
};
