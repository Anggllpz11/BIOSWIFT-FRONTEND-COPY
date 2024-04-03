import React, { useState } from 'react';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import RegisterSolicitudServicioForm from '../components/solicitudes_servicios/forms/RegisterSolicitudServicioForm';

const RegisterEquipoModeloPage: React.FC = () => {
  const [showForm, setShowForm] = useState(true);

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <DashboardMenuLateral />
      {showForm && <RegisterSolicitudServicioForm onCancel={handleCancel} />}
    </div>
  );
};

export default RegisterEquipoModeloPage;
