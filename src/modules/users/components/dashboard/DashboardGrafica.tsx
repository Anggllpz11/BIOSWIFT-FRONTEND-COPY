import React from "react";
import './styles/DashboardGrafica.css';
import Grafica  from "./img/estadistica.png";
const DashboardGrafica = () => {
  return (
    <div>
        <nav className="DashboardGafica-nav">
            <div className="DashboardGafica-container">
            <h1 className="DashboardGafica-title">Flujo</h1>
                <div className="DashboardGafica-grafica">
                    <img src={Grafica} alt="" width="300px" height="200px" />
                </div>
            </div>
        </nav> 
    </div>
  ); 
};


export default DashboardGrafica;