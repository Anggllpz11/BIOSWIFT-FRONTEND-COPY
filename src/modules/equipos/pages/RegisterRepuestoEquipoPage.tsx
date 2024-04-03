import React from 'react';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import RegisterRepuestoEquipoForm from '../components/RepuestosEquipos/forms/RegisterRepuestoEquipoForm';

const RegisterRepuestoEquipoPage: React.FC = () => {

    return (

        <div>
            <DashboardMenuLateral />
            <RegisterRepuestoEquipoForm/>
        </div>
    )


}


export default RegisterRepuestoEquipoPage;