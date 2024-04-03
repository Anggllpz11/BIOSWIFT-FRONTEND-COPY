import React from 'react';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import RegisterPreventivoForm from '../components/preventivos/forms/RegisterPreventivoForm';

const RegisterPreventivoPage: React.FC = () => {

    return (

        <div>
            <DashboardMenuLateral />
            <RegisterPreventivoForm />
        </div>
    )


}


export default RegisterPreventivoPage;