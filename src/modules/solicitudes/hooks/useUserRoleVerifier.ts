import { useEffect, useState } from 'react';

const useUserRoleVerifier = (requiredRoles: string[]): boolean => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Obtiene los roles del usuario desde el almacenamiento local o de sesión
    const userRoles = JSON.parse(sessionStorage.getItem('userRoles') || '[]');
    
    
    // Verifica si el usuario tiene al menos uno de los roles requeridos
    const hasRequiredRole = userRoles.some((role: string) => requiredRoles.includes(role));


    setHasPermission(hasRequiredRole);
  }, []); // No es necesario incluir 'requiredRoles' como dependencia aquí, ya que no cambia una vez que el componente se ha montado

  return hasPermission;
};

export default useUserRoleVerifier;
