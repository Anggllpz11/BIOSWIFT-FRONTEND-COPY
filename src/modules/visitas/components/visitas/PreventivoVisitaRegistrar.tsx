import React, { useEffect, useState } from 'react';
import { getVisitaById, updateVisita } from '../../services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/PreventivoVisitaRegistrar.css'

interface CampoPreventivo {
  id_campo: string;
  title: string;
  resultado: string;
  tipo?: string;
  minimo?: number;
  maximo?: number;
  unidad?: string;
  medida?: number;

}

interface PreventivoVisitaRegistrarProps {
  idVisita: string;
  onActividadesUpdated: () => void;
}

const PreventivoVisitaRegistrar: React.FC<PreventivoVisitaRegistrarProps> = ({ idVisita, onActividadesUpdated }) => {
  const token = useSessionStorage('sessionJWTToken');
  const [isLoading, setIsLoading] = useState(true);
  const [camposPreventivos, setCamposPreventivos] = useState<CampoPreventivo[]>([]);
  const [camposMantenimiento, setCamposMantenimiento] = useState<CampoPreventivo[]>([]);
  const [camposCuantitativos, setCamposCuantitativos] = useState<CampoPreventivo[]>([]);
  const [camposOtros, setCamposOtros] = useState<CampoPreventivo[]>([]);


  useEffect(() => {
    const fetchDatos = async () => {
        setIsLoading(true);
        const visita = await getVisitaById(token, idVisita);

        if (visita && visita.id_orden && visita.id_orden[0] && visita.id_orden[0].id_solicitud_servicio && visita.id_orden[0].id_solicitud_servicio.id_equipo && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo) {
            const cualitativo = visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo.cualitativo;

            // Si cualitativo existe y es un array, mapearlo. Si no, usar un array vacío.
            const camposCualitativos = cualitativo && Array.isArray(cualitativo) ? cualitativo.map((campo) => ({
                id_campo: campo._id, // Aquí usamos _id como id_campo
                title: campo.title,
                tipo: 'Cualitativo', // Aquí extraemos el tipo desde id_tipo.tipo
                resultado: '',
            })) : [];

            setCamposPreventivos(camposCualitativos);
        }

        setIsLoading(false);
    };

    fetchDatos();
}, [token, idVisita]);


useEffect(() => {
  const fetchDatos = async () => {
      setIsLoading(true);
      const visita = await getVisitaById(token, idVisita);

      if (visita && visita.id_orden && visita.id_orden[0] && visita.id_orden[0].id_solicitud_servicio && visita.id_orden[0].id_solicitud_servicio.id_equipo && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo) {
          const mantenimiento = visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo.mantenimiento;

          // Si mantenimiento existe y es un array, mapearlo. Si no, usar un array vacío.
          const camposMantenimiento = mantenimiento && Array.isArray(mantenimiento) ? mantenimiento.map((campo) => ({
              id_campo: campo._id, // Aquí usamos _id como id_campo
              title: campo.title,
              tipo: 'Mantenimiento', // Aquí extraemos el tipo desde id_tipo.tipo
              resultado: '',
          })) : [];

          setCamposMantenimiento(camposMantenimiento);
      }

      setIsLoading(false);
  };

  fetchDatos();
}, [token, idVisita]);

  
useEffect(() => {
  const fetchDatosCuantitativos = async () => {
      setIsLoading(true);
      const visita = await getVisitaById(token, idVisita);

      if (visita && visita.id_orden[0] && visita.id_orden[0].id_solicitud_servicio && visita.id_orden[0].id_solicitud_servicio.id_equipo && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo) {
          const cuantitativo = visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo.cuantitativo;

          // Si cuantitativo existe y es un array, mapearlo. Si no, usar un array vacío.
          const camposCuantitativos = cuantitativo && Array.isArray(cuantitativo) ? cuantitativo.map((item) => ({
              id_campo: item.campo._id, // Usando _id del objeto campo para id_campo
              title: item.campo.title,
              tipo: 'Cuantitativo', // Extrayendo el tipo de id_tipo
              resultado: '', // Esto se ajustará más adelante según sea necesario
              minimo: item.minimo,
              maximo: item.maximo,
              unidad: item.unidad,
              medida: 0,
          })) : [];

          setCamposCuantitativos(camposCuantitativos);
      }

      setIsLoading(false);
  };

  fetchDatosCuantitativos();
}, [token, idVisita]);

useEffect(() => {
  const fetchDatosOtros = async () => {
    setIsLoading(true);
    const visita = await getVisitaById(token, idVisita);

    if (visita && visita.id_orden[0] && visita.id_orden[0].id_solicitud_servicio && visita.id_orden[0].id_solicitud_servicio.id_equipo && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos && visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo) {
      const otros = visita.id_orden[0].id_solicitud_servicio.id_equipo.modelo_equipos.id_preventivo.otros;

      const camposOtros = otros && Array.isArray(otros) ? otros.map((campo) => ({
        id_campo: campo._id,
        title: campo.title,
        tipo: 'Otros',
        resultado: '',
      })) : [];

      setCamposOtros(camposOtros);
    }

    setIsLoading(false);
  };

  fetchDatosOtros();
}, [token, idVisita]);


const handleMedicionChange = (index: number, medida: string) => {
  const medidaNumerica = parseFloat(medida); // Convertir la entrada a número
  if (!isNaN(medidaNumerica)) {
    const updatedCampos = [...camposCuantitativos];
    const campo = updatedCampos[index];

    // Asumimos valores predeterminados para minimo y maximo en caso de que no estén definidos
    const minimo = campo.minimo || 0;
    const maximo = campo.maximo || 0;

    // Actualizar la medida
    campo.medida = medidaNumerica;

    // Validar si la medida está en el rango esperado
    campo.resultado = (medidaNumerica >= minimo && medidaNumerica <= maximo) ? 'paso' : 'fallo';

    setCamposCuantitativos(updatedCampos);
  }
};


const handleResultadoChange = (index: number, resultado: 'paso' | 'fallo' | 'n/a', tipo: 'cualitativo' | 'mantenimiento' | 'cuantitativo' | 'otros', medidaInput?: string) => {
  let updatedCampos = [];

  switch (tipo) {
    case 'cualitativo':
      updatedCampos = [...camposPreventivos];
      break;
    case 'mantenimiento':
      updatedCampos = [...camposMantenimiento];
      break;
    case 'cuantitativo':
      updatedCampos = [...camposCuantitativos];
      // Convertir la medidaInput a número y realizar la validación
      const medidaNumerica = medidaInput ? parseFloat(medidaInput) : 0;
      const { minimo = 0, maximo = 0 } = updatedCampos[index]; // Usamos valores predeterminados para evitar NaN
      updatedCampos[index].resultado = (medidaNumerica >= minimo && medidaNumerica <= maximo) ? 'paso' : 'fallo';
      break;
    case 'otros':
      updatedCampos = [...camposOtros];
      break;
  }

  updatedCampos[index].resultado = resultado;

  switch (tipo) {
    case 'cualitativo':
      setCamposPreventivos(updatedCampos);
      break;
    case 'mantenimiento':
      setCamposMantenimiento(updatedCampos);
      break;
    case 'cuantitativo':
      setCamposCuantitativos(updatedCampos);
      break;
    case 'otros':
      setCamposOtros(updatedCampos);
      break;
  }
};


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Combinar todos los campos en un solo array para facilitar la verificación
  const todosLosCampos = [...camposPreventivos, ...camposMantenimiento, ...camposCuantitativos, ...camposOtros];

  // Verificar si algún campo está incompleto
  const algunCampoIncompleto = todosLosCampos.some(campo => {
    // Verificar que cada campo tenga un resultado definido
    if (!campo.resultado) return true;
    return false;
  });

  // Si algún campo está incompleto, mostrar una alerta y detener el proceso
  if (algunCampoIncompleto) {
    window.alert('Primero debe completar todos los campos.');
    return;
  }

  // Proceder con la lógica de envío del formulario...

  setIsLoading(true);
  const now = new Date();
  const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  const visitaActual = await getVisitaById(token, idVisita);

  const actividadPreventiva = {
    id_protocolo: '65a93dc689a02ef211e75ec9',
    date_created: formattedDateCreated,
    ids_campos_preventivo: todosLosCampos,
  };

  const datosActualizados = {
    ...visitaActual,
    actividades: [...visitaActual.actividades, actividadPreventiva],
  };

  try {
    await updateVisita(token, idVisita, datosActualizados);
    alert('Actividad de mantenimiento preventivo registrada con éxito.');
    onActividadesUpdated(); 
  } catch (error) {
    console.error('Error al registrar la actividad preventiva:', error);
    alert('Error al registrar la actividad preventiva.');
  } finally {
    setIsLoading(false);
  }
};





  const getButtonClass = (campo: CampoPreventivo, resultado: 'paso' | 'fallo' | 'n/a') => {
    // Asegúrate de que 'n/a' se convierte a 'na' para que coincida con las clases CSS
    const resultadoClassName = resultado.replace('/', '');
    const isActive = campo.resultado === resultado ? 'active' : '';
    return `PreventivoVisitaRegistrar-${resultadoClassName}-b ${isActive}`;
  };

  const getButtonClassCuantitativo = (campo: CampoPreventivo, resultadoEsperado: 'paso' | 'fallo') => {
    // Determinar si este botón debe estar activo basado en el resultado actual del campo
    const isActive = campo.resultado === resultadoEsperado ? 'active' : '';
    
    // Asegúrate de que 'n/a' se convierte a 'na' para que coincida con las clases CSS
    const resultadoClassName = resultadoEsperado.replace('/', '');
    return `PreventivoVisitaRegistrar-cuantitativo-${resultadoClassName}-b ${isActive}`;
  };
  
  
  return (
    <div className="PreventivoVisitaRegistrar-container">
      <form onSubmit={handleSubmit} className="PreventivoVisitaRegistrar-form">
          <div className="PreventivoVisitaRegistrar-actividad-preventivo">
               <div className="PreventivoVisitaRegistrar-overlap-wrapper">
                 <div className="PreventivoVisitaRegistrar-overlap">
                   <div className="PreventivoVisitaRegistrar-title-text">PREVENTIVO</div>

                   <div className="PreventivoVisitaRegistrar-cualitativo-section">
                      <div className='PreventivoVisitaRegistrar-overlap-group'>
                          <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                            <div className="PreventivoVisitaRegistrar-text-wrapper">PRUEBAS CUALITATIVAS</div>
                          </div>
                        <div className='PreventivoVisitaRegistrar-overflow-container'>
                          <div className='PreventivoVisitaRegistrar-container-list'>
                            {camposPreventivos.map((campo, index) => (
                                <ul key={index}>
                                  <li className="PreventivoVisitaRegistrar-div">
                                    <label className="PreventivoVisitaRegistrar-p">{campo.title}</label>
                                    <button
                                        type="button"
                                        className={getButtonClass(campo, 'paso')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'paso', 'cualitativo');
                                        }}
                                      >
                                        Pasó
                                      </button>
                                      <button
                                        type="button"
                                        className={getButtonClass(campo, 'fallo')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'fallo', 'cualitativo');
                                        }}
                                      >
                                        Falló
                                      </button>
                                      <button
                                        type="button"
                                        className={getButtonClass(campo, 'n/a')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'n/a', 'cualitativo');
                                        }}
                                      >
                                        N/A
                                      </button>

                                  </li>
                                </ul>
                              ))}
                          </div>
                          <div className="PreventivoVisitaRegistrar-separator" />
                      </div>

                        </div>
                   </div>

                   {/* SECTION MANTENIMIENTO */}
                
                   <div className="PreventivoVisitaRegistrar-mantenimiento-section">
                      <div className='PreventivoVisitaRegistrar-overlap-group'>
                          <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                            <div className="PreventivoVisitaRegistrar-text-wrapper">PRUEBAS MANTENIMIENTO</div>
                          </div>
                        <div className='PreventivoVisitaRegistrar-overflow-container'>
                          <div className='PreventivoVisitaRegistrar-container-list'>
                            {camposMantenimiento.map((campo, index) => (
                                <ul key={index}>
                                  <li className="PreventivoVisitaRegistrar-div">
                                    <label className="PreventivoVisitaRegistrar-p">{campo.title}</label>
                                    <button
                                        type="button"
                                        className={getButtonClass(campo, 'paso')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'paso', 'mantenimiento');
                                        }}
                                      >
                                        Pasó
                                      </button>
                                      <button
                                        type="button"
                                        className={getButtonClass(campo, 'fallo')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'fallo', 'mantenimiento');
                                        }}
                                      >
                                        Falló
                                      </button>
                                      <button
                                        type="button"
                                        className={getButtonClass(campo, 'n/a')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'n/a', 'mantenimiento');
                                        }}
                                      >
                                        N/A
                                      </button>

                                  </li>
                                </ul>
                              ))}
                          </div>
                          <div className="PreventivoVisitaRegistrar-separator" />

                      </div>

                        </div>
                   </div>

                    {/* SECTION CUANTITATIVO */}
                                    
                    <div className="PreventivoVisitaRegistrar-cuantitativo-section">
                      <div className='PreventivoVisitaRegistrar-overlap-group'>
                          <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                            <div className="PreventivoVisitaRegistrar-text-wrapper">PRUEBAS CUANTITATIVAS</div>
                          </div>
                        <div className='PreventivoVisitaRegistrar-overflow-container'>
                          <div className='PreventivoVisitaRegistrar-container-list-cuantitativo'>
                            {camposCuantitativos.map((campo, index) => (
                                <ul key={index}>
                                  <li className="PreventivoVisitaRegistrar-div-cuantitativo">
                                    <label className="PreventivoVisitaRegistrar-p">{campo.title}</label>
                                    <div className='PreventivoVisitaRegistrar-cuantitativo-medicion'>{`En ${campo.unidad} rango ( ${campo.minimo} a ${campo.maximo} )`}</div>
                                    <input className='PreventivoVisitaRegistrar-cuantitativo-medicion-input' type='number' placeholder='Ingrese el valor medido...' onChange={(e) => handleMedicionChange(index, e.target.value)}/>
                                    <button
                                        type="button"
                                        className={getButtonClassCuantitativo(campo, 'paso')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'paso', 'cuantitativo');
                                        }}
                                      >
                                        Pasó
                                      </button>

                                      <button
                                        type="button"
                                        className={getButtonClassCuantitativo(campo, 'fallo')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'fallo', 'cuantitativo');
                                        }}
                                      >
                                        Falló
                                      </button>
                                  </li>
                                </ul>
                              ))}
                           </div>
                           <div className="PreventivoVisitaRegistrar-separator" />
                          </div>
                        </div>
                   </div>

                    {/* SECTION OTROS */}
                
                    <div className="PreventivoVisitaRegistrar-otros-section">
                      <div className='PreventivoVisitaRegistrar-overlap-group'>
                          <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                            <div className="PreventivoVisitaRegistrar-text-wrapper">OTRAS PRUEBAS</div>
                          </div>
                        <div className='PreventivoVisitaRegistrar-overflow-container'>
                          <div className='PreventivoVisitaRegistrar-container-list'>
                            {camposOtros.map((campo, index) => (
                                <ul key={index}>
                                  <li className="PreventivoVisitaRegistrar-div">
                                    <label className="PreventivoVisitaRegistrar-p">{campo.title}</label>
                                    <button
                                        type="button"
                                        className={getButtonClass(campo, 'paso')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'paso', 'otros');
                                        }}
                                      >
                                        Pasó
                                      </button>
                                      <button
                                        type="button"
                                        className={getButtonClass(campo, 'fallo')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'fallo', 'otros');
                                        }}
                                      >
                                        Falló
                                      </button>
                                      <button
                                        type="button"
                                        className={getButtonClass(campo, 'n/a')}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleResultadoChange(index, 'n/a', 'otros');
                                        }}
                                      >
                                        N/A
                                      </button>

                                  </li>
                                </ul>
                              ))}
                          </div>
                          <div className="PreventivoVisitaRegistrar-separator" />

                      </div>

                        </div>
                   </div>

                   <button type='submit' className="PreventivoVisitaRegistrar-create-t-wrapper">CREAR ACTIVIDAD</button>

                 </div>
               </div>
             </div>

      </form>
    </div>
  );
};

export default PreventivoVisitaRegistrar;
