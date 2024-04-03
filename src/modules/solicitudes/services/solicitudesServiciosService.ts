import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllSolicitudesServicios = (token: string, limit?: number, page?: number) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      limit,
      page,
    },
  };

  return axios.get('/solicitudes-servicios', options).catch(handleError);
};

export const getSolicitudServicioById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/solicitudes-servicios/`, options)
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

export const createSolicitudServicio = (token: string, solicitudServicioData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios.post('/solicitudes-servicios', solicitudServicioData, options).catch(handleError);
};

export const updateSolicitudServicio = (token: string, id: string, solicitudServicioData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios.put(`/solicitudes-servicios?id=${id}`, solicitudServicioData, options).catch(handleError);
};

export const deleteSolicitudServicio = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios.delete('/solicitudes-servicios', options).catch(handleError);
};

const handleError = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 500) {
      // Token inválido o expirado
      // Redirigir al usuario a la página de inicio de sesión (/login)
      console.log(error.response);
    }
  }
  throw error;
};
