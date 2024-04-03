import react from 'react';
import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
// Función para manejar errores comunes
const handleCommonErrors = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 500) {
      // Token inválido o expirado
      // Redirigir al usuario a la página de inicio de sesión (/login)
      window.location.href = '/login';
      window.alert('Sesión expirada, vuelva a iniciar sesión')
    }
  }
  throw error;
};

export const getAllSedes = (token: string, limit?: number, page?: number) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      limit: limit,
      page: page,
    },
  };

  return axios
    .get('/sedes', options)
    .catch((error) => handleCommonErrors(error));
};

export const getSedeById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    }
  };

  return axios
    .get(`/sedes/`, options)
    .catch((error) => handleCommonErrors(error));
};

export const createSede = (token: string, sedeData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/sedes', sedeData, options)
    .then((response) => {
      // Retornar la respuesta en lugar de manejarla aquí
      return response.data;
    })
    .catch((error) => {
      handleCommonErrors(error);
      throw error;
    });
};

export const updateSedeById = (token: string, id: string, sedeData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/sedes?id=${id}`, sedeData, options)
    .catch((error) => handleCommonErrors(error));
};

export const deleteSedeById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .delete(`/sedes?id=${id}`, options)
    .catch((error) => handleCommonErrors(error));
};


export const searchSedesByKeyword = (token: string, keyword: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
    };
  
    const requestBody = {
      keyword: keyword,
    };
  
    return axios
      .post('/search/sedes', requestBody, options)
      .then((response: AxiosResponse) => response.data)
      .catch((error) => {
        if (error.response) {
          const { status } = error.response;
          if (status === 500) {
            // Token inválido o expirado
            // Redirigir al usuario a la página de inicio de sesión (/login)
            window.location.href = '/login';
          }
        }
        throw error;
      });
  };

