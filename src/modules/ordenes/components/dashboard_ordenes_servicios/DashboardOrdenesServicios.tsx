import React from "react";
import { useNavigate } from 'react-router-dom';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
import useUserRoleVerifier from "../../hooks/useUserRoleVerifier";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

const DashboardOrdenesDeServicios = () => {
    const navigate = useNavigate();
    const isAdmin = useUserRoleVerifier(['administrador']);
    return (
    
                   
                        <ul className="DashboardMenuCentral-nav-ul">
                        {/* <h1 className='DashboardMenuCentral-title'> Equipos</h1> */}
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/ordenes')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>    
                                    <AssignmentIcon className='DashboardMenuCentral-icon'/>
                                    </i>
                                    <p className="DashboardMenuCentral-p">Ordenes de Servicio</p> 
                                    </div>
                                </li>
                            </button>
                            
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                        <i className='DashboardMenuCentral-nav-icon-i'> 
                                            {/* <img  alt=""width="40px" height="30px"/> */}
                                            <AssignmentTurnedInIcon className='DashboardMenuCentral-icon'/>       
                                        </i>
                                        <p className="DashboardMenuCentral-p">Ordenes Abiertas Preventivo</p>

                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-pendiente-preventivos')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                        <i className='DashboardMenuCentral-nav-icon-i'>
                                            {/* <img  alt="" width="40px" height="30px"/> */}
                                            <AssignmentTurnedInIcon className='DashboardMenuCentral-icon' />
                                            {/* <HelpOutlinedIcon className='DashboardMenuCentral-add-icon'/>                 */}

                                        </i>
                                        <p className="DashboardMenuCentral-p">Ordenes Abiertas CIG</p>
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-pendiente-cig')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>
                                        <AssignmentIcon className='DashboardMenuCentral-icon' />
                                        <DoDisturbOnIcon className='DashboardMenuCentral-closed-icon'/>    
                                    </i>
                                    <p className="DashboardMenuCentral-p">Ordenes Cerradas</p>  
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/solicitudes-servicios-abrobadas')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>
                                        {/* <img  alt="" width="40px" height="30px"/> */}
                                        <AssignmentLateIcon className='DashboardMenuCentral-icon'/>
                                    </i>
                                    <p className="DashboardMenuCentral-p">Cambios Ordenes</p>  
                                    </div>
                                </li>
                            </button>
                        </ul>
        
    ); 
};
  
  
  export default DashboardOrdenesDeServicios;