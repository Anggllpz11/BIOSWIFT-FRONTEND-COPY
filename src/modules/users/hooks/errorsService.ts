// useAxiosErrorHandler.ts

import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxiosErrorHandler = () => {
  const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response && error.response.status === 500) {
        // El servidor respondió con un estado 500 (Internal Server Error).
        // Redirige al usuario al inicio de sesión.
        navigate('/login');
      }
      // Puedes manejar otros errores aquí si es necesario.
      return Promise.reject(error);
    }
  );
};

export default useAxiosErrorHandler;

