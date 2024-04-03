import React, { useState } from 'react';
import { updateClaseEquipo } from '../../services/clasesEquipoService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EditClaseEquipoButton.css'
import { useNavigate } from 'react-router-dom';


type EditClaseEquipoButtonProps = {
  claseEquipoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditClaseEquipoButton: React.FC<EditClaseEquipoButtonProps> = ({ claseEquipoId, onEditSuccess, onCancel, initialData }) => {
  const [claseEquipoData, setClaseEquipoData] = useState(initialData);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleEdit = async () => {
    try {

      if (!loggedIn) {
        // Redirige al usuario a la página de inicio de sesión si no está autenticado
          navigate('/login');
          
      }

      const token = loggedIn;

      // Realizar una solicitud PUT para actualizar la clase de equipo
      await updateClaseEquipo(token, claseEquipoId, claseEquipoData);

      onEditSuccess();
      window.location.reload();
      window.alert(`Clase de equipo: ${claseEquipoData.clase} actualizada satisfactoriamente`);
    } catch (error) {
      console.error('Error al editar la clase de equipo:', error);
    }
  };

  return (
    <div>
      <form  className="EditClaseEquipoButton-box">
        <div className="EditClaseEquipoButton-register-marca">
          <div className="EditClaseEquipoButton-overlap-group">
            <div className="EditClaseEquipoButton-overlap">
              <p className="EditClaseEquipoButton-register-marca-title">ACTUALIZAR TIPO DE EQUIPO</p>
              <p></p>
            </div>
            <label className="EditClaseEquipoButton-register-marca-label">Ingrese el nombre del tipo de equipo que desea actualizar:</label>
            <input 
            className="EditClaseEquipoButton-register-marca-input"
            type="text"
            value={claseEquipoData.clase || ''}
            onChange={(e) => setClaseEquipoData({ ...claseEquipoData, area: e.target.value })}
            />
            <button className="EditClaseEquipoButton-img" type='submit' onClick={handleEdit}>Actualizar</button>
            <button className="EditClaseEquipoButton-cancelar-button"  onClick={onCancel}>Cancelar</button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default EditClaseEquipoButton;
