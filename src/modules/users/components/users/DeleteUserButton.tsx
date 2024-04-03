import React, { useState } from 'react';
import { deleteUserById } from '../../services/usersService';
import { AxiosResponse } from 'axios';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/DeleteUserButton.css';

interface DeleteUserButtonProps {
  userId: string;
  onDeleteSuccess: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({
  userId,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);


  const handleDeleteUser = () => {
    if (!isDeleting) {
      setIsDeleting(true);

      deleteUserById(loggedIn, userId)
        .then((response: AxiosResponse) => {
          if (response.status === 200 && response.data) {
            onDeleteSuccess();
          }
        })
        .catch((error: any) => {
          console.error(`Error al eliminar usuario: ${error}`);
          setIsDeleting(false);
        });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <div id='DeleteUser-app-cover'>
        <input
          type='checkbox'
          className=''
          id='DeleteUser-checkbox-input'
          onClick={handleDeleteUser}
          disabled={isDeleting}
        />
        <div id='DeleteUser-bin-icon'>
          <div id='DeleteUser-lid'></div>
          <div id='DeleteUser-box'>
            <div id='DeleteUser-box-inner'>
              <div id='DeleteUser-bin-lines'></div>
            </div>
          </div>
        </div>
        <div id='DeleteUser-layer'></div>
      </div>
    </div>
  );
};

export default DeleteUserButton;
