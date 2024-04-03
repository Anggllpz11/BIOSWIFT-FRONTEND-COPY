import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const getAllRepuestosEquipos = (token: string, limit?: number, page?: number) => {
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
    .get('/equipos/repuestos', options)
    .then((response) => response.data.repuestoEquipos) // Ajusta para obtener la propiedad "repuestoEquipos" de la respuesta
    .catch((error) => {
      handleRequestError(error);
    });
};

export const getRepuestoEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .get(`/equipos/repuestos`, options)
    .then((response) => response.data)
    .catch((error) => {
      handleRequestError(error);
    });
};

export const createRepuestoEquipo = (token: string, repuestoEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .post('/equipos/repuestos', repuestoEquipoData, options)
    .then((response) => response.data)
    .catch((error) => {
      handleRequestError(error);
    });
};

export const updateRepuestoEquipo = (token: string, id: string, repuestoEquipoData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios
    .put(`/equipos/repuestos?id=${id}`, repuestoEquipoData, options)
    .then((response) => response.data)
    .catch((error) => {
      handleRequestError(error);
    });
};

export const deleteRepuestoEquipoById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios
    .delete(`/equipos/repuestos`, options)
    .then((response) => response.data)
    .catch((error) => {
      handleRequestError(error);
    });
};

const handleRequestError = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 500) {
      window.location.href = '/login';
    }
  } else {
    // Maneja otros errores aquí
    throw error;
  }
};
