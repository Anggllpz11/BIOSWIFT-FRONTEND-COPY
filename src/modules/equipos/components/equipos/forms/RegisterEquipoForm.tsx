import React, { useState, FormEvent, useEffect } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createEquipo } from '../../../services/equiposService';
import './styles/RegisterEquipoForm.css'
import { useNavigate } from 'react-router-dom';
import { searchSedesByKeyword } from '../../../../users/services/sedesService';
import { searchAreasEquiposByKeyword, searchModelosEquiposByKeyword, searchTiposEquiposByKeyword } from '../../../services/searchEquiposService';
const RegisterEquipoForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [equipoData, setEquipoData] = useState({
    id_sede: '',
    modelo_equipos: '',
    id_area: '',
    id_tipo: '',
    serie: '',
    ubicacion: '',
    frecuencia: 0,
    activo_fijo: '',
    mtto: ''
  });
  const navigate = useNavigate();
   
   
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Nuevo estado para la búsqueda de modelos
  const [modeloKeyword, setModeloKeyword] = useState('');
  const [modeloResults, setModeloResults] = useState<any[]>([]);
  // Estados para la búsqueda de áreas
  const [areaKeyword, setAreaKeyword] = useState('');
  const [areaResults, setAreaResults] = useState<any[]>([]);

  // Estados para la búsqueda de tipos
  const [tipoKeyword, setTipoKeyword] = useState('');
  const [tipoResults, setTipoResults] = useState<any[]>([]);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchSedes = async () => {
      if (keyword.trim()) {
        try {
          const results = await searchSedesByKeyword(loggedIn, keyword);
          setSearchResults(results);
        } catch (error) {
          console.error('Error al buscar sedes:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSedes();
  }, [keyword, loggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEquipoData({ ...equipoData, [name]: value });
  };

  const handleSelectSede = (sede: any) => {
    setEquipoData({ ...equipoData, id_sede: sede.sede_nombre });
    setKeyword(sede.sede_nombre); // Actualiza el campo de texto con el nombre de la sede seleccionada
    setSearchResults([]); // Limpia los resultados de búsqueda después de seleccionar
  };

  // Efecto para buscar modelos basados en la entrada del usuario
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

  // Manejador para seleccionar un modelo de la lista de resultados
  const handleSelectModelo = (modelo: any) => {
    setEquipoData({ ...equipoData, modelo_equipos: modelo.modelo });
    // Limpiar el campo de búsqueda y los resultados después de seleccionar un modelo
    setModeloKeyword(modelo.modelo);
    setModeloResults([]);
  };



  // Efecto para buscar áreas
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

  // Manejadores para seleccionar área y tipo
  const handleSelectArea = (area: any) => {
    setEquipoData({ ...equipoData, id_area: area.area });
    setAreaKeyword(area.area); // Limpia el término de búsqueda
    setAreaResults([]); // Limpia los resultados de búsqueda
  };

  const handleSelectTipo = (tipo: any) => {
    setEquipoData({ ...equipoData, id_tipo: tipo.tipo });
    setTipoKeyword(tipo.tipo); // Limpia el término de búsqueda
    setTipoResults([]); // Limpia los resultados de búsqueda
  };

  type EquipoDataKeys = keyof typeof equipoData;
  const requiredFields: EquipoDataKeys[] = ['id_sede', 'modelo_equipos', 'id_area', 'id_tipo'];

   const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const missing = requiredFields.filter((field) => !equipoData[field]);
    if (missing.length > 0) {
      window.alert(`Los siguientes campos son obligatorios y faltan por llenar: ${missing.join(', ')}`);
      return;
    }

    try {
      await createEquipo(loggedIn, equipoData);
      console.log('Equipo registrado exitosamente');
      window.alert('Equipo registrado exitosamente');
      navigate('/equipos');
    } catch (error) {
      console.error('Error al registrar el equipo:', error);
    }
  };

  return (
    <div>
    
      <div className="RegisterEquipoForm-box">
      <form onSubmit={handleSubmit} className="REGISTER-EQUIPO-FORM">
        <div className="RegisterEquipoForm-overlap-group">
          <div className="RegisterEquipoForm-overlap">
            <div className="RegisterEquipoForm-text-wrapper">REGISTRAR NUEVO EQUIPO</div>
          </div>
          <div className="RegisterEquipoForm-rectangle" />
          
         <label htmlFor="id_sede" className="RegisterEquipoForm-div">1.  Seleccione la sede a relacionar: *</label>
          <input 
            type="text"
            id="id_sede"
            name="id_sede"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="RegisterEquipoForm-rectangle-2"
            autoComplete="off"
            placeholder='Buscar Sede...'
          />
          {searchResults.length > 0 && (
            <ul className="RegisterEquipoForm-search-results">
              {searchResults.map((sede) => (
                <li className="RegisterEquipoForm-search-item" key={sede._id} onClick={() => handleSelectSede(sede)} >
                  {sede.sede_nombre}
                </li>
              ))}
            </ul>
          )}

          <label htmlFor="serie" className="RegisterEquipoForm-p">6.  Ingrese el numero de serie (SN) del equipo:</label>
          <input
          type="text"
          id="serie"
          name="serie"
          value={equipoData.serie}
          onChange={handleChange}
          className="RegisterEquipoForm-rectangle-3" />

          <label htmlFor="ubicacion" className="RegisterEquipoForm-text-wrapper-2">7.  Ingrese la ubicación dentro de la Sede para el equipo:</label>
          <input
          type="text"
          id="ubicacion"
          name="ubicacion"
          value={equipoData.ubicacion}
          onChange={handleChange}
          className="RegisterEquipoForm-rectangle-4" />



          <label htmlFor="frecuencia" className="RegisterEquipoForm-text-wrapper-3">8.  Ingrese la frecuencia en meses para el mantenimiento dell equipo:</label>
          <input
          type="number"
          id="frecuencia"
          name="frecuencia"
          value={equipoData.frecuencia}
          onChange={handleChange}
          className="RegisterEquipoForm-rectangle-5" />



          <label htmlFor="modelo_equipos" className="RegisterEquipoForm-text-wrapper-4">2.  Seleccione el Modelo de Equipo a relacionar: *</label>
                <input
                  type="text"
                  id="modelo_equipos"
                  name="modelo_equipos"
                  value={modeloKeyword}
                  onChange={(e) => setModeloKeyword(e.target.value)}
                  className="RegisterEquipoForm-rectangle-6"
                  autoComplete="off"
                  placeholder="Buscar Modelo..."
                />
                {modeloResults.length > 0 && (
                  <ul className="RegisterEquipoForm-search-results-modelo">
                    {modeloResults.map((modelo) => (
                      <li className="RegisterEquipoForm-search-item-modelo" key={modelo._id} onClick={() => handleSelectModelo(modelo)} >
                        {modelo.modelo}
                      </li>
                    ))}
                  </ul>
                )}

          {/* Campo de búsqueda de área */}
          <label htmlFor="id_area" className="RegisterEquipoForm-text-wrapper-5">3.  Seleccione el Área de Equipo a relacionar: *</label>
          <input
            type="text"
            id="id_area"
            name="id_area"
            value={areaKeyword}
            onChange={(e) => setAreaKeyword(e.target.value)}
            className="RegisterEquipoForm-rectangle-7"
            autoComplete="off"
            placeholder="Buscar Área..."
          />
          {areaResults.length > 0 && (
            <ul className="RegisterEquipoForm-search-results-areas">
              {areaResults.map((area) => (
                <li className="RegisterEquipoForm-search-item-areas" key={area._id} onClick={() => handleSelectArea(area)} >
                  {area.area}
                </li>
              ))}
            </ul>
          )}

          {/* Campo de búsqueda de tipo */}
          <label htmlFor="id_tipo" className="RegisterEquipoForm-text-wrapper-6">5.  Seleccione el Tipo de Equipo a relacionar: *</label>
          <input
            type="text"
            id="id_tipo"
            name="id_tipo"
            value={tipoKeyword}
            onChange={(e) => setTipoKeyword(e.target.value)}
            className="RegisterEquipoForm-rectangle-8"
            autoComplete="off"
            placeholder="Buscar Tipo..."
          />
          {tipoResults.length > 0 && (
            <ul className="RegisterEquipoForm-search-results-tipos">
              {tipoResults.map((tipo) => (
                <li className="RegisterEquipoForm-search-item-tipos" key={tipo._id} onClick={() => handleSelectTipo(tipo)} >
                  {tipo.tipo}
                </li>
              ))}
            </ul>
          )}


          <label htmlFor="activo_fijo" className="RegisterEquipoForm-activo-fijo-label">9.  Ingrese el valor del Activo Fijo:</label>
          <input
          type="text"
          id="activo_fijo"
          name="activo_fijo"
          value={equipoData.activo_fijo}
          onChange={handleChange}
          className="RegisterEquipoForm-activo-fijo-input" />

          <label htmlFor="mtto" className="RegisterEquipoForm-mtto-label">4.  Ingrese el valor del MTTO:</label>
          <input
          type="text"
          id="mtto"
          name="mtto"
          value={equipoData.mtto}
          onChange={handleChange}
          className="RegisterEquipoForm-mtto-input" />


          <div className="RegisterEquipoForm-div-wrapper">
            <button 
             className="RegisterEquipoForm-text-wrapper-7"
             onClick={() => navigate('/equipos')}>CANCELAR</button>
          </div>
          <div className="RegisterEquipoForm-overlap-2">
            <button type="submit" className="RegisterEquipoForm-text-wrapper-8">REGISTRAR</button>
          </div>
        </div>
      </form>
    </div>




    </div>
  );
};

export default RegisterEquipoForm;
