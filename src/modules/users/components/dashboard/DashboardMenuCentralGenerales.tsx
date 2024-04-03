import React from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShieldIcon from '@mui/icons-material/Shield';

const DashboardMenuCentralGenerales = () => {
    const navigate = useNavigate();

    return (
                        <ul className="DashboardMenuCentral-nav-ul">
                        {/* <h1 className='DashboardMenuCentral-title'> Generales</h1> */}
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/users')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>    
                                    <PersonIcon className='DashboardMenuCentral-icon'/>                
                                    </i>
                                    <p className="DashboardMenuCentral-p">Usuarios</p> 
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/sedes')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                        <i className='DashboardMenuCentral-nav-icon-i'> 
                                            {/* <img  alt=""width="40px" height="30px"/> */}
                                            <ApartmentIcon className='DashboardMenuCentral-icon'/>       
                                        </i>
                                        <p className="DashboardMenuCentral-p">Sedes</p>
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button" onClick={() => navigate('/clientes')}>
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                        <i className='DashboardMenuCentral-nav-icon-i'>
                                            {/* <img  alt="" width="40px" height="30px"/> */}
                                            <AccountBalanceIcon className='DashboardMenuCentral-icon'/>
                                        </i>
                                        <p className="DashboardMenuCentral-p">  Clientes</p>
                                    </div>
                                </li>
                            </button>
                            <button className="DashboardMenuCentral-button">
                                <li>
                                    <div className="DashboardMenuCentral-nav-icon">
                                    <i className='DashboardMenuCentral-nav-icon-i'>
                                        {/* <img  alt="" width="40px" height="30px"/> */}
                                        <ShieldIcon className='DashboardMenuCentral-icon'/>
                                    </i>
                                    <p className="DashboardMenuCentral-p">Roles </p>  
                                    </div>
                                </li>
                            </button>
                        </ul>
        
    ); 
};
  
  
  export default DashboardMenuCentralGenerales;