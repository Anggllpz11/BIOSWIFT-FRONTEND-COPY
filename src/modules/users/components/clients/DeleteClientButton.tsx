import React, { useState } from 'react';
import { deleteClientById } from '../../services/clientsService';
import { AxiosResponse } from 'axios';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/DeleteClientButton.css';

interface DeleteClientButtonProps {
  clientId: string;
  onDeleteSuccess: () => void;
}

const DeleteClientButton: React.FC<DeleteClientButtonProps> = ({
  clientId,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);

  const handleDeleteClient = () => {
    if (!isDeleting) {
      setIsDeleting(true);

      deleteClientById(loggedIn, clientId)
        .then((response: AxiosResponse | void) => {
          if (response && response.status === 200 && response.data) {
            onDeleteSuccess();
          } else {
            console.error(`Error al eliminar cliente: ${response}`);
          }
          setIsDeleting(false);
        })
        .catch((error: any) => {
          console.error(`Error al eliminar cliente: ${error}`);
          setIsDeleting(false);
        });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <div id='DeleteClient-app-cover'>
        <input
          type='checkbox'
          className=''
          id='DeleteClient-checkbox-input'
          onClick={handleDeleteClient}
          disabled={isDeleting}
        />
        <div id='DeleteClient-bin-icon'>
          <div id='DeleteClient-lid'></div>
          <div id='DeleteClient-box'>
            <div id='DeleteClient-box-inner'>
              <div id='DeleteClient-bin-lines'></div>
            </div>
          </div>
        </div>
        <div id='DeleteClient-layer'></div>
      </div>
    </div>
  );
};

export default DeleteClientButton;
