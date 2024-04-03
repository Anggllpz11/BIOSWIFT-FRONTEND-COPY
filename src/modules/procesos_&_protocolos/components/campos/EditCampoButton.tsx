import React, { useState } from 'react';
import { updateCampos } from '../../services/camposService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EditCampoButton.css'; 

type EditCampoButtonProps = {
  campoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any; // Asegúrate de que esto coincida con la estructura de un Campo
};

const EditCampoButton: React.FC<EditCampoButtonProps> = ({ campoId, onEditSuccess, onCancel, initialData }) => {
  const [campoData, setCampoData] = useState(initialData);
  const loggedIn = useSessionStorage('sessionJWTToken');

  const handleEdit = async () => {
    try {
      const token = loggedIn;

      // Mapear los campos relacionados al formato correcto
      const mappedData = {
        ...campoData,
        // Asumiendo que id_tipo es un objeto y necesita mapearse a una cadena para la solicitud
        id_tipo: campoData.id_tipo.nombre
      };

      await updateCampos(token, campoId, mappedData);
      onEditSuccess();
      window.location.reload();
      window.alert(`Campo actualizado satisfactoriamente`);
      
    } catch (error) {
      console.error('Error al editar el campo:', error);
    }
  };

  return (
    <div className="EditCampoButton-box">
      <form className="EditCampoButton-form" onSubmit={(e) => {e.preventDefault(); handleEdit();}}>
      <div className="EditCampoButton-box-1">
          <div className="EditCampoButton-group">
            <div className="EditCampoButton-overlap-group">
              <div className="EditCampoButton-overlap">
                <p className="EditCampoButton-campo-title">ACTUALIZAR CAMPO - {campoData.title}</p>
                <div className="EditCampoButton-id-title">ID: {campoData._id}</div>
              </div>
              <p className="EditCampoButton-tipo-p">Seleccione el tipo de campo:</p>
              <select
                className="EditCampoButton-tipo-input"
                value={campoData.id_tipo.nombre || ''}
                onChange={(e) => setCampoData({ ...campoData, id_tipo: { ...campoData.id_tipo, nombre: e.target.value } })}
                >
                  <option value="Pasó ó Falló">Pasó ó Falló</option>
                  <option value="Cuantitativo">Cuantitativo</option>
                </select>
              <p className="EditCampoButton-title-p">Ingrese el titulo del campo:</p>
              <input 
              className="EditCampoButton-title-input"
              value={campoData.title || ''}
              onChange={(e) => setCampoData({ ...campoData, title: e.target.value })}
              />
              <button className="EditCampoButton-cancelar" onClick={onCancel}>CANCELAR</button>
              <button type="submit" className="EditCampoButton-actualizar">ACTUALIZAR</button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditCampoButton;
