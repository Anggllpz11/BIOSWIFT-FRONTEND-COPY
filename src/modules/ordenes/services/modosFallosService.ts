import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllModosFallos = (token: string, limit?: number, page?: number) => {
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
    .get('/modos-fallos', options)
    .then((response) => response.data.modosFallos) 
    .catch(handleError);
};

export const getModoFallosById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/modos-fallos/${id}`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createModoFallos = (token: string, modoFallosData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/modos-fallos', modoFallosData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateModoFallos = (token: string, id: string, modoFallosData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/modos-fallos?id=${id}`, modoFallosData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteModoFallosById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/modos-fallos/${id}`, options)
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
