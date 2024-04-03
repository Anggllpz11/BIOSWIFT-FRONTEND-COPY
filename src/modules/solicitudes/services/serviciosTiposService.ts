import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig } from 'axios';

export const getAllServiciosTipos = (token: string, limit?: number, page?: number) => {
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
    .get('/servicios', options)
    .then((response) => response.data.servicios) // Ajusta para obtener la propiedad "serviciosTipos" de la respuesta
    .catch((error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 500) {
          console.error('Error 500:', data);
          window.location.href = '/login';
        }
      } else {
        console.error('Error desconocido:', error);
        // Maneja otros errores aquí
      }
      throw error;
    });
};

export const getServicioTipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/servicios/${id}`, options)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 500) {
          window.location.href = '/login';
        }
      }
      throw error;
    });
};

export const createServicioTipo = (token: string, servicioTipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/servicios', servicioTipoData, options)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 500) {
          window.location.href = '/login';
        }
      }
      throw error;
    });
};

export const updateServicioTipo = (token: string, id: string, servicioTipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/servicios/${id}`, servicioTipoData, options)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 500) {
          window.location.href = '/login';
        }
      }
      throw error;
    });
};

export const deleteServicioTipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/servicios/${id}`, options)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 500) {
          window.location.href = '/login';
        }
      }
      throw error;
    });
};
