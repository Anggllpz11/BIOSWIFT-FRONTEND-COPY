import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createPreventivo } from '../../../services/preventivosService';
import { searchCamposByKeyword } from '../../../services/searchProcesos&ProtocolosService';
import { useNavigate } from 'react-router-dom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import './styles/RegisterPreventivoForm.css'
import { Campo } from '../../../utils/types/Campo.type';


const RegisterPreventivoForm: React.FC = () => {
  const [preventivoData, setPreventivoData] = useState<any>({
    title: '',
    codigo: '',
    version: '',
    fecha: '',
    cualitativo: [],
    mantenimiento: [],
    cuantitativo: [],
    otros: [],
  });

  const [cualitativoResults, setCualitativoResults] = useState<any[]>([]);
  const [selectedCualitativo, setSelectedCualitativo] = useState<string | null>(null);

  const [mantenimientoResults, setMantenimientoResults] = useState<any[]>([]);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<string | null>(null);

  const [cuantitativoResults, setCuantitativoResults] = useState<any[]>([]);
  const [selectedCuantitativo, setSelectedCuantitativo] = useState<string | null>(null);

  const [otrosResults, setOtrosResults] = useState<any[]>([]);
  const [selectedOtros, setSelectedOtros] = useState<string | null>(null);

  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleCreatePreventivo = async () => {
    try {
      const token = loggedIn;

      // Mapear los campos relacionados al formato correcto
      const mappedData = {
        title: preventivoData.title,
        codigo: preventivoData.codigo,
        version: preventivoData.version,
        fecha: preventivoData.fecha,
        cualitativo: preventivoData.cualitativo.map((item: any) => item.title),
        mantenimiento: preventivoData.mantenimiento.map((item: any) => item.title),
        cuantitativo: preventivoData.cuantitativo.map((item: any) => ({
          title: item.title,
          minimo: item.minimo,
          maximo: item.maximo,
          unidad: item.unidad,
        })),
        otros: preventivoData.otros.map((item: any) => item.title),
      };

      // Llamar a la función de creación
      await createPreventivo(token, mappedData);

      // Mostrar la alerta y recargar la página después de 2 segundos
      window.alert('Preventivo creado satisfactoriamente');

      navigate('/preventivos');
      
    } catch (error) {
      console.error('Error al crear el preventivo:', error);
    }
  };

  const onCancel = () => {
    navigate('/preventivos');
  };

  const handleCualitativoChange = (index: number, newValue: string) => {
    const updatedCualitativo = [...preventivoData.cualitativo];
    updatedCualitativo[index].title = newValue;
    setPreventivoData({ ...preventivoData, cualitativo: updatedCualitativo });
    setCualitativoResults([]);
    setSelectedCualitativo(null);
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (selectedCualitativo) {
        try {
          const token = loggedIn;
          const results: Campo[] = await searchCamposByKeyword(token, selectedCualitativo);
          const filteredResults = results.filter(result =>
            result.id_tipo && result.id_tipo.nombre === 'Pasó ó Falló'
          );
          setCualitativoResults(filteredResults);
        } catch (error) {
          console.error('Error al buscar cualitativos:', error);
        }
      }
    };
  
    handleSearch();
  }, [loggedIn, selectedCualitativo]);
  

  const handleSelectCualitativo = (title: string) => {
    // Añadir el campo seleccionado al array de cualitativo
    const updatedCualitativo = [...preventivoData.cualitativo, { title }];
    setPreventivoData({ ...preventivoData, cualitativo: updatedCualitativo });
    setSelectedCualitativo(null);
    setCualitativoResults([]);

  };

  const handleRemoveCualitativo = (index: number) => {
    const updatedCualitativo = [...preventivoData.cualitativo];
    updatedCualitativo.splice(index, 1);
    setPreventivoData({ ...preventivoData, cualitativo: updatedCualitativo });
    setCualitativoResults([]);
    setSelectedCualitativo(null);
  };

  // Lógica para agregar y eliminar MANTENIMIENTO
  const handleMantenimientoChange = (index: number, newValue: string) => {
    const updatedMantenimiento = [...preventivoData.mantenimiento];
    updatedMantenimiento[index].title = newValue;
    setPreventivoData({ ...preventivoData, mantenimiento: updatedMantenimiento });
    setMantenimientoResults([]);
    setSelectedMantenimiento(null);
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (selectedMantenimiento) {
        try {
          const token = loggedIn;
          const results: Campo[] = await searchCamposByKeyword(token, selectedMantenimiento);
          const filteredResults = results.filter(result =>
            result.id_tipo && result.id_tipo.nombre === 'Pasó ó Falló'
          );
          setMantenimientoResults(filteredResults);
        } catch (error) {
          console.error('Error al buscar mantenimientos:', error);
        }
      }
    };
  
    handleSearch();
  }, [loggedIn, selectedMantenimiento]);
  
  const handleSelectMantenimiento = (title: string) => {
    // Añadir el campo seleccionado al array de mantenimiento
    const updatedMantenimiento = [...preventivoData.mantenimiento, { title }];
    setPreventivoData({ ...preventivoData, mantenimiento: updatedMantenimiento });
    setSelectedMantenimiento(null);
    setMantenimientoResults([]);

  };
  
  const handleRemoveMantenimiento = (index: number) => {
    const updatedMantenimiento = [...preventivoData.mantenimiento];
    updatedMantenimiento.splice(index, 1);
    setPreventivoData({ ...preventivoData, mantenimiento: updatedMantenimiento });
    setMantenimientoResults([]);
    setSelectedMantenimiento(null);
  };

  // Lógica para agregar y eliminar CUANTITATIVO
  const handleCuantitativoChange = (index: number, newValue: string) => {
    const updatedCuantitativo = [...preventivoData.cuantitativo];

    if (updatedCuantitativo[index].campo) {
      updatedCuantitativo[index].campo.title = newValue;
      setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativo });
    }

    setCuantitativoResults([]);
    setSelectedCuantitativo(null);
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (selectedCuantitativo) {
        try {
          const token = loggedIn;
          const results: Campo[] = await searchCamposByKeyword(token, selectedCuantitativo);
          const filteredResults = results.filter(result =>
            result.id_tipo && result.id_tipo.nombre === 'Cuantitativo'
          );
          setCuantitativoResults(filteredResults);
        } catch (error) {
          console.error('Error al buscar cuantitativos:', error);
        }
      }
    };
  
    handleSearch();
  }, [loggedIn, selectedCuantitativo]);
  
  const handleSelectCuantitativo = (title: string) => {
    const selectedCuantitativo = cuantitativoResults.find(result => result.title === title);
    
    if (selectedCuantitativo) {
      const updatedCuantitativos = [
        ...preventivoData.cuantitativo,
        {
          title: selectedCuantitativo.title, // El título se extrae del item seleccionado
          minimo: '', // Inicializamos minimo, maximo y unidad con valores vacíos
          maximo: '',
          unidad: ''
        }
      ];
      setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativos });
      setSelectedCuantitativo(null);
      setCuantitativoResults([]);

    }
  };
  
  
  const handleRemoveCuantitativo = (index: number) => {
    const updatedCuantitativo = [...preventivoData.cuantitativo];
    updatedCuantitativo.splice(index, 1);
    setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativo });
    setCuantitativoResults([]);
    setSelectedCuantitativo(null);
  };

  // Lógica para agregar y eliminar OTROS
  const handleOtrosChange = (index: number, newValue: string) => {
    const updatedOtros = [...preventivoData.otros];
    updatedOtros[index].title = newValue;
    setPreventivoData({ ...preventivoData, otros: updatedOtros });
    setOtrosResults([]);
    setSelectedOtros(null);
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (selectedOtros) {
        try {
          const token = loggedIn;
          const results = await searchCamposByKeyword(token, selectedOtros);
          setOtrosResults(results);
        } catch (error) {
          console.error('Error al buscar de otros:', error);
        }
      }
    };

    handleSearch();
  }, [loggedIn, selectedOtros]);

  const handleSelectOtros = (title: string) => {
    const updatedOtros = [...preventivoData.otros, { _id: '', id_tipo: '', title }];
    setPreventivoData({ ...preventivoData, otros: updatedOtros });
    setSelectedOtros(null);
    setOtrosResults([]);
  };

  const handleRemoveOtros = (index: number) => {
    const updatedOtros = [...preventivoData.otros];
    updatedOtros.splice(index, 1);
    setPreventivoData({ ...preventivoData, otros: updatedOtros });
    setOtrosResults([]);
    setSelectedOtros(null);
  };

return (
  <div className="RegisterPreventivoForm-box">
  <div className="RegisterPreventivoForm-box-1">
  <div className="RegisterPreventivoForm-edit-preventivo">
    <div className="RegisterPreventivoForm-overlap">
      <div className="RegisterPreventivoForm-overlap-group">
        <p className="RegisterPreventivoForm-preventivo-title">REGISTRAR NUEVO PREVENTIVO</p>
        <div className="RegisterPreventivoForm-preventivo-id"></div>
      </div>
      <p className="RegisterPreventivoForm-title-p">1.  Ingrese el titulo del nuevo Preventivo:</p>
      <input 
      className="RegisterPreventivoForm-title-input"
      type="text"
      value={preventivoData.title}
      onChange={(e) => setPreventivoData({ ...preventivoData, title: e.target.value })}
       />
      <div className="RegisterPreventivoForm-codigo-p">2.  Ingrese el codigo:</div>
      <input 
      className="RegisterPreventivoForm-codigo-input"
      type='text'
      value={preventivoData.codigo}
      onChange={(e) => setPreventivoData({ ...preventivoData, codigo: e.target.value })}
       />
      <div className="RegisterPreventivoForm-version-p">3.  Ingrese la versión:</div>
      <input 
      className="RegisterPreventivoForm-version-input"
      type='number'
      value={preventivoData.version}
      onChange={(e) => setPreventivoData({ ...preventivoData, version: e.target.value })}
      />
      <p className="RegisterPreventivoForm-date-p">4.  Ingrese la fecha de creación:</p>
      <input
      className="RegisterPreventivoForm-date-input" 
      type='date'
      value={preventivoData.fecha}
      onChange={(e) => setPreventivoData({ ...preventivoData, fecha: e.target.value })}
      />


      <div className="RegisterPreventivoForm-separator" />


      <div className="RegisterPreventivoForm-div">

        {/* CUALITATIVO LOGIC */}
        <div className="RegisterPreventivoForm-cualitativo-space">
          <div className="RegisterPreventivoForm-cualitativos-p">5.  Registre los campos cualitativos:</div>
          {preventivoData.cualitativo.map((item: any, index: number) => (
              <div key={index}>
                <input 
                  className="RegisterPreventivoForm-x-wrapper"
                  type='text'
                  value={item.title}
                  readOnly={true}
                  onChange={(e) => handleCualitativoChange(index, e.target.value)}
                />
                <ClearOutlinedIcon 
                  className="RegisterPreventivoForm-x"  
                  onClick={() => handleRemoveCualitativo(index)}
                />
              </div>
              ))}

            <input className="RegisterPreventivoForm-cualitativo-selected"
            type="text"
            placeholder="Buscar Cualitativo"
            value={selectedCualitativo || ''}
            onChange={(e) => setSelectedCualitativo(e.target.value)}
            />
            {cualitativoResults.length > 0 && (
            <ul>
              {cualitativoResults.map((result, index) => (
                <li className="RegisterPreventivoForm-cualitativo-result" key={index} onClick={() => handleSelectCualitativo(result.title)}>
                  {result.title}
                </li>
              ))}
            </ul>
          )}
       
        </div>

      {/* MANTENIMIENTO LOGIC */}
        <div className="RegisterPreventivoForm-mantenimiento-space">
          <div className="RegisterPreventivoForm-mantenimiento-p">6.  Registre los campos de mantenimiento:</div>
      {preventivoData.mantenimiento.map((item: any, index: number) => (
          <div key={index}>
            <input 
            className="RegisterPreventivoForm-mantenimiento-x-wrapper"
            type='text'
            value={item.title}
            readOnly={true}
            onChange={(e) => handleMantenimientoChange(index, e.target.value)}
            >
            </input>
              <ClearOutlinedIcon className="RegisterPreventivoForm-mantenimiento-x"  onClick={() => handleRemoveMantenimiento(index)}/>
          </div>
            ))}

            <input className="RegisterPreventivoForm-mantenimiento-selected"
            type="text"
            placeholder="Buscar Mantenimiento"
            value={selectedMantenimiento || ''}
            onChange={(e) => setSelectedMantenimiento(e.target.value)}
            />
            {mantenimientoResults.length > 0 && (
            <ul>
              {mantenimientoResults.map((result, index) => (
                <li className="RegisterPreventivoForm-mantenimiento-result" key={index} onClick={() => handleSelectMantenimiento(result.title)}>
                  {result.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CUANTITATIVO LOGIC */}
        <div className="RegisterPreventivoForm-cuantitativo-space">
          <div className="RegisterPreventivoForm-cuantitativo-p">7.  Registre los campos cuantitativos:</div>
        {preventivoData.cuantitativo.map((item: any, index: number) => (

          <div className="RegisterPreventivoForm-cuantitativo" key={index}>
            <input 
            className="RegisterPreventivoForm-cuantitativo-search"
            type="text"
            value={item.title || ''}
            onChange={(e) => handleCuantitativoChange(index, e.target.value)}
            readOnly={true}
            />
            <input 
            className="RegisterPreventivoForm-img"
            type="number"
            value={item.minimo}
            onChange={(e) => {
              const updatedCuantitativo = [...preventivoData.cuantitativo];
              updatedCuantitativo[index].minimo = e.target.value;
              setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativo });
            }}
            placeholder="Minimo"
            />
            <input 
            className="RegisterPreventivoForm-cuantitativo-search-2"
            type="number"
            value={item.maximo}
            onChange={(e) => {
              const updatedCuantitativo = [...preventivoData.cuantitativo];
              updatedCuantitativo[index].maximo = e.target.value;
              setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativo });
            }}
            placeholder="Maximo"
            />
            <input 
            className="RegisterPreventivoForm-cuantitativo-search-3"
            type="text"
            value={item.unidad}  
            onChange={(e) => {
              const updatedCuantitativo = [...preventivoData.cuantitativo];
              updatedCuantitativo[index].unidad = e.target.value;
              setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativo });
            }}
            placeholder={item.unidad}
            />
            <ClearOutlinedIcon className="RegisterPreventivoForm-x-2" onClick={() => handleRemoveCuantitativo(index)}/>
            <div className="RegisterPreventivoForm-text-wrapper">mínimo</div>
            <div className="RegisterPreventivoForm-text-wrapper-2">cuantitativo</div>
            <div className="RegisterPreventivoForm-text-wrapper-3">máximo</div>
            <div className="RegisterPreventivoForm-unidad"> unidad</div>
          </div>
          ))}
          <input className="RegisterPreventivoForm-cuantitativo-selected-2"
          type="text"
          placeholder="Buscar Cuantitativo"
          value={selectedCuantitativo || ''}
          onChange={(e) => setSelectedCuantitativo(e.target.value)}
          />
          {/* Resultados del buscador como opciones de una lista */}
          {cuantitativoResults.length > 0 && (
          <ul>
            {cuantitativoResults.map((result, index) => (
              <li className="RegisterPreventivoForm-cualitativo-result-2" key={index} onClick={() => handleSelectCuantitativo(result.title)}>
                {result.title}
              </li>
            ))}
          </ul>
        )}

        </div>

         {/* OTROS LOGIC */}
         <div className="RegisterPreventivoForm-otros-space">
          <div className="RegisterPreventivoForm-otros-p">8.  Registre los campos de OTROS:</div>
      {preventivoData.otros.map((item: any, index: number) => (
          <div key={index}>
            <input 
            className="RegisterPreventivoForm-otros-x-wrapper"
            type='text'
            value={item.title}
            readOnly={true}
            onChange={(e) => handleOtrosChange(index, e.target.value)}
            >
            </input>
              <ClearOutlinedIcon className="RegisterPreventivoForm-otros-x"  onClick={() => handleRemoveOtros(index)}/>
          </div>
            ))}

            <input className="RegisterPreventivoForm-otros-selected"
            type="text"
            placeholder="Buscar Otros"
            value={selectedOtros || ''}
            onChange={(e) => setSelectedOtros(e.target.value)}
            />
            {otrosResults.length > 0 && (
            <ul>
              {otrosResults.map((result, index) => (
                <li className="RegisterPreventivoForm-otros-result" key={index} onClick={() => handleSelectOtros(result.title)}>
                  {result.title}
                </li>
              ))}
            </ul>
          )}
        </div>


      </div>
      <button className="RegisterPreventivoForm-update-cancelar" onClick={onCancel} >CANCELAR</button> 
      <button className="RegisterPreventivoForm-actualizar-button" onClick={handleCreatePreventivo} >REGISTRAR</button>
    </div>
  </div>
</div>

</div>
  );
};

export default RegisterPreventivoForm;
