import React, { useState } from 'react';
import { updateTipoEquipo } from '../../services/tiposEquipoService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EditTipoEquipoButton.css'
import { logoutService } from '../../../users/services/authService';
type EditTipoEquipoButtonProps = {
  tipoEquipoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditTipoEquipoButton: React.FC<EditTipoEquipoButtonProps> = ({ tipoEquipoId, onEditSuccess, onCancel, initialData }) => {
  const [tipoEquipoData, setTipoEquipoData] = useState(initialData);
  const loggedIn = useSessionStorage('sessionJWTToken');

  const handleEdit = async () => {
    try {
      if (!loggedIn){
        logoutService();
      };
      const token = loggedIn;

      // Realizar una solicitud PUT para actualizar el tipo de equipo
      await updateTipoEquipo(token, tipoEquipoId, tipoEquipoData);

      onEditSuccess();
      window.location.reload();
      window.alert(`Tipo de equipo: ${tipoEquipoData.tipo} actualizado satisfactoriamente`);
    } catch (error) {
      console.error('Error al editar el tipo de equipo:', error);
    }
  };

  return (
    <div>
      <form  className="EditTipoEquipoButton-box">
        <div className="EditTipoEquipoButton-register-marca">
          <div className="EditTipoEquipoButton-overlap-group">
            <div className="EditTipoEquipoButton-overlap">
              <p className="EditTipoEquipoButton-register-marca-title">ACTUALIZAR TIPO DE EQUIPO</p>
              <p></p>
            </div>
            <label className="EditTipoEquipoButton-register-marca-label">Ingrese el nombre del tipo de equipo que desea actualizar:</label>
            <input 
            className="EditTipoEquipoButton-register-marca-input"
            type="text"
            value={tipoEquipoData.tipo || ''}
            onChange={(e) => setTipoEquipoData({ ...tipoEquipoData, area: e.target.value })}
            />
            <button className="EditTipoEquipoButton-img" type='submit' onClick={handleEdit}>Actualizar</button>
            <button className="EditTipoEquipoButton-cancelar-button"  onClick={onCancel}>Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTipoEquipoButton;
