import React, { useEffect, useState } from 'react';
import { updatePreventivo } from '../../services/preventivosService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { searchCamposByKeyword, searchPreventivosByKeyword } from '../../services/searchProcesos&ProtocolosService';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import './styles/EditPreventivoButton.css'
import { Campo } from '../../utils/types/Campo.type';

type EditPreventivoButtonProps = {
  preventivoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditPreventivoButton: React.FC<EditPreventivoButtonProps> = ({
  preventivoId,
  onEditSuccess,
  onCancel,
  initialData,
}) => {

  const transformedCuantitativos = initialData.cuantitativo.map((cq: any) => {
    // Verifica si 'campo' existe y si tiene una propiedad 'title'
    const title = cq.campo && cq.campo.title ? cq.campo.title : cq.title;
    return {
      title: title,
      minimo: cq.minimo,
      maximo: cq.maximo,
      unidad: cq.unidad,
    };
  });
  
  const [preventivoData, setPreventivoData] = useState({
    _id: initialData._id,
    title: initialData.title,
    codigo: initialData.codigo,
    version: initialData.version,
    fecha: initialData.fecha,
    cualitativo: initialData.cualitativo,
    mantenimiento: initialData.mantenimiento,
    cuantitativo: transformedCuantitativos,
    otros: initialData.otros,
  });

  const [cualitativoResults, setCualitativoResults] = useState<any[]>([]); // Resultados del buscador cualitativo
  const [selectedCualitativoIndex, setSelectedCualitativoIndex] = useState<number | null>(null); // Índice del elemento seleccionado
  const [selectedCualitativo, setSelectedCualitativo] = useState<string | null>(null);

  const [mantenimientoResults, setMantenimientoResults] = useState<any[]>([]); // Resultados del buscador cualitativo
  const [selectedMantenimientoIndex, setSelectedMantenimientoIndex] = useState<number | null>(null); // Índice del elemento seleccionado
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<string | null>(null);

  const [cuantitativoResults, setCuantitativoResults] = useState<any[]>([]); // Resultados del buscador cuantitativo
  const [selectedCuantitativoIndex, setSelectedCuantitativoIndex] = useState<number | null>(null); // Índice del elemento seleccionado
  const [selectedCuantitativo, setSelectedCuantitativo] = useState<string | null>(null);

  // Estados para la lógica de OTROS
  const [otrosResults, setOtrosResults] = useState<any[]>([]); // Resultados del buscador de otros
  const [selectedOtrosIndex, setSelectedOtrosIndex] = useState<number | null>(null); // Índice del elemento seleccionado de otros
  const [selectedOtros, setSelectedOtros] = useState<string | null>(null); // Elemento seleccionado de otros



  const loggedIn = useSessionStorage('sessionJWTToken');

  // Función para manejar la creación del preventivo
  const handleEdit = async () => {
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

      // Llamar a la función de actualización
      await updatePreventivo(token, preventivoId, mappedData);
      onEditSuccess();

      // Mostrar la alerta y recargar la página después de 2 segundos
      window.alert(`Preventivo ID: ${preventivoData._id} actualizado satisfactoriamente`);
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milisegundos (2 segundos)
    } catch (error) {
      console.error('Error al editar el preventivo:', error);
    }
  };

  // Lógica para agregar y eliminar CUALITATIVO
  const handleCualitativoChange = (index: number, newValue: string) => {
    const updatedCualitativo = [...preventivoData.cualitativo];
    updatedCualitativo[index].title = newValue;
    setPreventivoData({ ...preventivoData, cualitativo: updatedCualitativo });
    // Limpiar los resultados y el índice seleccionado al cambiar el valor manualmente
    setCualitativoResults([]);
    setSelectedCualitativoIndex(null);
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
  };

  const handleRemoveCualitativo = (index: number) => {
    const updatedCualitativo = [...preventivoData.cualitativo];
    updatedCualitativo.splice(index, 1);
    setPreventivoData({ ...preventivoData, cualitativo: updatedCualitativo });
    // Limpiar los resultados y el índice seleccionado al eliminar
    setCualitativoResults([]);
    setSelectedCualitativoIndex(null); 
  };

  // Lógica para agregar y eliminar MANTENIMIENTO
const handleMantenimientoChange = (index: number, newValue: string) => {
  const updatedMantenimiento = [...preventivoData.mantenimiento];
  updatedMantenimiento[index].title = newValue;
  setPreventivoData({ ...preventivoData, mantenimiento: updatedMantenimiento });
  // Limpiar los resultados y el índice seleccionado al cambiar el valor manualmente
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
  };


const handleRemoveMantenimiento = (index: number) => {
  const updatedMantenimiento = [...preventivoData.mantenimiento];
  updatedMantenimiento.splice(index, 1);
  setPreventivoData({ ...preventivoData, mantenimiento: updatedMantenimiento });
  // Limpiar los resultados y el índice seleccionado al eliminar
  setMantenimientoResults([]);
  setSelectedMantenimiento(null);
};


const handleCuantitativoChange = (index: number, field: string, value: string | number) => {
  let updatedCuantitativos = [...preventivoData.cuantitativo];
  // Si field es 'title', actualizar directamente el title sin usar 'campo'
  if (field === 'title') {
    updatedCuantitativos[index][field] = value;
  } else {
    // Para otros campos como minimo, maximo, unidad, actualizar esos campos directamente
    updatedCuantitativos[index] = { ...updatedCuantitativos[index], [field]: value };
  }
  setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativos });
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
    }
  };

  
const handleRemoveCuantitativo = (index: number) => {
  const updatedCuantitativo = [...preventivoData.cuantitativo];
  updatedCuantitativo.splice(index, 1);
  setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativo });
  // Limpiar los resultados y el índice seleccionado al eliminar
  setCuantitativoResults([]);
  setSelectedCuantitativoIndex(null);
};


// Lógica para agregar y eliminar OTROS
const handleOtrosChange = (index: number, newValue: string) => {
  const updatedOtros = [...preventivoData.otros];
  updatedOtros[index].title = newValue;
  setPreventivoData({ ...preventivoData, otros: updatedOtros });
  // Limpiar los resultados y el índice seleccionado al cambiar el valor manualmente
  setOtrosResults([]);
  setSelectedOtrosIndex(null);
};

useEffect(() => {
  // Actualiza los resultados cada vez que cambia el valor de selectedOtros
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
  // Agregar el campo seleccionado a la lista
  const updatedOtros = [...preventivoData.otros, { _id: '', id_tipo: '', title }];
  setPreventivoData({ ...preventivoData, otros: updatedOtros });
  // Limpiar el campo seleccionado al agregar
  setSelectedOtros(null);
};

const handleRemoveOtros = (index: number) => {
  const updatedOtros = [...preventivoData.otros];
  updatedOtros.splice(index, 1);
  setPreventivoData({ ...preventivoData, otros: updatedOtros });
  // Limpiar los resultados y el índice seleccionado al eliminar
  setOtrosResults([]);
  setSelectedOtrosIndex(null);
};


  return (
    <div className="EditPreventivoButton-box">
      <div className="EditPreventivoButton-box-1">
      <div className="EditPreventivoButton-edit-preventivo">
        <div className="EditPreventivoButton-overlap">
          <div className="EditPreventivoButton-overlap-group">
            <p className="EditPreventivoButton-preventivo-title">ACTUALIZAR PREVENTIVO - {preventivoData.title}</p>
            <div className="EditPreventivoButton-preventivo-id">ID: {preventivoData._id}</div>
          </div>
          <p className="EditPreventivoButton-title-p">1.  Ingrese el titulo del Preventivo:</p>
          <input 
          className="EditPreventivoButton-title-input"
          type="text"
          value={preventivoData.title}
          onChange={(e) => setPreventivoData({ ...preventivoData, title: e.target.value })}
           />
          <div className="EditPreventivoButton-codigo-p">2.  Ingrese el codigo:</div>
          <input 
          className="EditPreventivoButton-codigo-input"
          type='text'
          value={preventivoData.codigo}
          onChange={(e) => setPreventivoData({ ...preventivoData, codigo: e.target.value })}
           />
          <div className="EditPreventivoButton-version-p">3.  Ingrese la versión:</div>
          <input 
          className="EditPreventivoButton-version-input"
          type='number'
          value={preventivoData.version}
          onChange={(e) => setPreventivoData({ ...preventivoData, version: e.target.value })}
          />
          <p className="EditPreventivoButton-date-p">4.  Ingrese la fecha de creación:</p>
          <input
          className="EditPreventivoButton-date-input" 
          type='date'
          value={preventivoData.fecha}
          onChange={(e) => setPreventivoData({ ...preventivoData, fecha: e.target.value })}
          />


          <div className="EditPreventivoButton-separator" />


          <div className="EditPreventivoButton-div">

            {/* CUALITATIVO LOGIC */}
            <div className="EditPreventivoButton-cualitativo-space">
              <div className="EditPreventivoButton-cualitativos-p">5.  Edite los campos cualitativos:</div>
          {preventivoData.cualitativo.map((item: any, index: number) => (
              <div key={index}>
                <input 
                className="EditPreventivoButton-x-wrapper"
                type='text'
                value={item.title}
                readOnly={true}
                onChange={(e) => handleCualitativoChange(index, e.target.value)}
                >
                </input>
                  <ClearOutlinedIcon className="EditPreventivoButton-x"  onClick={() => handleRemoveCualitativo(index)}/>
              </div>
                ))}

                <input className="EditPreventivoButton-cualitativo-selected"
                type="text"
                placeholder="Buscar Cualitativo"
                value={selectedCualitativo || ''}
                onChange={(e) => setSelectedCualitativo(e.target.value)}
                />
                {cualitativoResults.length > 0 && (
                <ul>
                  {cualitativoResults.map((result, index) => (
                    <li className="EditPreventivoButton-cualitativo-result" key={index} onClick={() => handleSelectCualitativo(result.title)}>
                      {result.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className='EditPreventivoButton-separator'/>

          {/* MANTENIMIENTO LOGIC */}
            <div className="EditPreventivoButton-mantenimiento-space">
              <div className="EditPreventivoButton-mantenimiento-p">6.  Edite los campos de mantenimiento:</div>
          {preventivoData.mantenimiento.map((item: any, index: number) => (
              <div key={index}>
                <input 
                className="EditPreventivoButton-mantenimiento-x-wrapper"
                type='text'
                value={item.title}
                readOnly={true}
                onChange={(e) => handleMantenimientoChange(index, e.target.value)}
                >
                </input>
                  <ClearOutlinedIcon className="EditPreventivoButton-mantenimiento-x"  onClick={() => handleRemoveMantenimiento(index)}/>
              </div>
                ))}

                <input className="EditPreventivoButton-mantenimiento-selected"
                type="text"
                placeholder="Buscar Mantenimiento"
                value={selectedMantenimiento || ''}
                onChange={(e) => setSelectedMantenimiento(e.target.value)}
                />
                {mantenimientoResults.length > 0 && (
                <ul>
                  {mantenimientoResults.map((result, index) => (
                    <li className="EditPreventivoButton-mantenimiento-result" key={index} onClick={() => handleSelectMantenimiento(result.title)}>
                      {result.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className='EditPreventivoButton-separator2'/>

            {/* CUANTITATIVO LOGIC */}
            <div className="EditPreventivoButton-cuantitativo-space">
              <div className="EditPreventivoButton-cuantitativo-p">7.  Edite los campos cuantitativos:</div>
            {preventivoData.cuantitativo.map((item: any, index: number) => (

              <div className="EditPreventivoButton-cuantitativo" key={index}>
                <input 
                className="EditPreventivoButton-cuantitativo-search"
                type="text"
                value={item.title}
                onChange={(e) => handleCuantitativoChange(index, 'title', e.target.value)}
                readOnly={true}
                />
                <input 
                className="EditPreventivoButton-img"
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
                className="EditPreventivoButton-cuantitativo-search-2"
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
                className="EditPreventivoButton-cuantitativo-search-3"
                type="text"
                value={item.unidad}  
                onChange={(e) => {
                  const updatedCuantitativo = [...preventivoData.cuantitativo];
                  updatedCuantitativo[index].unidad = e.target.value;
                  setPreventivoData({ ...preventivoData, cuantitativo: updatedCuantitativo });
                }}
                placeholder={item.unidad}
                />
                <ClearOutlinedIcon className="EditPreventivoButton-x-2" onClick={() => handleRemoveCuantitativo(index)}/>
                <div className="EditPreventivoButton-text-wrapper">mínimo</div>
                <div className="EditPreventivoButton-text-wrapper-2">cuantitativo</div>
                <div className="EditPreventivoButton-text-wrapper-3">máximo</div>
                <div className="EditPreventivoButton-unidad"> unidad</div>
              </div>
              ))}
              <input className="EditPreventivoButton-cuantitativo-selected-2"
              type="text"
              placeholder="Buscar Cuantitativo"
              value={selectedCuantitativo || ''}
              onChange={(e) => setSelectedCuantitativo(e.target.value)}
              />
              {/* Resultados del buscador como opciones de una lista */}
              {cuantitativoResults.length > 0 && (
              <ul>
                {cuantitativoResults.map((result, index) => (
                  <li className="EditPreventivoButton-cualitativo-result-2" key={index} onClick={() => handleSelectCuantitativo(result.title)}>
                    {result.title}
                  </li>
                ))}
              </ul>
            )}

            </div>
            <div className='EditPreventivoButton-separator3'/>

             {/* OTROS LOGIC */}
             <div className="EditPreventivoButton-otros-space">
              <div className="EditPreventivoButton-otros-p">8.  Edite los campos de OTROS:</div>
          {preventivoData.otros.map((item: any, index: number) => (
              <div key={index}>
                <input 
                className="EditPreventivoButton-otros-x-wrapper"
                type='text'
                value={item.title}
                readOnly={true}
                onChange={(e) => handleOtrosChange(index, e.target.value)}
                >
                </input>
                  <ClearOutlinedIcon className="EditPreventivoButton-otros-x"  onClick={() => handleRemoveOtros(index)}/>
              </div>
                ))}

                <input className="EditPreventivoButton-otros-selected"
                type="text"
                placeholder="Buscar Otros"
                value={selectedOtros || ''}
                onChange={(e) => setSelectedOtros(e.target.value)}
                />
                {otrosResults.length > 0 && (
                <ul>
                  {otrosResults.map((result, index) => (
                    <li className="EditPreventivoButton-otros-result" key={index} onClick={() => handleSelectOtros(result.title)}>
                      {result.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>


          </div>
          <button className="EditPreventivoButton-update-cancelar" onClick={onCancel} >CANCELAR</button> 
          <button className="EditPreventivoButton-actualizar-button" onClick={handleEdit} >ACTUALIZAR</button>
        </div>
      </div>
    </div>

    </div>
  );
};

export default EditPreventivoButton;
