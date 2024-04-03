import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';


const RegisterSuccessPage = ()=>{

    const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/users");
  };

    return(
        <div className="PassUpdateSuccessfullPage-box">
          <DashboardMenuLateral />
        <div>
            <form className="PassUpdateSuccessfullPage-form">
            <h2>Usuario Registrado Correctamente</h2>
            <br></br>
            <br></br>
            
            <br></br>
            <br></br>
            <button type='submit' className="PassUpdateSuccessfullPage-button" onClick={handleOnClick}>Volver</button>
            </form>
        </div>
    </div>
    ) 
}


export default RegisterSuccessPage;