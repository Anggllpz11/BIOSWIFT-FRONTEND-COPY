import React from 'react';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import RegisterMarcaEquipoForm from '../components/marcasEquipos/forms/RegisterMarcaEquipoForm';

const RegisterMarcaEquipoPage: React.FC = () => {

    return (

        <div>
            <DashboardMenuLateral />
            <RegisterMarcaEquipoForm/>
        </div>
    )


}


export default RegisterMarcaEquipoPage;