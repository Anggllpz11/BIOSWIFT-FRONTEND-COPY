import React, { useState } from 'react';
import { updateMarcaEquipo } from '../../services/marcasEquipoService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EditMarcaEquipoButton.css'
import { logoutService } from '../../../users/services/authService';
type EditMarcaEquipoButtonProps = {
  marcaEquipoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditMarcaEquipoButton: React.FC<EditMarcaEquipoButtonProps> = ({ marcaEquipoId, onEditSuccess, onCancel, initialData }) => {
  const [marcaEquipoData, setMarcaEquipoData] = useState(initialData);
  const loggedIn = useSessionStorage('sessionJWTToken');

  const handleEdit = async () => {
    try {

      if (!loggedIn){
        logoutService();
      }
      const token = loggedIn;

      // Realizar una solicitud PUT para actualizar la marca de equipo
      await updateMarcaEquipo(token, marcaEquipoId, marcaEquipoData);

      onEditSuccess();
      window.location.reload();
      window.alert(`Marca de equipo: ${marcaEquipoData.marca} actualizada satisfactoriamente`);
    } catch (error) {
      console.error('Error al editar la marca de equipo:', error);
    }
  };

  return (
    <div>
      <form  className="EditMarcaEquipoButton-box">
        <div className="EditMarcaEquipoButton-register-marca">
          <div className="EditMarcaEquipoButton-overlap-group">
            <div className="EditMarcaEquipoButton-overlap">
              <p className="EditMarcaEquipoButton-register-marca-title">ACTUALIZAR MARCA DE EQUIPO</p>
              <p></p>
            </div>
            <label className="EditMarcaEquipoButton-register-marca-label">Ingrese el nombre de la marca de equipo que desea registrar:</label>
            <input 
            className="EditMarcaEquipoButton-register-marca-input"
            type="text"
            value={marcaEquipoData.marca || ''}
            onChange={(e) => setMarcaEquipoData({ ...marcaEquipoData, marca: e.target.value })}
            />
            <button className="EditMarcaEquipoButton-img" type='submit' onClick={handleEdit}>Actualizar</button>
            <button className="EditMarcaEquipoButton-cancelar-button"  onClick={onCancel}>Cancelar</button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMarcaEquipoButton;
