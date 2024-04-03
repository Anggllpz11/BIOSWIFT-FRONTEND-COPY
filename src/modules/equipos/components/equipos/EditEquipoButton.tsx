import React, { useEffect, useState } from 'react';
import { updateEquipo } from '../../services/equiposService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/EditEquipoButton.css';
import { searchSedesByKeyword } from '../../../users/services/sedesService';
import { searchAreasEquiposByKeyword, searchModelosEquiposByKeyword, searchTiposEquiposByKeyword } from '../../services/searchEquiposService';
type EditEquipoButtonProps = {
  equipoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditEquipoButton: React.FC<EditEquipoButtonProps> = ({ equipoId, onEditSuccess, onCancel, initialData }) => {
  const [equipoData, setEquipoData] = useState(initialData);

  const loggedIn = useSessionStorage('sessionJWTToken');

  // Estados para la búsqueda de sedes
  const [sedeKeyword, setSedeKeyword] = useState(initialData.id_sede ? initialData.id_sede.sede_nombre : 'N/A');
  const [sedeResults, setSedeResults] = useState<any[]>([]);

   // Estados para la búsqueda de modelos
   const [modeloKeyword, setModeloKeyword] = useState(initialData.modelo_equipos ? initialData.modelo_equipos.modelo : '');
   const [modeloResults, setModeloResults] = useState<any[]>([]);

   // Estados para la búsqueda de áreas
  const [areaKeyword, setAreaKeyword] = useState(initialData.id_area ? initialData.id_area.area : '');
  const [areaResults, setAreaResults] = useState<any[]>([]);

  // Estados para la búsqueda de tipos
  const [tipoKeyword, setTipoKeyword] = useState(initialData.id_tipo ? initialData.id_tipo.tipo : '');
  const [tipoResults, setTipoResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchSedes = async () => {
      if (sedeKeyword.trim()) {
        try {
          const results = await searchSedesByKeyword(loggedIn, sedeKeyword);
          setSedeResults(results);
        } catch (error) {
          console.error('Error al buscar sedes:', error);
        }
      } else {
        setSedeResults([]);
      }
    };

    fetchSedes();
  }, [sedeKeyword, loggedIn]);

  const handleSelectSede = (sede: any) => {
    setEquipoData({ ...equipoData, id_sede: { sede_nombre: sede.sede_nombre, _id: sede._id } });
    setSedeKeyword(sede.sede_nombre);
    setSedeResults([]);
  };

  useEffect(() => {
    const fetchModelos = async () => {
      if (modeloKeyword.trim()) {
        try {
          const results = await searchModelosEquiposByKeyword(loggedIn, modeloKeyword);
          setModeloResults(results);
        } catch (error) {
          console.error('Error al buscar modelos:', error);
        }
      } else {
        setModeloResults([]);
      }
    };

    fetchModelos();
  }, [modeloKeyword, loggedIn]);

  const handleSelectModelo = (modelo: any) => {
    setEquipoData({ ...equipoData, modelo_equipos: { modelo: modelo.modelo, _id: modelo._id } });
    setModeloKeyword(modelo.modelo);
    setModeloResults([]);
  };
  
  useEffect(() => {
    const fetchAreas = async () => {
      if (areaKeyword.trim()) {
        try {
          const results = await searchAreasEquiposByKeyword(loggedIn, areaKeyword);
          setAreaResults(results);
        } catch (error) {
          console.error('Error al buscar áreas:', error);
        }
      } else {
        setAreaResults([]);
      }
    };

    fetchAreas();
  }, [areaKeyword, loggedIn]);

  const handleSelectArea = (area: any) => {
    setEquipoData({ ...equipoData, id_area: { area: area.area, _id: area._id } });
    setAreaKeyword(area.area);
    setAreaResults([]);
  };
  
  // Efecto para buscar tipos
  useEffect(() => {
    const fetchTipos = async () => {
      if (tipoKeyword.trim()) {
        try {
          const results = await searchTiposEquiposByKeyword(loggedIn, tipoKeyword);
          setTipoResults(results);
        } catch (error) {
          console.error('Error al buscar tipos:', error);
        }
      } else {
        setTipoResults([]);
      }
    };

    fetchTipos();
  }, [tipoKeyword, loggedIn]);

  // Manejador para seleccionar un tipo
  const handleSelectTipo = (tipo: any) => {
    setEquipoData({ ...equipoData, id_tipo: { tipo: tipo.tipo, _id: tipo._id } });
    setTipoKeyword(tipo.tipo);
    setTipoResults([]); // Esto cierra la lista de resultados después de la selección
  };

  const handleEdit = async () => {
    try {
      const token = loggedIn;

      // Mapear los campos relacionados al formato correcto
      const mappedData = {
        ...equipoData,
        id_sede: equipoData.id_sede.sede_nombre,
        modelo_equipos: equipoData.modelo_equipos.modelo,
        id_area: equipoData.id_area.area,
        id_tipo: equipoData.id_tipo.tipo,
      };

      await updateEquipo(token, equipoId, mappedData);
      onEditSuccess();
       // Mostrar la alerta y luego recargar la página después de 2 segundos
      window.alert(`Equipo SERIE: ${equipoData.serie} actualizado satisfactoriamente`);
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milisegundos (2 segundos)
    } catch (error) {
      console.error('Error al editar el equipo:', error);
    }
  };

  return (
    <div>
    <div className="EditEquipoButton-box">
      <form className="EditEquipoButton-form">
        <div className="EditEquipoButton-overlap-group">
          <div className="EditEquipoButton-overlap">
            <div className="EditEquipoButton-text-wrapper">ACTUALIZAR EQUIPO</div>
          </div>
          <div className="EditEquipoButton-rectangle" />
          
          <label className="EditEquipoButton-div">Seleccione la sede a relacionar:</label>
          <input
            type="text"
            value={sedeKeyword}
            onChange={(e) => setSedeKeyword(e.target.value)}
            className="EditEquipoButton-rectangle-2"
            autoComplete="off"
            placeholder="Buscar Sede..."
          />
          {sedeResults.length > 0 && (
            <ul className="EditEquipoButton-search-results-sede">
              {sedeResults.map((sede) => (
                <li key={sede._id} onClick={() => handleSelectSede(sede)} className="EditEquipoButton-search-item-sede">
                  {sede.sede_nombre}
                </li>
              ))}
            </ul>
          )}

          <label className="EditEquipoButton-p">Ingrese el numero de serie (SN) del equipo:</label>
          <input
          type="text"
          value={equipoData.serie || ''}
          onChange={(e) => setEquipoData({ ...equipoData, serie: e.target.value })}
          className="EditEquipoButton-rectangle-3" />

          <label className="EditEquipoButton-text-wrapper-2">Ingrese la ubicación dentro de la Sede para el equipo:</label>
          <input
          type="text"
          value={equipoData.ubicacion || ''}
          onChange={(e) => setEquipoData({ ...equipoData, ubicacion: e.target.value })}
          className="EditEquipoButton-rectangle-4" />



          <label className="EditEquipoButton-text-wrapper-3">Ingrese la frecuencia en meses para el mantenimiento del equipo:</label>
          <input
          type="number"
          value={equipoData.frecuencia || ''}
          onChange={(e) => setEquipoData({ ...equipoData, frecuencia: e.target.value })}
          className="EditEquipoButton-rectangle-5" />



          <label className="EditEquipoButton-text-wrapper-4">Seleccione el Modelo de Equipo a relacionar:</label>
                    <input
                      type="text"
                      value={modeloKeyword}
                      onChange={(e) => setModeloKeyword(e.target.value)}
                      className="EditEquipoButton-rectangle-6"
                      autoComplete="off"
                      placeholder="Buscar Modelo..."
                    />
                    {modeloResults.length > 0 && (
                      <ul className="EditEquipoButton-search-results-modelo">
                        {modeloResults.map((modelo) => (
                          <li key={modelo._id} onClick={() => handleSelectModelo(modelo)} className="EditEquipoButton-search-item-modelo">
                            {modelo.modelo}
                          </li>
                        ))}
                      </ul>
                    )}


          <label className="EditEquipoButton-text-wrapper-5">Seleccione el Área de Equipo a relacionar:</label>
                <input
                  type="text"
                  value={areaKeyword}
                  onChange={(e) => setAreaKeyword(e.target.value)}
                  className="EditEquipoButton-rectangle-7"
                  autoComplete="off"
                  placeholder="Buscar Área..."
                />
                {areaResults.length > 0 && (
                  <ul className="EditEquipoButton-search-results-areas">
                    {areaResults.map((area) => (
                      <li key={area._id} onClick={() => handleSelectArea(area)} className="EditEquipoButton-search-item-areas">
                        {area.area}
                      </li>
                    ))}
                  </ul>
                )}

          {/* Campo de búsqueda de tipo */}
          <label htmlFor="id_tipo" className="EditEquipoButton-text-wrapper-6">Seleccione el Tipo de Equipo a relacionar:</label>
          <input
            type="text"
            id="id_tipo"
            name="id_tipo"
            value={tipoKeyword}
            onChange={(e) => setTipoKeyword(e.target.value)}
            className="EditEquipoButton-rectangle-8"
            autoComplete="off"
            placeholder="Buscar Tipo..."
          />
          {tipoResults.length > 0 && (
            <ul className="EditEquipoButton-search-results-tipos">
              {tipoResults.map((tipo) => (
                <li key={tipo._id} onClick={() => handleSelectTipo(tipo)} className="EditEquipoButton-search-item-tipos">
                  {tipo.tipo}
                </li>
              ))}
            </ul>
          )}

            <label htmlFor="activo_fijo" className="EditEquipoButton-activo-fijo-label">9.  Ingrese el valor del Activo Fijo:</label>
                <input
                type="text"
                id="activo_fijo"
                name="activo_fijo"
                value={equipoData.activo_fijo || ''}
                onChange={(e) => setEquipoData({ ...equipoData, activo_fijo: e.target.value })}
                className="EditEquipoButton-activo-fijo-input" />

                <label htmlFor="mtto" className="EditEquipoButton-mtto-label">4.  Ingrese el valor del MTTO:</label>
                <input
                type="text"
                id="mtto"
                name="mtto"
                value={equipoData.mtto || ''}
                onChange={(e) => setEquipoData({ ...equipoData, mtto: e.target.value })}
                className="EditEquipoButton-mtto-input" />


          <div className="EditEquipoButton-div-wrapper">
            <button 
             className="EditEquipoButton-text-wrapper-7"
             onClick={onCancel}
             >CANCELAR</button>
          </div>
          <div className="EditEquipoButton-overlap-2">
            <button type="submit" className="EditEquipoButton-text-wrapper-8" onClick={handleEdit}>ACTUALIZAR</button>
          </div>
        </div>
      </form>
    </div>



    </div>
  );
};

export default EditEquipoButton;
