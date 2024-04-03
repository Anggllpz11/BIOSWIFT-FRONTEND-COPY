import axios from '../../../utils/config/axios.config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const searchEquiposByKeyword = async (token: string, keyword: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  const requestBody = {
    keyword: keyword,
  };

  try {
    const response = await axios.post('/search/equipos', requestBody, options);
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

export const searchModelosEquiposByKeyword = async (token: string, keyword: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
    }
      const requestBody = {
        keyword: keyword,
      };
    
      try {
        const response = await axios.post('/search/equipos/modelos', requestBody, options);
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

    export const searchAreasEquiposByKeyword = async (token: string, keyword: string) => {
        const options: AxiosRequestConfig = {
          headers: {
            'x-access-token': token,
          },
        }
          const requestBody = {
            keyword: keyword,
          };
        
          try {
            const response = await axios.post('/search/equipos/areas', requestBody, options);
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


export const searchClasesEquiposByKeyword = async (token: string, keyword: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
    }
      const requestBody = {
        keyword: keyword,
      };
    
      try {
        const response = await axios.post('/search/equipos/clases', requestBody, options);
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


export const searchMarcasEquiposByKeyword = async (token: string, keyword: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
    }
      const requestBody = {
            keyword: keyword,
          };
        
          try {
            const response = await axios.post('/search/equipos/marcas', requestBody, options);
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

export const searchTiposEquiposByKeyword = async (token: string, keyword: string) => {
    const options: AxiosRequestConfig = {
      headers: {
        'x-access-token': token,
      },
    }
      const requestBody = {
            keyword: keyword,
          };
        
          try {
            const response = await axios.post('/search/equipos/tipos', requestBody, options);
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


export const searchRepuestosEquiposByKeyword = async (token: string, keyword: string) => {
  const options: AxiosRequestConfig = {
    headers: {
      'x-access-token': token,
    },
  };

  const requestBody = {
    keyword: keyword,
  };

  try {
    const response = await axios.post('/search/equipos/repuestos', requestBody, options);
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