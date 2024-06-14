import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllSolicitudesDadoBaja = (token: string, limit?: number, page?: number) => {
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
    .get('/solicitudes-dado-baja', options)
    .then((response) => response.data.solicitudesDadoBaja)
    .catch(handleError);
};

export const getSolicitudDadoBajaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/solicitudes-dado-baja/`, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const createSolicitudDadoBaja = (token: string, solicitudData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/solicitudes-dado-baja', solicitudData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const updateSolicitudDadoBaja = (token: string, id: string, solicitudData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/solicitudes-dado-baja?id=${id}`, solicitudData, options)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteSolicitudDadoBajaById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/solicitudes-dado-baja/`, options)
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
