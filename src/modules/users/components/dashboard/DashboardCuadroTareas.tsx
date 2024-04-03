import React from "react";
import './styles/DashboardCuadroTareas.css';

const DashboarCuadroTareas = () => {
  const notificationsList = document.getElementById("notifications-list");

  if (notificationsList) {
    notificationsList.innerHTML = "";

    setTimeout(() => {
      const notifications: string[] = ["Tarea 1", "Tarea 2", "Tarea 3", "Tarea 4", "Tarea 5"];

      notifications.forEach((notification) => {
        const li = document.createElement("li");
        li.className = "DashboarCuadroTareas-notification-item";
        li.textContent = notification;
        if (notificationsList) {
          notificationsList.appendChild(li);
        }
      });
    }, 1000);
  }

  return (
    <section className="DashboarCuadroTareas-Primary">
      <div className="DashboarCuadroTareas-Conternedor">
        <h2 className="DashboarCuadroTareas-Titulo">Pendientes</h2>
        <ul className="DashboarCuadroTareas-Lista">
          <li >Pendiente 1</li>
          <br />
          <li>Pendiente 2</li>
          <br />
          <li>Pendiente 3</li>
        </ul>
      </div>
    </section>
  );
};

export default DashboarCuadroTareas;