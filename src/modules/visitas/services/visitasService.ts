import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllVisitas = (token: string, limit?: number, page?: number) => {
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
    .get('/visitas', options)
    .then((response) => response.data.visitas)
    .catch(handleError);
};

export const getVisitaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/visitas/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createVisita = (token: string, visitaData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/visitas', visitaData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateVisita = (token: string, id: string, visitaData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/visitas?id=${id}`, visitaData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteVisitaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/visitas/`, options)
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

export const getPresignedUrl = (token: string, fileName: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      fileName,
    },
  };

  return axios
    .get('/visitas/generate-presigned-url', options)
    .then((response) => response.data)
    .catch(handleError);
};

export const getPresignedUrlForGet = (token: string, objectKey: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      key: objectKey, 
    },
  };

  return axios
    .get('/visitas/generate-presigned-url-get', options)
    .then((response) => response.data)
    .catch(handleError);
};