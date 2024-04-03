import  { AxiosRequestConfig } from 'axios';
import { AxiosResponse, AxiosError } from 'axios';
import axios from '../../../utils/config/axios.config'; // Importamos nuestra instancia de Axios configurada

export const getAllClients = (token: string, limit?: number, page?: number) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      limit,
      page,
    },
  };

  return axios.get('/clients', options).catch((error) => {
    // Manejar el error de la solicitud
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

export const getClientById = (token: string, id: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
    params: {
      id,
    },
  };

  return axios.get('/clients/', options).catch((error) => {
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

export const createClient = (token: string, clientData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios.post('/clients', clientData, options).catch((error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 500) {
        window.location.href = '/login';
      }
    }
    throw error;
  });
};

export const updateClientById = (token: string, id: string, clientData: any) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  return axios.put(`/clients?id=${id}`, clientData, options).catch((error) => {
    if (error.response) {
      window.location.href = '/login';
      console.error(error.response);
    }
    throw error;
  });
};

  export const deleteClientById = (token: string, id: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
      params: {
        id,
      },
    };
  
    return axios.delete('/clients/', options)
      .catch((error) => {
        if (error.response) {
          const { status } = error.response;
          if (status === 500) {
            window.location.href = '/login';
          }
          throw error;
        }
      });
  };

  export const searchClientByKeyword = async (token: string, keyword: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
    };
  
    const requestBody = {
      keyword: keyword,
    };
  
    try {
      const response = await axios.post('/search/clients', requestBody, options);
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
  
  
