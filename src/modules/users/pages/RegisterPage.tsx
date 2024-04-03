import React, { useEffect } from 'react';
import RegisterUserForm from '../components/forms/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import './styles/RegisterPage.css';
import useUserRoleVerifier from '../hooks/useUserRoleVerifier';
import { logoutService } from '../services/authService';

export const RegisterPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn ) {
      logoutService(); 
    }
  }, [loggedIn]);

  return (
    <div>
      <div className='RegisterPage-DashboardMenuLateral'>
        <DashboardMenuLateral />
      </div>
      <div className='RegisterPage-container'>
        <RegisterUserForm />
      </div>
    </div>
  );
};
