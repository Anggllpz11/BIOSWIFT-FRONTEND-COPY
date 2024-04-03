import React, { useState } from 'react';
import { updateAreaEquipo } from '../../services/areasEquiposService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EditAreaEquipoButton.css'
import { logoutService } from '../../../users/services/authService';
type EditAreaEquipoButtonProps = {
  areaEquipoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditAreaEquipoButton: React.FC<EditAreaEquipoButtonProps> = ({ areaEquipoId, onEditSuccess, onCancel, initialData }) => {
  const [areaEquipoData, setAreaEquipoData] = useState(initialData);
  const loggedIn = useSessionStorage('sessionJWTToken');

  const handleEdit = async () => {
    try {

      if (!loggedIn){
        logoutService();
      }
      const token = loggedIn;

      // Realizar una solicitud PUT para actualizar el área de equipo
      await updateAreaEquipo(token, areaEquipoId, areaEquipoData);

      onEditSuccess();
      window.location.reload();
      window.alert(`Área de equipo: ${areaEquipoData.area} actualizada satisfactoriamente`);
    } catch (error) {
      console.error('Error al editar el área de equipo:', error);
    }
  };

  return (
    <div>
     <form  className="EditAreaEquipoButton-box">
        <div className="EditAreaEquipoButton-register-marca">
          <div className="EditAreaEquipoButton-overlap-group">
            <div className="EditAreaEquipoButton-overlap">
              <p className="EditAreaEquipoButton-register-marca-title">ACTUALIZAR ÁREA DE EQUIPO</p>
              <p></p>
            </div>
            <label className="EditAreaEquipoButton-register-marca-label">Ingrese el nombre del área de equipo que desea actualizar:</label>
            <input 
            className="EditAreaEquipoButton-register-marca-input"
            type="text"
            value={areaEquipoData.area || ''}
            onChange={(e) => setAreaEquipoData({ ...areaEquipoData, area: e.target.value })}
            />
            <button className="EditAreaEquipoButton-img" type='submit' onClick={handleEdit}>Actualizar</button>
            <button className="EditAreaEquipoButton-cancelar-button"  onClick={onCancel}>Cancelar</button>

          </div>
        </div>
      </form>


    </div>
  );
};

export default EditAreaEquipoButton;
