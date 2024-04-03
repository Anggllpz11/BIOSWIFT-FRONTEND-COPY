import React from 'react';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import RegisterTipoEquipoForm from '../components/tiposEquipos/forms/RegisterTipoEquipoForm';

const RegisterTipoEquipoPage: React.FC = () => {

    return (

        <div>
            <DashboardMenuLateral />
            <RegisterTipoEquipoForm/>
        </div>
    )


}


export default RegisterTipoEquipoPage;