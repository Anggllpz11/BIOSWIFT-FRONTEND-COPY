import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllMunicipios = (token: string, limit?: number, page?: number) => {
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
    .get('/municipios', options)
    .then((response) => response.data.municipios) // Ajusta para obtener la propiedad "municipios" de la respuesta
    .catch(handleError);
};

export const getMunicipioById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/municipios/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createMunicipio = (token: string, municipioData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/municipios', municipioData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createMultipleMunicipios = (token: string, municipiosData: any[]) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/municipios/multiple', municipiosData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateMunicipio = (token: string, id: string, municipioData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/municipios?id=${id}`, municipioData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteMunicipioById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/municipios/`, options)
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
