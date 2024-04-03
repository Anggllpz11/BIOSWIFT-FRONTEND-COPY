import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('sessionJWTToken');
    navigate('/login');
  };

  return (
    <div>

    {/* <button onClick={logout}>Logout</button> */}
    </div>
    
  );
};

export default LogoutButton;
