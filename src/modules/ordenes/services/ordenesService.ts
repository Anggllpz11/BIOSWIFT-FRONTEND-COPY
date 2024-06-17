import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

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
    .then((response) => response.data)
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


export const searchOrdenesByKeyword = async (token: string, keyword: string, limit: number = 10, page: number = 1) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  const requestBody = {
    keyword,
    limit,
    page,
  };

  try {
    const response = await axios.post('/search/ordenes', requestBody, options);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status } = error.response as AxiosResponse;
      if (status === 500) {
        // Token inválido o expirado
        // Redirigir al usuario a la página de inicio de sesión (/login)
        window.location.href = '/login';
      }
    }
    throw error;
  }
};

export const filterAdvancedOrdenes = async (token: string, filtersArray: any[], limit: number = 10, page: number = 1) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      limit,
      page,
    },
  };

  try {
    const response = await axios.post('/advanced-filters-ordenes', filtersArray, options);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status } = error.response as AxiosResponse;
      if (status === 500) {
        // Token inválido o expirado
        // Redirigir al usuario a la página de inicio de sesión (/login)
        window.location.href = '/login';
      }
    }
    throw error;
  }
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
