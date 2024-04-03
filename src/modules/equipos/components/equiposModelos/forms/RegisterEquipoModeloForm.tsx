import React, { useState, FormEvent, useEffect } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createModeloEquipo } from '../../../services/equiposModeloService';
import './styles/RegisterEquipoModeloForm.css'
import { useNavigate } from 'react-router-dom';
import { searchClasesEquiposByKeyword, searchMarcasEquiposByKeyword } from '../../../services/searchEquiposService';
import { searchPreventivosByKeyword } from '../../../../procesos_&_protocolos/services/searchProcesos&ProtocolosService';

const RegisterEquipoModeloForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [modeloEquipoData, setModeloEquipoData] = useState({
    modelo: '',
    precio: 0,
    id_marca: '',
    id_clase: '',
    id_preventivo: '',
  });
  
  const [marcaKeyword, setMarcaKeyword] = useState('');
  const [marcaResults, setMarcaResults] = useState<any[]>([]);
  const [claseKeyword, setClaseKeyword] = useState('');
  const [claseResults, setClaseResults] = useState<any[]>([]);
  const [preventivoKeyword, setPreventivoKeyword] = useState('');
  const [preventivoResults, setPreventivoResults] = useState<any[]>([]);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Inicializa el arreglo de campos faltantes
    let fieldsMissing: string[] = [];

    // Verifica cada campo requerido y agrega a la lista si está vacío
    if (!modeloEquipoData.modelo) fieldsMissing.push("Nombre del Modelo");
    if (modeloEquipoData.precio <= 0) fieldsMissing.push("Precio");
    if (!modeloEquipoData.id_marca) fieldsMissing.push("Marca");
    if (!modeloEquipoData.id_clase) fieldsMissing.push("Clase");
    if (!modeloEquipoData.id_preventivo) fieldsMissing.push("Preventivo");

    // Si hay campos faltantes, muestra una alerta y detiene el envío
    if (fieldsMissing.length > 0) {
      setMissingFields(fieldsMissing); // Actualiza el estado para posiblemente usar en la UI
      window.alert(`Los siguientes campos son obligatorios y faltan por completar: ${fieldsMissing.join(", ")}`);
      return;
    }

    // Intenta registrar el modelo de equipo con los datos validados
    try {
      const token = loggedIn;
      await createModeloEquipo(token, modeloEquipoData);
      console.log('Modelo de equipo registrado exitosamente');
      window.alert('Modelo de equipo registrado exitosamente');
      navigate('/equipos/modelos');
    } catch (error) {
      console.error('Error al registrar el modelo de equipo:', error);
    }
  };

  const hancleCancelForm = () => {
    navigate('/equipos/modelos')
  };

  useEffect(() => {
    if (!loggedIn) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [loggedIn, navigate]);

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

  const handleSelectMarca = (marca: any) => {
    setModeloEquipoData({ ...modeloEquipoData, id_marca: marca._id });
    setMarcaKeyword(marca.marca); // Actualiza el campo de texto con el nombre de la marca seleccionada
    setMarcaResults([]); // Limpia los resultados de búsqueda después de seleccionar
  };

  const handleSelectClase = (clase: any) => {
    setModeloEquipoData({ ...modeloEquipoData, id_clase: clase._id });
    setClaseKeyword(clase.clase);
    setClaseResults([]);
  };

  const handleSelectPreventivo = (preventivo: any) => {
    setModeloEquipoData({ ...modeloEquipoData, id_preventivo: preventivo._id });
    setPreventivoKeyword(preventivo.title);
    setPreventivoResults([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModeloEquipoData({ ...modeloEquipoData, [name]: value });
  };



  return (
    <div>
      <div className="RegisterEquipoModeloForm-box">
      <form onSubmit={handleSubmit} className="RegisterEquipoModeloForm-registerequipomodelo">
        <div className="RegisterEquipoModeloForm-overlap-group">
          <div className="RegisterEquipoModeloForm-overlap">
            <p className="RegisterEquipoModeloForm-title">REGISTRAR NUEVO MODELO DE EQUIPO</p>
          </div>
          <div className="RegisterEquipoModeloForm-container-separator" />
          
          <label htmlFor="modelo" className="RegisterEquipoModeloForm-modelo-nombre-title">1. Ingrese el nombre del modelo de equipo</label>
          <input 
          className="RegisterEquipoModeloForm-modelo-nombre-input"
          type="text"
          id="modelo"
          name="modelo"
          value={modeloEquipoData.modelo}
          onChange={handleChange} />
          

          <label htmlFor="precio" className="RegisterEquipoModeloForm-modelo-precio-title">2. Ingrese el precio del modelo de equipo</label>
          <input 
          className="RegisterEquipoModeloForm-modelo-precio-input"
          type="number"
          id="precio"
          name="precio"
          value={modeloEquipoData.precio}
          onChange={handleChange}
          />

          <label htmlFor="marca" className="RegisterEquipoModeloForm-modelo-marca-title">3. Seleccione la Marca de Equipo a relacionar</label>
                <input 
                  className="RegisterEquipoModeloForm-modelo-marca-input"
                  type="text"
                  id="id_marca"
                  name="id_marca"
                  value={marcaKeyword}
                  onChange={(e) => setMarcaKeyword(e.target.value)}
                  placeholder='Buscar Marca...'
                  autoComplete="off"
                />
                {marcaResults.length > 0 && (
                  <ul className="RegisterEquipoModeloForm-search-marca-results">
                    {marcaResults.map((marca) => (
                      <li className="RegisterEquipoModeloForm-search-marca-item" key={marca._id} onClick={() => handleSelectMarca(marca)}>
                        {marca.marca}
                      </li>
                    ))}
                  </ul>
                )}
            
          
            <label htmlFor="clase" className="RegisterEquipoModeloForm-modelo-clase-title">4. Seleccione la Clase de Equipo a relacionar</label>
            <input 
              className="RegisterEquipoModeloForm-modelo-clase-input"
              type="text"
              id="id_clase"
              name="id_clase"
              value={claseKeyword}
              onChange={(e) => setClaseKeyword(e.target.value)}
              placeholder='Buscar Clase...'
              autoComplete="off"
            />
            {claseResults.length > 0 && (
              <ul className="RegisterEquipoModeloForm-search-clase-results">
                {claseResults.map((clase) => (
                  <li className="RegisterEquipoModeloForm-search-clase-item" key={clase._id} onClick={() => handleSelectClase(clase)}>
                    {clase.clase}
                  </li>
                ))}
              </ul>
            )}

          <label htmlFor="preventivo" className="RegisterEquipoModeloForm-modelo-preventivo-title">5. Seleccione el protocolo preventivo a relacionar</label>
            <input 
              className="RegisterEquipoModeloForm-modelo-preventivo-input"
              type="text"
              id="id_preventivo"
              name="id_preventivo"
              value={preventivoKeyword}
              onChange={(e) => setPreventivoKeyword(e.target.value)}
              placeholder='Buscar Preventivo...'
              autoComplete="off"
            />
            {preventivoResults.length > 0 && (
              <ul className="RegisterEquipoModeloForm-search-preventivo-results">
                {preventivoResults.map((preventivo) => (
                  <li className="RegisterEquipoModeloForm-search-preventivo-item" key={preventivo._id} onClick={() => handleSelectPreventivo(preventivo)}>
                    {preventivo.title}
                  </li>
                ))}
              </ul>
            )}
            
          <button 
          onClick={hancleCancelForm}
          className="RegisterEquipoModeloForm-modelo-canelar">Cancelar</button>
          <button 
          type='submit'
          className="RegisterEquipoModeloForm-modelo-registrar">Registrar</button>
        </div>
      </form>
    </div>


    </div>
  );
};

export default RegisterEquipoModeloForm;
