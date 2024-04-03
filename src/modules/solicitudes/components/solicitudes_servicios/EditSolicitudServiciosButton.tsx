import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../../../users/hooks/useSessionStorage';
import { updateSolicitudServicio } from '../../services/solicitudesServiciosService';
import { getAllServiciosTipos } from '../../services/serviciosTiposService';
import { Servicios } from '../../utils/types/Servicios.type';
import { searchEquiposByKeyword } from '../../../equipos/services/searchEquiposService';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import './styles/EditSolicitudServiciosButton.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CallIcon from '@mui/icons-material/Call';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { createOrden } from '../../../ordenes/services/ordenesService';

type EditSolicitudServiciosButtonProps = {
  solicitudId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any; // Considera definir un tipo más específico si es posible
};

const EditSolicitudServiciosButton: React.FC<EditSolicitudServiciosButtonProps> = ({
  solicitudId,
  onEditSuccess,
  onCancel,
  initialData,
}) => {
  const [solicitudData, setSolicitudData] = useState(initialData);
  // Asegura que serviciosTipos siempre sea un arreglo
  const [serviciosTipos, setServiciosTipos] = useState<Servicios[]>([]); 
  const token = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const userId = useSessionStorage('userId');

  // Estados busqueda & asignación de Equipo
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null);
  const [confirmedSelection, setConfirmedSelection] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [useSelectedEquipo, setUseSelectedEquipo] = useState<boolean>(false);
  const [equiposEncontrados, setEquiposEncontrados] = useState<any[]>([]); // Nuevo estado para almacenar equipos encontrados
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Estados id_solicitud_estado
  const estadoAprobadoId = "65aff1402643ef00d73c7545";
  const estadoRechazadoId = "65aff1442643ef00d73c7547";
  const [estadoAccion, setEstadoAccion] = useState('');
  const [mostrarObservacionEstado, setMostrarObservacionEstado] = useState(solicitudData.id_solicitud_estado.estado === 'Pendiente');
  const [notasAdicionales, setNotasAdicionales] = useState('');

  // Estado para realizar un seguimiento del valor anterior de id_solicitud_estado
  const [prevSolicitudEstado, setPrevSolicitudEstado] = useState(initialData.id_solicitud_estado);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchServiciosTipos = async () => {
      try {
        const response = await getAllServiciosTipos(token);
        // Asegúrate de que la respuesta contiene la propiedad 'servicios'
        if (response) {
          setServiciosTipos(response); // Actualiza directamente con la respuesta si contiene la lista de servicios
        }
      } catch (error) {
        console.error('Error al obtener los tipos de servicios:', error);
      }
    };
  
    fetchServiciosTipos();

    if (solicitudData.id_equipo) {
      setSelectedEquipo(solicitudData.id_equipo);
      setConfirmedSelection(true); // Confirma automáticamente el equipo inicial
    }
  }, [token, solicitudData.id_equipo]);

  
 // Función para formatear la fecha y hora actuales al formato local de Colombia
 const formatDateTimeLocal = () => {
  const now = DateTime.now().setZone('America/Bogota');
  return now.toFormat('yyyy-MM-dd HH:mm:ss');
};

  
const handleEstadoChange = (nuevoEstadoId: string) => {
  const esAprobado = nuevoEstadoId === estadoAprobadoId;
  const accion = esAprobado ? "Aprobando" : "Rechazando";
  const prefijoObservacion = `${accion} estado por usuario con id - ${userId} y notas: `;

  if (solicitudData.id_solicitud_estado !== nuevoEstadoId) {
    setSolicitudData((prevData: typeof initialData) => ({
      ...prevData,
      id_solicitud_estado: nuevoEstadoId,
      id_cambiador: userId,
      cambio_estado: formatDateTimeLocal(),
      observacion_estado: prefijoObservacion,
    }));
    // No resetear notasAdicionales aquí, porque queremos conservarlas hasta el envío
    setEstadoAccion(esAprobado ? "Aprobando Solicitud de Servicio" : "Rechazando Solicitud de Servicio");
  }
};


const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!confirmedSelection || !selectedEquipo) {
    alert('Debes confirmar la selección del equipo antes de enviar el formulario.');
    return;
  }

  const currentDateTime = formatDateTimeLocal();
  const observacionEstadoFinal = `${solicitudData.observacion_estado} ${notasAdicionales}`.trim();

  const mappedData = {
    id_creador: solicitudData.id_creador,
    id_cambiador: userId,
    id_servicio: solicitudData.id_servicio,
    id_solicitud_estado: solicitudData.id_solicitud_estado,
    id_equipo: selectedEquipo._id,
    creacion: solicitudData.creacion,
    aviso: solicitudData.aviso,
    cambio_estado: currentDateTime,
    observacion: solicitudData.observacion,
    observacion_estado: observacionEstadoFinal,
  };

  try {
    await updateSolicitudServicio(token, solicitudId, mappedData);
    // Condición para crear una orden si el estado de la solicitud es "Aprobada"
    if (solicitudData.id_solicitud_estado === estadoAprobadoId) {
      const ordenData = {
        id_solicitud_servicio: solicitudData._id,
        id_orden_estado: "65c5961766a5a36f3df90637",
        id_creador: userId,
        creacion: currentDateTime,
      };
      await createOrden(token, ordenData);
      alert('Solicitud actualizada con éxito. Se creó una nueva orden.');
    } else {
      alert('Solicitud actualizada con éxito.');
    }
    onEditSuccess();
    window.location.reload();
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
  }
};




  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSolicitudData((prevData: typeof solicitudData) => ({ ...prevData, [name]: value }));
  };
  

  const handleServicioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSolicitudData({ ...solicitudData, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const equipos = await searchEquiposByKeyword(token, searchInput);
      setIsSearchActive(equipos.length > 0); // Actualiza el estado según si se encontraron equipos
      if (equipos.length > 0) {
        setEquiposEncontrados(equipos); // Almacena todos los equipos encontrados en un estado
        setSearchError(null);
      } else {
        setSearchError('No se encontraron equipos.');
        setEquiposEncontrados([]);
      }
    } catch (error) {
      console.error('Error al buscar equipos:', error);
      setSearchError('Error al buscar equipos.');
      setIsSearchActive(false); // Asegúrate de restablecer en caso de error
    }
  };
  const handleEquipoSelection = (equipo:any) => {
    setSelectedEquipo(equipo);
    setConfirmedSelection(true);
    setUseSelectedEquipo(true);
    setEquiposEncontrados([]); // Limpia la lista de equipos encontrados
    setIsSearchActive(false); // Desactiva la búsqueda para que el equipo-selected vuelva a su posición original
  };

  const handleEquipoSelectedRedirect = () =>{
    navigate(`/equipos/${selectedEquipo._id}`);
  }

  const handleEquipoFoundRedirect = (equipo: any) => {
    navigate(`/equipos/${equipo._id}`);
  };
  


  return (
    <div>
      <form onSubmit={handleSubmit}>
         <div className="EditSolicitudServiciosButton-form">
              <div className="EditSolicitudServiciosButton-overlap-wrapper">
                <div className="EditSolicitudServiciosButton-overlap">
                  <div className="EditSolicitudServiciosButton-container" />
                  <header className="EditSolicitudServiciosButton-header">
                    <div className="EditSolicitudServiciosButton-overlap-group">
                      <p className="EditSolicitudServiciosButton-solicitud-id">SOLICITUD DE SERVICIO - {solicitudData._id}</p>
                    </div>
                  </header>
                  <div className="EditSolicitudServiciosButton-section">

                    {/* SERVICIO SELECTOR */}
                    <div className="EditSolicitudServiciosButton-tipo-servicio-p">1- Tipo de servicio:</div>
                    <select 
                    className="EditSolicitudServiciosButton-tipo-servicio-input"
                    name="id_servicio"
                    value={solicitudData.id_servicio}
                    onChange={handleServicioChange}
                    >
                      <option value="" disabled selected>Seleccionar</option>
                      {serviciosTipos.map((servicio) => (
                      <option key={servicio._id} value={servicio._id}>
                        {servicio.servicio}
                      </option>
                    ))}
                    </select> 

                        {/* BUSQUEDA DE EQUIPOS */}
                    <p className="EditSolicitudServiciosButton-busqueda-equipos-p">
                      2- Busqueda de equipo por SN, MTTO o ACTIVO FIJO&nbsp;&nbsp;&nbsp;&nbsp; (Si se desea reemplazar):
                    </p>
                    <input 
                    className="EditSolicitudServiciosButton-busqueda-equipos"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button 
                    className="EditSolicitudServiciosButton-div"
                    type="button" 
                    onClick={handleSearch}
                    >
                      Buscar
                    </button>

                    {/* EQUIPOS ENCONTRADOS Y SELECCION */}
                    {equiposEncontrados && equiposEncontrados.length > 0 && (
                        <div className="EditSolicitudServiciosButton-equipos-encontrados">
                          <ul className="EditSolicitudServiciosButton-equipos-list">
                          {equiposEncontrados.map((equipo) => (
                            <li key={equipo._id} className='EditSolicitudServiciosButton-equipo-card-list'>
                              <div className="EditSolicitudServiciosButton-equipo-card">
                                <div className="EditSolicitudServiciosButton-overlap-group-2">
                                  <div className="EditSolicitudServiciosButton-equipo-classname-p">{equipo.modelo_equipos.id_clase ? equipo.modelo_equipos.id_clase.clase : 'N/A'}</div>
                                  <div className="EditSolicitudServiciosButton-equipo-oid">ID: {equipo ? equipo._id : 'N/A'}</div>
                                  <div className="EditSolicitudServiciosButton-serial-p">SN: {equipo ? equipo.serie : 'N/A'}</div>
                                  <LocationOnIcon className="EditSolicitudServiciosButton-location-icon" />
                                  <div className="EditSolicitudServiciosButton-location-text">{equipo ? equipo.ubicacion : 'N/A'}</div>
                                  <ManageHistoryIcon className="EditSolicitudServiciosButton-frequency-icon" />
                                  <div className="EditSolicitudServiciosButton-frequency-value">{equipo ? equipo.frecuencia : 'N/A'}</div>
                                  <div className="EditSolicitudServiciosButton-sede-name">{equipo.id_sede ? equipo.id_sede.sede_nombre : 'N/A'}</div>
                                  <div className="EditSolicitudServiciosButton-sede-oid">ID: { equipo.id_sede ? equipo.id_sede._id : 'N/A'}</div>
                                  <AccountBalanceIcon className="EditSolicitudServiciosButton-client-icon"/>
                                  <div className="EditSolicitudServiciosButton-client-name">{equipo.id_sede.id_client ? equipo.id_sede.id_client.client_name : 'N/A'}</div>
                                  <LocationOnIcon className="EditSolicitudServiciosButton-icon"/>
                                  <div className="EditSolicitudServiciosButton-sede-address">{equipo.id_sede ? equipo.id_sede.sede_address : 'N/A'}</div>
                                  <CallIcon className="EditSolicitudServiciosButton-sede-telephone-icon"/>
                                  <div className="EditSolicitudServiciosButton-sede-telephone-value">{equipo.id_sede ? equipo.id_sede.sede_telefono : 'N/A'}</div>
                                  <button 
                                  className="EditSolicitudServiciosButton-seleccionar-button"
                                  type="button"
                                  onClick={() => handleEquipoSelection(equipo)}
                                  >
                                    Seleccionar Equipo
                                  </button>
                                  <RemoveRedEyeIcon 
                                    className="EditSolicitudServiciosButton-eye"
                                    onClick={() => handleEquipoFoundRedirect(equipo)}
                                  />
                                </div>
                              </div>
                            </li>
                           ))}
                          </ul>
                          <div className="EditSolicitudServiciosButton-text-wrapper">Equipos encontrados</div>
                        </div>
                      )}


                  {selectedEquipo && confirmedSelection && (
                  <div className={`EditSolicitudServiciosButton-equipo-selected ${isSearchActive ? "search-active" : ""}`}>
                      <div className="EditSolicitudServiciosButton-overlap-group-wrapper">
                        <div className="EditSolicitudServiciosButton-overlap-group-3">
                          <div className="EditSolicitudServiciosButton-equipo">{selectedEquipo.modelo_equipos.id_clase ? selectedEquipo.modelo_equipos.id_clase.clase : 'N/A'}</div>
                          <div className="EditSolicitudServiciosButton-equipo-2">ID: {selectedEquipo ? selectedEquipo._id : 'N/A'}</div>
                          <div className="EditSolicitudServiciosButton-serial">SN: {selectedEquipo ? selectedEquipo.serie : 'N/A'}</div>
                          <LocationOnIcon className="EditSolicitudServiciosButton-location"/>
                          <div className="EditSolicitudServiciosButton-location-value">{selectedEquipo ? selectedEquipo.ubicacion : 'N/A'}</div>
                          <ManageHistoryIcon className="EditSolicitudServiciosButton-frecuency" />
                          <div className="EditSolicitudServiciosButton-frecuency-value">{selectedEquipo ? selectedEquipo.frecuencia : 'N/A'}</div>
                          <div className="EditSolicitudServiciosButton-sede-name-title">{selectedEquipo.id_sede ? selectedEquipo.id_sede.sede_nombre : 'N/A'}</div>
                          <div className="EditSolicitudServiciosButton-sede">ID: {selectedEquipo.id_sede ? selectedEquipo.id_sede._id : 'N/A'}</div>
                          <AccountBalanceIcon className="EditSolicitudServiciosButton-client"/>
                          <div className="EditSolicitudServiciosButton-client-2">{selectedEquipo.id_sede.id_client ? selectedEquipo.id_sede.id_client.client_name : 'N/A'}</div>
                          <LocationOnIcon className="EditSolicitudServiciosButton-img"/>
                          <div className="EditSolicitudServiciosButton-sede-2">{selectedEquipo.id_sede ? selectedEquipo.id_sede.sede_address : 'N/A'}</div>
                          <CallIcon className="EditSolicitudServiciosButton-sede-telephone" />
                          <div className="EditSolicitudServiciosButton-sede-telephone-2">{selectedEquipo.id_sede ? selectedEquipo.id_sede.sede_telefono : 'N/A'}</div>
                          <RemoveRedEyeIcon 
                          className="EditSolicitudServiciosButton-eye"
                          onClick={handleEquipoSelectedRedirect}
                          />
                          <button className="EditSolicitudServiciosButton-confirmed-selection" onClick={() => setConfirmedSelection(false)}>
                            Confirmar Selección
                          </button>
                        </div>
                      </div>
                      <div className="EditSolicitudServiciosButton-equipo-selected-2">Información del Equipo Seleccionado</div>
                    </div>
                  )}
                  {searchError && (
                        <div className="EditSolicitudServiciosButton-search-error-message">{searchError}</div>
                      )}

                  {selectedEquipo && !confirmedSelection && (
                    <div className='EditSolicitudServiciosButton-confirmation-div'>
                      <p className='EditSolicitudServiciosButton-confirmation-question'>¿La información del equipo es la correcta para relacionar?</p>
                      <button
                        className='EditSolicitudServiciosButton-confirmation-yes'
                        type="button"
                        onClick={() => {
                          setConfirmedSelection(true);
                          setUseSelectedEquipo(true);
                        }}
                      >
                        Sí
                      </button>
                      <button
                        className='EditSolicitudServiciosButton-confirmation-no'
                        type="button"
                        onClick={() => {
                          setSelectedEquipo(null);
                          setUseSelectedEquipo(false);
                        }}
                      >
                        No
                      </button>
                    </div>
                  )}
                  </div>


                  <div className="EditSolicitudServiciosButton-middle-separator"/>
                  <div className="EditSolicitudServiciosButton-section-2">
                    <div className="EditSolicitudServiciosButton-overlap-2">
                      <p className="EditSolicitudServiciosButton-text-wrapper-2">3- Solicitud creada en la fecha:</p>
                      <input
                      className="EditSolicitudServiciosButton-div-2"
                      type="text"
                      name="creacion"
                      value={solicitudData.creacion}
                      onChange={handleChange}
                      readOnly 
                      />
                    </div>
                    <div className="EditSolicitudServiciosButton-overlap-3">
                      <div className="EditSolicitudServiciosButton-text-wrapper-2">4- Aviso:</div>
                      <input 
                      className="EditSolicitudServiciosButton-div-2"
                      name="aviso"
                      value={solicitudData.aviso}
                      onChange={handleChange}
                      />
                    </div>
                    <div className="EditSolicitudServiciosButton-overlap-4">
                      <div className="EditSolicitudServiciosButton-text-wrapper-2">5- Observación:</div>
                      <input
                      className="EditSolicitudServiciosButton-div-2"
                      name="observacion"
                      value={solicitudData.observacion}
                      onChange={handleChange}
                      />
                    </div>

                    {isAdmin && (

                      <div>
                        <div className="EditSolicitudServiciosButton-overlap-5">
                          <div className="EditSolicitudServiciosButton-text-wrapper-2">5- Estado Solicitud:</div>
                          <input className="EditSolicitudServiciosButton-div-2"
                          name='id_solicitud_estado'
                          value={estadoAccion || solicitudData.id_solicitud_estado.estado}
                          readOnly
                          />
                        </div>
                        {solicitudData.id_solicitud_estado.estado === 'Pendiente' && (
                            <>
                              <CheckCircleIcon className="EditSolicitudServiciosButton-aprobar-icon" 
                              onClick={() => handleEstadoChange(estadoAprobadoId)} />
                              <div className="EditSolicitudServiciosButton-aprobar-text">Aprobar</div>
                              <CancelIcon className="EditSolicitudServiciosButton-rechazar-icon"
                              onClick={() => handleEstadoChange(estadoRechazadoId)}
                              />
                              <div className="EditSolicitudServiciosButton-rechazar-text">Rechazar</div>
                            </>
                          )}

                          {mostrarObservacionEstado && (
                            <div className="EditSolicitudServiciosButton-overlap-6">
                              <div className="EditSolicitudServiciosButton-text-wrapper-2">5- Observación Estado:</div>
                              <div className="EditSolicitudServiciosButton-prefijoObservacion">
                                {solicitudData.observacion_estado}
                              </div>
                              <textarea
                                className="EditSolicitudServiciosButton-div-2"
                                name="notasAdicionales"
                                value={notasAdicionales}
                                onChange={(e) => setNotasAdicionales(e.target.value)}
                                placeholder="Añade tus notas aquí..."
                              />
                            </div>
                          )}
                      </div>
                    )}
                    <button 
                    className="EditSolicitudServiciosButton-cancelar-button"
                    type="button"
                    onClick={onCancel}
                    >
                      Cancelar
                    </button>
                    <button
                    className="EditSolicitudServiciosButton-actualizar-button" 
                    type='submit'
                    >
                      Actualizar
                      </button>
                  </div>
                </div>
              </div>
            </div>



      </form>
    </div>
  );
};

export default EditSolicitudServiciosButton;
