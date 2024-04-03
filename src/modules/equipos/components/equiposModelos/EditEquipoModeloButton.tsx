import React, { useEffect, useState } from 'react';
import { updateModeloEquipo } from '../../services/equiposModeloService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EditEquipoButton.css'
import { useNavigate } from 'react-router-dom';
import { searchClasesEquiposByKeyword, searchMarcasEquiposByKeyword } from '../../services/searchEquiposService';
import { searchPreventivosByKeyword } from '../../../procesos_&_protocolos/services/searchProcesos&ProtocolosService';


type EditEquipoModeloButtonProps = {
  modeloEquipoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditEquipoModeloButton: React.FC<EditEquipoModeloButtonProps> = ({ modeloEquipoId, onEditSuccess, onCancel, initialData }) => {
  const [modeloEquipoData, setModeloEquipoData] = useState(initialData);

  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const [marcaKeyword, setMarcaKeyword] = useState(initialData.id_marca ? initialData.id_marca.marca : '');
  const [marcaResults, setMarcaResults] = useState<any[]>([]);

  const [claseKeyword, setClaseKeyword] = useState(initialData.id_clase ? initialData.id_clase.clase : '');
  const [claseResults, setClaseResults] = useState<any[]>([]);

  const [preventivoKeyword, setPreventivoKeyword] = useState(initialData.id_preventivo ? initialData.id_preventivo.title : '');
  const [preventivoResults, setPreventivoResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarcas = async () => {
      if (marcaKeyword.trim()) {
        const results = await searchMarcasEquiposByKeyword(loggedIn, marcaKeyword);
        setMarcaResults(results);
      } else {
        setMarcaResults([]);
      }
    };

    const fetchClases = async () => {
      if (claseKeyword.trim()) {
        const results = await searchClasesEquiposByKeyword(loggedIn, claseKeyword);
        setClaseResults(results);
      } else {
        setClaseResults([]);
      }
    };

    const fetchPreventivos = async () => {
      if (preventivoKeyword.trim()) {
        const results = await searchPreventivosByKeyword(loggedIn, preventivoKeyword);
        setPreventivoResults(results);
      } else {
        setPreventivoResults([]);
      }
    };

    fetchMarcas();
    fetchClases();
    fetchPreventivos();
  }, [marcaKeyword, claseKeyword, preventivoKeyword, loggedIn]);

  const handleSelectPreventivo = (preventivo: any) => {
    setModeloEquipoData({ ...modeloEquipoData, id_preventivo: preventivo._id });
    setPreventivoKeyword(preventivo.title);
    setPreventivoResults([]);
  };

  const handleSelectMarca = (marca: any) => {
    setModeloEquipoData({ ...modeloEquipoData, id_marca: marca._id });
    setMarcaKeyword(marca.marca);
    setMarcaResults([]);
  };

  const handleSelectClase = (clase: any) => {
    setModeloEquipoData({ ...modeloEquipoData, id_clase: clase._id });
    setClaseKeyword(clase.clase);
    setClaseResults([]);
  };

  const handleEdit = async () => {
    // Verificar si todos los campos requeridos están presentes
    if (!modeloEquipoData.modelo || modeloEquipoData.precio < 0 || !modeloEquipoData.id_marca || !modeloEquipoData.id_clase || !modeloEquipoData.id_preventivo) {
      window.alert("Todos los campos son obligatorios. Por favor, completa toda la información.");
      return;
    }

    try {
      if (!loggedIn) {
        setTimeout(() => { navigate('/login'); }, 2000);
        return;
      }
      const token = loggedIn;

      const mappedData = {
        ...modeloEquipoData,
        id_marca: modeloEquipoData.id_marca._id || modeloEquipoData.id_marca,
        id_clase: modeloEquipoData.id_clase._id || modeloEquipoData.id_clase,
        id_preventivo: modeloEquipoData.id_preventivo._id || modeloEquipoData.id_preventivo,
      };

      await updateModeloEquipo(token, modeloEquipoId, mappedData);
      onEditSuccess();
      window.location.reload();
    } catch (error) {
      console.error('Error al editar el modelo de equipo:', error);
    }
  };

  return (
    <div>
      <div className="EditEquipoModeloButton-box">
      <form  className="EditEquipoModeloButton-registerequipomodelo">
        <div className="EditEquipoModeloButton-overlap-group">
          <div className="EditEquipoModeloButton-overlap">
            <p className="EditEquipoModeloButton-title">ACTUALIZAR MODELO DE EQUIPO</p>
            <p className='EditEquipoModeloButton-ID'>{modeloEquipoData._id || ''}</p>
          </div>
          <div className="EditEquipoModeloButton-container-separator" />
          
          <label htmlFor="modelo" className="EditEquipoModeloButton-modelo-nombre-title">1. Ingrese el nombre del modelo de equipo</label>
          <input 
          className="EditEquipoModeloButton-modelo-nombre-input"
          type="text"
          value={modeloEquipoData.modelo || ''}
          onChange={(e) => setModeloEquipoData({ ...modeloEquipoData, modelo: e.target.value })}
          />
          
          <label htmlFor="precio" className="EditEquipoModeloButton-modelo-precio-title">2. Ingrese el precio del modelo de equipo</label>
          <input 
          className="EditEquipoModeloButton-modelo-precio-input"
          type="number"
          value={modeloEquipoData.precio || 0}
          onChange={(e) => setModeloEquipoData({ ...modeloEquipoData, precio: e.target.value })}
          />

          <label htmlFor="marca" className="EditEquipoModeloButton-modelo-marca-title">3. Seleccione la Marca de Equipo a relacionar</label>
            <input
              className="EditEquipoModeloButton-modelo-marca-input"
              type="text"
              value={marcaKeyword}
              onChange={(e) => setMarcaKeyword(e.target.value)}
              placeholder='Buscar Marca...'
              autoComplete="off"
            />
            {marcaResults.length > 0 && (
              <ul className="EditEquipoModeloButton-search-marca-results">
                {marcaResults.map((marca) => (
                  <li className='EditEquipoModeloButton-search-marca-item' key={marca._id} onClick={() => handleSelectMarca(marca)}>
                    {marca.marca}
                  </li>
                ))}
              </ul>
            )}
          
          <label htmlFor="clase" className="EditEquipoModeloButton-modelo-clase-title">4. Seleccione la Clase de Equipo a relacionar</label>
            <input
              className="EditEquipoModeloButton-modelo-clase-input"
              type="text"
              value={claseKeyword}
              onChange={(e) => setClaseKeyword(e.target.value)}
              placeholder='Buscar Clase...'
              autoComplete="off"
            />
            {claseResults.length > 0 && (
              <ul className="EditEquipoModeloButton-search-clase-results">
                {claseResults.map((clase) => (
                  <li className='EditEquipoModeloButton-search-clase-item' key={clase._id} onClick={() => handleSelectClase(clase)}>
                    {clase.clase}
                  </li>
                ))}
              </ul>
            )}
          

          
          <label htmlFor="preventivo" className="EditEquipoModeloButton-modelo-preventivo-title">5. Seleccione el protocolo preventivo a relacionar</label>
            <input 
              className="EditEquipoModeloButton-modelo-preventivo-input"
              type="text"
              value={preventivoKeyword}
              onChange={(e) => setPreventivoKeyword(e.target.value)}
              placeholder='Buscar Preventivo...'
              autoComplete="off"
            />
            {preventivoResults.length > 0 && (
              <ul className="EditEquipoModeloButton-search-preventivo-results">
                {preventivoResults.map((preventivo) => (
                  <li className='EditEquipoModeloButton-search-preventivo-item' key={preventivo._id} onClick={() => handleSelectPreventivo(preventivo)}>
                    {preventivo.title}
                  </li>
                ))}
              </ul>
            )}
          
          <button 
          className="EditEquipoModeloButton-modelo-canelar" onClick={onCancel}>Cancelar</button>
          <button 
          type='submit'
          className="EditEquipoModeloButton-modelo-registrar" onClick={handleEdit}>Actualizar</button>
        </div>
      </form>
    </div>


    </div>
  );
};

export default EditEquipoModeloButton;
