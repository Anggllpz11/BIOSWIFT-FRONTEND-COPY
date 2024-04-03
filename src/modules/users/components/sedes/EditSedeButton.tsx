import React, { useState } from 'react';
import { updateSedeById } from '../../services/sedesService';
import { AxiosResponse } from 'axios';
import { Sede } from '../../utils/types/Sede.type';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';

interface EditSedeButtonProps {
  sedeId: string;
  sedeData: Sede | undefined; // Asegúrate de que sedeData pueda ser undefined
  onSaveSuccess: (editedSede: Sede) => void;
  isEditing: boolean;
}

const EditSedeButton: React.FC<EditSedeButtonProps> = ({
  sedeId,
  sedeData,
  onSaveSuccess,
  isEditing,
}) => {
  const [editedSedeData, setEditedSedeData] = useState<Sede | undefined>(sedeData); // Inicializa con sedeData

  // Restablece los datos originales si sedeData cambia a undefined
  if (sedeData === undefined) {
    setEditedSedeData(undefined);
  }

  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);

  const handleCancelEdit = () => {
    onSaveSuccess(sedeData || {} as Sede); // Restablecer los datos originales cuando se cancela la edición
  };

  const handleSaveEdit = () => {
    if (editedSedeData) {
      updateSedeById(loggedIn, sedeId, editedSedeData)
        .then((response: AxiosResponse) => {
          if (response.status === 200 && response.data) {
            onSaveSuccess(response.data);
            window.location.reload();
            window.alert('Sede actualizada satisfactoriamente');
          }
        })
        .catch((error: any) => console.error(`[EDIT SEDE ERROR]: ${error}`));
    }
  };

  return (
    <div>
      {isEditing && editedSedeData ? ( // Comprobación de nulidad adicional
        <>
          <div className="sedeDetail-main-edited">
            <div className="sedeDetail-section is-active">
              <div className="sedeDetail-content-1">
                <div className="sedeDetail-subtitle">Dirección</div>
                <input
                  className="sedeDetail-desc"
                  type="text"
                  value={editedSedeData.sede_address}
                  onChange={(e) =>
                    setEditedSedeData({ ...editedSedeData, sede_address: e.target.value })
                  }
                />
                <br />
                <br />
                <div className="sedeDetail-subtitle">Teléfono</div>
                <input
                  className="sedeDetail-desc"
                  type="text"
                  value={editedSedeData.sede_telefono}
                  onChange={(e) =>
                    setEditedSedeData({ ...editedSedeData, sede_telefono: e.target.value })
                  }
                />
                <div className="sedeDetail-subtitle">Email</div>
                <input
                  className="sedeDetail-desc"
                  type="text"
                  value={editedSedeData.sede_email}
                  onChange={(e) =>
                    setEditedSedeData({ ...editedSedeData, sede_email: e.target.value })
                  }
                />
              </div>
              <div className="sedeDetail-buttons-edit">
                <button className="sedeDetail-edit-button" onClick={handleSaveEdit}>
                  Guardar
                </button>
                <button className="sedeDetail-edit-button" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default EditSedeButton;
