import React, { useState } from 'react';
import { updateClientById } from '../../services/clientsService';
import { AxiosResponse } from 'axios';
import { Client } from '../../utils/types/Client.type';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';

interface EditClientButtonProps {
  clientId: string;
  clientData: Client;
  onSaveSuccess: (editedClient: Client) => void;
  isEditing: boolean;
}

const EditClientButton: React.FC<EditClientButtonProps> = ({
  clientId,
  clientData,
  onSaveSuccess,
  isEditing,
}) => {
  const [editedClientData, setEditedClientData] = useState<Client>(clientData);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);

  const handleCancelEdit = () => {
    onSaveSuccess(clientData);
  };

  const handleSaveEdit = () => {
    updateClientById(loggedIn, clientId, editedClientData)
      .then((response: AxiosResponse) => {
        if (response.status === 200 && response.data) {
          onSaveSuccess(response.data);
          window.location.reload();
          window.alert('Cliente actualizado satisfactoriamente');
        }
      })
      .catch((error: any) => console.error(`[EDIT CLIENT ERROR]: ${error}`));
  };

  return (
    <div>
      {isEditing ? (
        <div className="clientcard-main-edited">
          <div className="clientcard-section is-active">
            <div className="clientcard-content-1">
              <div className="clientcard-subtitle">Dirección</div>
              <input
                className="clientcard-desc"
                type="text"
                value={editedClientData.client_address}
                onChange={(e) =>
                  setEditedClientData({ ...editedClientData, client_address: e.target.value })
                }
              />
            
              <div className="clientcard-subtitle">Teléfono</div>
              <input
                className="clientcard-desc"
                type="text"
                value={editedClientData.client_telefono}
                onChange={(e) =>
                  setEditedClientData({ ...editedClientData, client_telefono: e.target.value })
                }
                />
              <br />
              <br />
              <div className="clientcard-subtitle">Email</div>
              <input
                className="clientcard-desc"
                type="text"
                value={editedClientData.client_email}
                onChange={(e) =>
                  setEditedClientData({ ...editedClientData, client_email: e.target.value })
                }
                />
            </div>
            
            {isAdmin && (
              <div className='clientcard-buttons-edit'>
                <button className="clientcard-edit-button" onClick={handleSaveEdit}>
                  Guardar
                </button>
                <button className="clientcard-edit-button" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EditClientButton;
