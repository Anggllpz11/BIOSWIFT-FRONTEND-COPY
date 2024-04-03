import React, { useEffect } from 'react';
import CreateSedeForm from '../components/sedes/forms/CreateSedeForm';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { logoutService } from '../services/authService';

const CreateSedePage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    if (!loggedIn) {
      logoutService(); // Utiliza la función de logoutService para manejar el cierre de sesión
    }
  }, [loggedIn]);

  return (
    <div>
      <DashboardMenuLateral />
      <CreateSedeForm />
    </div>
  );
};

export default CreateSedePage;
