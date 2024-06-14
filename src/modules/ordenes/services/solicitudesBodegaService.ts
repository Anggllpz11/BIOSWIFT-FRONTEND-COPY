import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllSolicitudesBodega = (token: string, limit?: number, page?: number) => {
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
   .get('/solicitudes-bodega', options)
   .then((response) => response.data.solicitudesBodega) 
   .catch(handleError);
};

export const getSolicitudBodegaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
   .get(`/solicitudes-bodega/`, options)
   .then((response) => response.data)
   .catch(handleError);
};

export const createSolicitudBodega = (token: string, solicitudData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
   .post('/solicitudes-bodega', solicitudData, options)
   .then((response) => response.data)
   .catch(handleError);
};

export const updateSolicitudBodega = (token: string, id: string, solicitudData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
   .put(`/solicitudes-bodega?id=${id}`, solicitudData, options)
   .then((response) => response.data)
   .catch(handleError);
};

export const deleteSolicitudBodegaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
   .delete(`/solicitudes-bodega/`, options)
   .then((response) => response.data)
   .catch(handleError);
};

// Function to handle errors from axios responses
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