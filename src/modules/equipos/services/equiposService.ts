import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const getAllEquipos = (token: string, limit?: number, page?: number) => {
  const options = {
    headers: {
      'x-access-token': token,
    },
    params: {
      limit,
      page,
    },
  };

  return axios
    .get('/equipos', options)
    .then((response) => response.data.equipos) // Ajusta para obtener la propiedad "equipos" de la respuesta
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

// Resto del código...

  
  export const getEquipoById = (token: string, id: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
      params: {
        id,
      },
    };
  
    return axios
      .get(`/equipos/`, options)
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
  
  export const createEquipo = (token: string, equipoData: any) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
    };
  
    return axios
      .post('/equipos', equipoData, options)
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
  
  export const updateEquipo = (token: string, id: string, equipoData: any) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
      
    };
  
    return axios
      .put(`/equipos?id=${id}`, equipoData, options)
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
  
  export const deleteEquipoById = (token: string, id: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
      params: {
        id,
      },
    };
  
    return axios
      .delete(`/equipos/`, options)
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