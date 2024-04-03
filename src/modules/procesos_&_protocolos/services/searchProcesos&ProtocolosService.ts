import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const searchPreventivosByKeyword = async (token: string, keyword: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  const requestBody = {
    keyword: keyword,
  };

  try {
    const response = await axios.post('/search/procesos&protocolos/preventivos', requestBody, options);
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


export const searchCamposByKeyword = async (token: string, keyword: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  const requestBody = {
    keyword: keyword,
  };

  try {
    const response = await axios.post('/search/procesos&protocolos/campos', requestBody, options);
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