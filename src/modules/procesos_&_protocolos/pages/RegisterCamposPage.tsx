import React from 'react';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import RegisterPreventivoForm from '../components/preventivos/forms/RegisterPreventivoForm';
import RegisterCampoForm from '../components/campos/forms/RegisterCampoForm';

const RegisterCamposPage: React.FC = () => {

    return (

        <div>
            <DashboardMenuLateral />
            <RegisterCampoForm />
        </div>
    )


}


export default RegisterCamposPage;