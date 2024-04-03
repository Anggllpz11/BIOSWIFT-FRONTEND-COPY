import { useNavigate } from 'react-router-dom';

const useLogout = (): (() => void) => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('sessionJWTToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRoles');
    navigate('/login');
  };

  return logout;
};

export default useLogout;
