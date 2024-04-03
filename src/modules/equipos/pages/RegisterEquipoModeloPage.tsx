import React from 'react';
import RegisterEquipoModeloForm from '../components/equiposModelos/forms/RegisterEquipoModeloForm';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';

const RegisterEquipoModeloPage: React.FC = () => {
  return (
    <div>
        <DashboardMenuLateral />
      <RegisterEquipoModeloForm />
    </div>
  );
};

export default RegisterEquipoModeloPage;
