// cotizacionesService.ts

import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllCotizaciones = (token: string, limit?: number, page?: number) => {
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
    .get('/cotizaciones', options)
    .then((response) => response.data.cotizaciones) // Ajusta para obtener la propiedad correcta de la respuesta
    .catch(handleError);
};

export const getCotizacionById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/cotizaciones/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createCotizacion = (token: string, cotizacionData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/cotizaciones', cotizacionData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateCotizacion = (token: string, id: string, cotizacionData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/cotizaciones?id=${id}`, cotizacionData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteCotizacionById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/cotizaciones/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const getPresignedUrlForFirma = (token: string, fileName?: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      fileName, // Se incluye el nombre del archivo como un parámetro opcional
    },
  };

  return axios
    .get('/cotizaciones/generate-presigned-url-for-firma', options)
    .then((response) => response.data) // Asume que la respuesta contiene un campo 'url' con la URL firmada
    .catch(handleError);
};

export const getPresignedUrlForGetFirma = (token: string, objectKey: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      key: objectKey, 
    },
  };

  return axios
    .get('/cotizaciones/generate-presigned-url-get', options)
    .then((response) => response.data)
    .catch(handleError);
};

export const sendCotizacionEmail = async (token: string, emailDetails: { emails: string; subject: string; file: File }) => {
  const formData = new FormData();
  formData.append("emails", emailDetails.emails);
  formData.append("subject", emailDetails.subject);
  formData.append("file", emailDetails.file);

  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data'
    },
    timeout: 30000,
  };

  return axios
    .post('/cotizaciones/email-pdf', formData, options)
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
