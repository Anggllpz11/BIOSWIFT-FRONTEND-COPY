import React, { useEffect, useState } from "react";
import './styles/lateralmenudashboard.css';
import LogMemco from "./img/Memcotech.png";
import LogoSmall from "./img/Log.png";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useSessionStorage } from "../../hooks/useSessionStorage";

const DashboardMenuLateral = () => {
  const navigate = useNavigate();
  const userId = useSessionStorage('userId');

  const handleUserProfileClick = () => {
    if (userId) {
      navigate(`/users/${userId}`);
    }
  }

   const logout = () => {
    sessionStorage.removeItem('sessionJWTToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRoles');
    navigate('/login');
  };

  return (
    <div>
      <nav className="DashboardMenuLateral-main-menu">
        <ul className="DashboardMenuLateral-ul">
            <div className="DashboardMenuLateral-logo">
                <img id="logo-medium" src={LogoSmall}alt="" height="50px" width="50px"/>
                <img id= "logo-small" src={LogMemco} alt="" height="50px" width="100px"/>
            </div>
        <br />
        <li>
          <a href="#"  onClick={() => navigate('/home')}>
            <i className="DashboardMenuLateral-icon" >
              <HomeIcon/>
            </i>
            <span className="DashboardMenuLateral-nav-text">Panel</span>
          </a>  
        </li>

        <li>
          <a onClick={handleUserProfileClick} 
          href="#">
            <i className="DashboardMenuLateral-icon">
              <PersonIcon/>
               
            </i>
            <span 
            className="DashboardMenuLateral-nav-text"> Mi Pefil</span>
          </a>
        </li>

        <li>
          <a href="#">
            <i className="DashboardMenuLateral-icon">
              <NotificationsIcon/>
             
            </i>
            <span className="DashboardMenuLateral-nav-text">Notificaiones</span>
          </a>
        </li>

        <li>
          <a href="#">
            <i className="DashboardMenuLateral-icon">
              <LocationOnIcon/>
             
            </i>
            <span className="DashboardMenuLateral-nav-text">Ubicación</span>
          </a>
        </li>

        <li>
          <a href="#">
            <i className="DashboardMenuLateral-icon">
              <HelpCenterIcon/>
                  
            </i>
            <span className="DashboardMenuLateral-nav-text"> Inquietudes</span>
          </a>
        </li>

      </ul>

      <ul className="DashboardMenuLateral-logout">
        <li>
          <a href="#">
              <i className="DashboardMenuLateral-icon">
                  <SettingsIcon/>
                     
              </i>
            <span className="DashboardMenuLateral-nav-text">Configuración</span>
          </a>
        </li>

        <li>
          <a href="#"  onClick={logout}>
            <i className="DashboardMenuLateral-icon">
            <ExitToAppIcon/>
                
            </i>
            <span className="DashboardMenuLateral-nav-text">
            Cerra Sesión
            </span>
          </a>
        </li>  
      </ul>
    </nav>
  </div>

  ); 
};


export default DashboardMenuLateral;