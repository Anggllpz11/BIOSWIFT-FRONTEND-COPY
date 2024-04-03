import React, { useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { Dashboard } from '../components/dashboard/Dashboard';
import { logoutService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')// Utiliza la función de logoutService para manejar el cierre de sesión
    }
  }, [loggedIn]);

  return (
    <div>
      <Dashboard />
      {/* Resto del contenido del HomePage */}
    </div>
  );
};
