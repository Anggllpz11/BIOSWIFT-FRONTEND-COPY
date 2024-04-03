import React from "react";
import DashboardMenuLateral from './DashboardMenulateral';
import DashboardMenuCentral from "./DashboardMenuCentral";
import './styles/Dashboard.css';
import DashboardCuadroTareas from "./DashboardCuadroTareas";
import DashboardGrafica from "./DashboardGrafica";

export const Dashboard = () => {
  return (
    <div className="DashboardStyles">
       {/* Menu Lateral */}
      <section className="MenuLateral">
      <DashboardMenuLateral />
      </section>
      {/* Menu central */}
      <section className="MenuCentral" >
      <DashboardMenuCentral/>
      </section>
       {/* Cuadros */}
      <div className="DashboardStylesCuadros">
         {/* Tareas */}
        <section className="CuadroTareas">
          {/* <DashboardCuadroTareas /> */}
        </section>
         {/* Grafica*/}
        <section className="Grafica">
          
          {/* <DashboardGrafica /> */}

        </section>
      </div>
      
    </div>
  ); 
};
