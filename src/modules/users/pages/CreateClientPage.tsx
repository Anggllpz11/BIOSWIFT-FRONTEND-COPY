import React, { useEffect } from 'react';
import CreateClientForm from '../components/clients/forms/CreateClientForm'; // Asegúrate de importar el formulario de cliente correcto
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { logoutService } from '../services/authService';

const CreateClientPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');

  useEffect(() => {
    if (!loggedIn) {
      logoutService(); // Utiliza la función de logoutService para manejar el cierre de sesión
    }
  }, [loggedIn]);

  return (
    <div>
      <DashboardMenuLateral />
      <CreateClientForm />
    </div>
  );
};

export default CreateClientPage;
