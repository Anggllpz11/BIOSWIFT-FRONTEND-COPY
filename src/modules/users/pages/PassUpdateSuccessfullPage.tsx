import React from "react";
import { useNavigate } from "react-router-dom";
import './styles/PassUpdateSuccessfull.css'
const PassUpdateSuccessfullPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="PassUpdateSuccessfullPage-box">
        <div>
            <form className="PassUpdateSuccessfullPage-form">
            <h2>¡Genial! Tu Clave fue actualizada correctamente.</h2>
            <br></br>
            <br></br>
            <p className="PassUpdateSuccessfullPage-p">Por favor, vuelve a iniciar sesión:</p>
            <br></br>
            <br></br>
            <button type='submit' className="PassUpdateSuccessfullPage-button" onClick={handleLoginClick}>Login</button>
            </form>
        </div>
    </div>
  );
};

export default PassUpdateSuccessfullPage;
