import React from "react";
import { useNavigate } from 'react-router-dom';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
import ContentPasteOffOutlinedIcon from '@mui/icons-material/ContentPasteOffOutlined';
import useUserRoleVerifier from "../../hooks/useUserRoleVerifier";

const DashboardSolicitudesDeServicios = () => {
    const navigate = useNavigate();
    const isAdmin = useUserRoleVerifier(['administrador']);
    return (
    
                   
                        <ul className="DashboardMenuCentral-nav-ul">
                        {/* <h1 className='DashboardMenuCentral-title'> Equipos</h1> */}
                        {isAdmin && (
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-register')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>    
                                    <ContentPasteOutlinedIcon className='DashboardMenuCentral-icon'/>
                                    <AddCircleOutlinedIcon className='DashboardMenuCentral-add-icon'/>                
                                    </i>
                                    <p className="DashboardMenuCentral-p">Nueva Solicitud</p> 
                                    </div>
                                </li>
                            </button>
                        )}
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                        <i className='DashboardMenuCentral-nav-icon-i'> 
                                            {/* <img  alt=""width="40px" height="30px"/> */}
                                            <ContentPasteSearchOutlinedIcon className='DashboardMenuCentral-icon'/>       
                                        </i>
                                        <p className="DashboardMenuCentral-p">Solicitudes</p>

                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-pendiente-preventivos')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                        <i className='DashboardMenuCentral-nav-icon-i'>
                                            {/* <img  alt="" width="40px" height="30px"/> */}
                                            <ContentPasteOutlinedIcon className='DashboardMenuCentral-icon' />
                                            <HelpOutlinedIcon className='DashboardMenuCentral-add-icon'/>                

                                        </i>
                                        <p className="DashboardMenuCentral-p">Solicitudes Pendientes Preventivo</p>
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-pendiente-cig')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>
                                        <ContentPasteOutlinedIcon className='DashboardMenuCentral-icon' />
                                        <HelpOutlinedIcon className='DashboardMenuCentral-add-icon'/>    
                                    </i>
                                    <p className="DashboardMenuCentral-p">Solicitudes Pendientes CIG</p>  
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-abrobadas')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>
                                        {/* <img  alt="" width="40px" height="30px"/> */}
                                        <ContentPasteGoOutlinedIcon className='DashboardMenuCentral-icon'/>
                                    </i>
                                    <p className="DashboardMenuCentral-p"> Solicitudes Aprobadas </p>  
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-rechazadas')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>
                                        {/* <img  alt="" width="40px" height="30px"/> */}
                                        <ContentPasteOffOutlinedIcon className='DashboardMenuCentral-icon'/>
                                    </i>
                                    <p className="DashboardMenuCentral-p">Solicitudes Rechazadas</p>  
                                    </div>
                                </li>
                            </button>
                        </ul>
        
    ); 
};
  
  
  export default DashboardSolicitudesDeServicios;