import React, { useState } from 'react';
import { editUserById } from '../../services/usersService';
import { AxiosResponse } from 'axios';
import { User } from '../../utils/types/User.type';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';

interface EditUserButtonProps {
  userId: string;
  userData: User;
  onSaveSuccess: (editedUser: User) => void;
  isEditing: boolean; // Asegúrate de incluir el prop isEditing
}

const EditUserButton: React.FC<EditUserButtonProps> = ({
  userId,
  userData,
  onSaveSuccess,
  isEditing, // Asegúrate de recibir el prop isEditing
}) => {
  const [editedUserData, setEditedUserData] = useState<User>(userData);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);

  const handleCancelEdit = () => {
    onSaveSuccess(userData); // Restablecer los datos originales cuando se cancela la edición
  };

  const handleSaveEdit = () => {
    editUserById(loggedIn, userId, editedUserData)
      .then((response: AxiosResponse) => {
        if (response.status === 200 && response.data) {
          onSaveSuccess(response.data);
          window.location.reload();
          window.alert('Usuario actualizado satisfactoriamente');
        }
      })
      .catch((error: any) => console.error(`[EDIT USER ERROR]: ${error}`));
  };

  return (
    <div>
      {isEditing ? (
      <>
        <div className="usercard-main">
        <div className="usercard-section is-active">
              <div className="usercard-content-1">
                <div className="usercard-subtitle">Nombre de usuario</div>
                <input
                  className="usercard-desc"
                  type="text"
                  value={editedUserData.username}
                  onChange={(e) =>
                    setEditedUserData({ ...editedUserData, username: e.target.value })
                  }
                />
                <br></br>
                <br></br>
                <div className="usercard-subtitle">Cédula</div>
                <input
                  className="usercard-desc"
                  type="number"
                  value={editedUserData.cedula}
                  onChange={(e) =>
                    setEditedUserData({ ...editedUserData, cedula: parseInt(e.target.value) || 0 })
                  }
                />
                <br></br>
                <br></br>
                <div className="usercard-subtitle">Más Info</div>
                <input
                  className="usercard-desc"
                  type="text"
                  value={editedUserData.more_info}
                  onChange={(e) =>
                    setEditedUserData({ ...editedUserData, more_info: e.target.value })
                  }
                />
              </div>
              <div className="usercard-content-2">
                <div className="usercard-subtitle">Object id</div>
                <p className="usercard-desc">Único</p>
                <br></br>
                
                <div className="usercard-subtitle">Teléfono</div>
                <input
                  className="usercard-desc"
                  type="text"
                  value={editedUserData.telefono}
                  onChange={(e) =>
                    setEditedUserData({ ...editedUserData, telefono: e.target.value })
                  }
                />
                <br></br>
                <br></br>
                <div className="usercard-subtitle">Email</div>
                <input
                  className="usercard-desc"
                  type="text"
                  value={editedUserData.email}
                  onChange={(e) =>
                    setEditedUserData({ ...editedUserData, email: e.target.value })
                  }
                />
              </div>
              <br />
              <br></br>
            </div>
              <div className="usercard-buttons-edit">
                <button className="usercard-edit-button" onClick={handleSaveEdit}>Guardar</button>
                <button className="usercard-edit-button" onClick={handleCancelEdit}>Cancelar</button>
              </div>
          </div>
      </>
      ) : null}
    </div>
  );
};

export default EditUserButton;
