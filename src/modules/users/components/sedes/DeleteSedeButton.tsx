import React, { useState } from 'react';
import { deleteSedeById } from '../../services/sedesService';
import { AxiosResponse } from 'axios';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/DeleteSedeButton.css'; 

interface DeleteSedeButtonProps {
  sedeId: string;
  onDeleteSuccess: () => void;
}

const DeleteSedeButton: React.FC<DeleteSedeButtonProps> = ({
  sedeId,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);

  const handleDeleteSede = () => {
    if (!isDeleting) {
      setIsDeleting(true);

      deleteSedeById(loggedIn, sedeId)
        .then((response: AxiosResponse) => {
          if (response.status === 200 && response.data) {
            onDeleteSuccess();
          }
        })
        .catch((error: any) => {
          console.error(`Error al eliminar sede: ${error}`);
          setIsDeleting(false);
        });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <div id='DeleteSede-app-cover'>
        <input
          type='checkbox'
          className=''
          id='DeleteSede-checkbox-input'
          onClick={handleDeleteSede}
          disabled={isDeleting}
        />
        <div id='DeleteSede-bin-icon'>
          <div id='DeleteSede-lid'></div>
          <div id='DeleteSede-box'>
            <div id='DeleteSede-box-inner'>
              <div id='DeleteSede-bin-lines'></div>
            </div>
          </div>
        </div>
        <div id='DeleteSede-layer'></div>
      </div>
    </div>
  );
};

export default DeleteSedeButton;
