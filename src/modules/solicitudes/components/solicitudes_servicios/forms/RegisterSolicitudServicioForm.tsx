import React, { useState, useEffect, FormEvent } from 'react';
import { DateTime } from 'luxon';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { searchEquiposByKeyword } from '../../../../equipos/services/searchEquiposService';
import { Servicios } from '../../../utils/types/Servicios.type';
import { getAllServiciosTipos } from '../../../services/serviciosTiposService';
import { createSolicitudServicio } from '../../../services/solicitudesServiciosService';
import { useNavigate } from 'react-router-dom';
import useUserRoleVerifier from '../../../hooks/useUserRoleVerifier';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CallIcon from '@mui/icons-material/Call';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './styles/RegisterSolicitudServicioForm.css';

type RegisterSolicitudServicioFormProps = {
  onCancel: () => void;
};

const RegisterSolicitudServicioForm: React.FC<RegisterSolicitudServicioFormProps> = ({ onCancel }) => {
  const [solicitudData, setSolicitudData] = useState({
    id_creador: '',
    id_servicio: '',
    id_solicitud_estado: '',
    id_equipo: '',
    id_cambiador: '',
    creacion: '',
    aviso: '',
    cambio_estado: '',
    observacion: '',
    observacion_estado: ''
  });

  const [serviciosTipos, setServiciosTipos] = useState<Servicios[]>([]);
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null);
  const [confirmedSelection, setConfirmedSelection] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [useSelectedEquipo, setUseSelectedEquipo] = useState<boolean>(false);
  const [equiposEncontrados, setEquiposEncontrados] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [estadoAccion, setEstadoAccion] = useState('');
  const [prevSolicitudEstado, setPrevSolicitudEstado] = useState('');

  const token = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const userId = useSessionStorage('userId');
  const navigate = useNavigate();

  const estadoAprobadoId = "65aff1402643ef00d73c7545";
  const estadoRechazadoId = "65aff1442643ef00d73c7547";
  const estadoPendienteId = "65aff12d2643ef00d73c7543";

  useEffect(() => {
    const fetchServiciosTipos = async () => {
      try {
        const response = await getAllServiciosTipos(token);
        if (response) {
          setServiciosTipos(response);
        }
      } catch (error) {
        console.error('Error al obtener los tipos de servicios:', error);
      }
    };

    fetchServiciosTipos();
  }, [token]);

  const formatDateTimeLocal = () => {
    const now = DateTime.now().setZone('America/Bogota');
    return now.toFormat('yyyy-MM-dd HH:mm:ss');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSolicitudData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleServicioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSolicitudData({ ...solicitudData, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const equipos = await searchEquiposByKeyword(token, searchInput);
      setIsSearchActive(equipos.length > 0);
      if (equipos.length > 0) {
        setEquiposEncontrados(equipos);
        setSearchError(null);
      } else {
        setSearchError('No se encontraron equipos.');
        setEquiposEncontrados([]);

      }
    } catch (error) {
      console.error('Error al buscar equipos:', error);
      setSearchError('Error al buscar equipos.');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // Verificar la selección del equipo y la existencia de ID
  if (!confirmedSelection || !selectedEquipo || !selectedEquipo._id) {
    alert('Debes confirmar la selección del equipo antes de enviar el formulario.');
    return;
  }

  // Asegurarse de que todos los campos necesarios tienen valores válidos
  if (!solicitudData.id_servicio || !userId || !estadoPendienteId) {
    alert('Algunos campos obligatorios están vacíos o no son válidos.');
    return;
  }
  
    const currentDateTime = formatDateTimeLocal();

    const solicitudServicioData = {
      ...solicitudData,
      id_servicio: solicitudData.id_servicio, 
      id_equipo: selectedEquipo._id,
      creacion: currentDateTime,
      id_creador: userId,
      id_solicitud_estado: estadoPendienteId,
      id_cambiador: userId,
      cambio_estado: currentDateTime,
      observacion_estado: `Estado pendiente generado, persona a cargo: ${userId}` 
    };

    try {
      await createSolicitudServicio(token, solicitudServicioData);
      alert('Solicitud creada con éxito');
      navigate('/solicitudes-servicios');
      window.location.reload();
      onCancel();
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
    }
  };

  const handleEstadoChange = (nuevoEstadoId: string) => {
    const esAprobado = nuevoEstadoId === estadoAprobadoId;
    if (solicitudData.id_solicitud_estado !== nuevoEstadoId) {
      setSolicitudData((prevData) => ({
        ...prevData,
        id_solicitud_estado: nuevoEstadoId,
        id_cambiador: userId,
        cambio_estado: formatDateTimeLocal(),
      }));
      setEstadoAccion(esAprobado ? "Aprobando Solicitud de Servicio" : "Rechazando Solicitud de Servicio");
    }
  };

  const handleEquipoSelection = (equipo: any) => {
    setSelectedEquipo(equipo);
    setConfirmedSelection(true);
    setUseSelectedEquipo(true);
    setEquiposEncontrados([]);
    setIsSearchActive(false);
  };

  const handleEquipoSelectedRedirect = () => {
    navigate(`/equipos/${selectedEquipo._id}`);
  };

  const handleEquipoFoundRedirect = (equipo: any) => {
    navigate(`/equipos/${equipo._id}`);
  };

  const handleCancel = () => {
    navigate('/solicitudes-servicios');
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
         <div className="RegisterSolicitudServicioForm-div-wrapper">
              <div className="RegisterSolicitudServicioForm-overlap-wrapper">
                <div className="RegisterSolicitudServicioForm-overlap">
                  <div className="RegisterSolicitudServicioForm-container" />
                  <header className="RegisterSolicitudServicioForm-header">
                    <div className="RegisterSolicitudServicioForm-overlap-group">
                      <p className="RegisterSolicitudServicioForm-solicitud-id">REGISTRAR NUEVA SOLICITUD DE SERVICIO</p>
                    </div>
                  </header>
                  <div className="RegisterSolicitudServicioForm-section">

                    {/* SERVICIO SELECTOR */}
                    <div className="RegisterSolicitudServicioForm-tipo-servicio-p">1- Tipo de servicio:</div>
                    <select 
                    className="RegisterSolicitudServicioForm-tipo-servicio-input"
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
                    <p className="RegisterSolicitudServicioForm-busqueda-equipos-p">
                      2- Busqueda de equipo por SN, MTTO o ACTIVO FIJO&nbsp; (Si se desea reemplazar):
                    </p>
                    <input 
                    className="RegisterSolicitudServicioForm-busqueda-equipos"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button 
                    className="RegisterSolicitudServicioForm-div"
                    type="button" 
                    onClick={handleSearch}
                    >
                      Buscar
                    </button>

                    {/* EQUIPOS ENCONTRADOS Y SELECCION */}
                    {equiposEncontrados && equiposEncontrados.length > 0 && (
                        <div className="RegisterSolicitudServicioForm-equipos-encontrados">
                          <ul className="RegisterSolicitudServicioForm-equipos-list">
                          {equiposEncontrados.map((equipo) => (
                            <li key={equipo._id} className='RegisterSolicitudServicioForm-equipo-card-list'>
                              <div className="RegisterSolicitudServicioForm-equipo-card">
                                <div className="RegisterSolicitudServicioForm-overlap-group-2">
                                  <div className="RegisterSolicitudServicioForm-equipo-classname-p">{equipo.modelo_equipos.id_clase ? equipo.modelo_equipos.id_clase.clase : 'N/A'}</div>
                                  <div className="RegisterSolicitudServicioForm-equipo-oid">ID: {equipo ? equipo._id : 'N/A'}</div>
                                  <div className="RegisterSolicitudServicioForm-serial-p">SN: {equipo ? equipo.serie : 'N/A'}</div>
                                  <LocationOnIcon className="RegisterSolicitudServicioForm-location-icon" />
                                  <div className="RegisterSolicitudServicioForm-location-text">{equipo ? equipo.ubicacion : 'N/A'}</div>
                                  <ManageHistoryIcon className="RegisterSolicitudServicioForm-frequency-icon" />
                                  <div className="RegisterSolicitudServicioForm-frequency-value">{equipo ? equipo.frecuencia : 'N/A'}</div>
                                  <div className="RegisterSolicitudServicioForm-sede-name">{equipo.id_sede ? equipo.id_sede.sede_nombre : 'N/A'}</div>
                                  <div className="RegisterSolicitudServicioForm-sede-oid">ID: { equipo.id_sede ? equipo.id_sede._id : 'N/A'}</div>
                                  <AccountBalanceIcon className="RegisterSolicitudServicioForm-client-icon"/>
                                  <div className="RegisterSolicitudServicioForm-client-name">{equipo.id_sede.id_client ? equipo.id_sede.id_client.client_name : 'N/A'}</div>
                                  <LocationOnIcon className="RegisterSolicitudServicioForm-icon"/>
                                  <div className="RegisterSolicitudServicioForm-sede-address">{equipo.id_sede ? equipo.id_sede.sede_address : 'N/A'}</div>
                                  <CallIcon className="RegisterSolicitudServicioForm-sede-telephone-icon"/>
                                  <div className="RegisterSolicitudServicioForm-sede-telephone-value">{equipo.id_sede ? equipo.id_sede.sede_telefono : 'N/A'}</div>
                                  <button 
                                  className="RegisterSolicitudServicioForm-seleccionar-button"
                                  type="button"
                                  onClick={() => handleEquipoSelection(equipo)}
                                  >
                                    Seleccionar Equipo
                                  </button>
                                  <RemoveRedEyeIcon 
                                    className="RegisterSolicitudServicioForm-eye"
                                    onClick={() => handleEquipoFoundRedirect(equipo)}
                                  />
                                </div>
                              </div>
                            </li>
                           ))}
                          </ul>
                          <div className="RegisterSolicitudServicioForm-text-wrapper">Equipos encontrados</div>
                        </div>
                      )}
                      {searchError && (
                        <div className="RegisterSolicitudServicioForm-search-error-message">{searchError}</div>
                      )}


                  {selectedEquipo && confirmedSelection && (
                  <div className={`RegisterSolicitudServicioForm-equipo-selected ${isSearchActive ? "RegisterSolicitudServicioForm-search-active" : ""}`}>
                      <div className="RegisterSolicitudServicioForm-overlap-group-wrapper">
                        <div className="RegisterSolicitudServicioForm-overlap-group-3">
                          <div className="RegisterSolicitudServicioForm-equipo">{selectedEquipo.modelo_equipos.id_clase ? selectedEquipo.modelo_equipos.id_clase.clase : 'N/A'}</div>
                          <div className="RegisterSolicitudServicioForm-equipo-2">ID: {selectedEquipo ? selectedEquipo._id : 'N/A'}</div>
                          <div className="RegisterSolicitudServicioForm-serial">SN: {selectedEquipo ? selectedEquipo.serie : 'N/A'}</div>
                          <LocationOnIcon className="RegisterSolicitudServicioForm-location"/>
                          <div className="RegisterSolicitudServicioForm-location-value">{selectedEquipo ? selectedEquipo.ubicacion : 'N/A'}</div>
                          <ManageHistoryIcon className="RegisterSolicitudServicioForm-frecuency" />
                          <div className="RegisterSolicitudServicioForm-frecuency-value">{selectedEquipo ? selectedEquipo.frecuencia : 'N/A'}</div>
                          <div className="RegisterSolicitudServicioForm-sede-name-title">{selectedEquipo.id_sede ? selectedEquipo.id_sede.sede_nombre : 'N/A'}</div>
                          <div className="RegisterSolicitudServicioForm-sede">ID: {selectedEquipo.id_sede ? selectedEquipo.id_sede._id : 'N/A'}</div>
                          <AccountBalanceIcon className="RegisterSolicitudServicioForm-client"/>
                          <div className="RegisterSolicitudServicioForm-client-2">{selectedEquipo.id_sede.id_client ? selectedEquipo.id_sede.id_client.client_name : 'N/A'}</div>
                          <LocationOnIcon className="RegisterSolicitudServicioForm-img"/>
                          <div className="RegisterSolicitudServicioForm-sede-2">{selectedEquipo.id_sede ? selectedEquipo.id_sede.sede_address : 'N/A'}</div>
                          <CallIcon className="RegisterSolicitudServicioForm-sede-telephone" />
                          <div className="RegisterSolicitudServicioForm-sede-telephone-2">{selectedEquipo.id_sede ? selectedEquipo.id_sede.sede_telefono : 'N/A'}</div>
                          <RemoveRedEyeIcon 
                          className="RegisterSolicitudServicioForm-eye"
                          onClick={handleEquipoSelectedRedirect}
                          />
                          <button className="RegisterSolicitudServicioForm-confirmed-selection" onClick={() => { setSearchError(null); setConfirmedSelection(false) } }>
                            Confirmar Selección
                          </button>
                        </div>
                      </div>
                      <div className="RegisterSolicitudServicioForm-equipo-selected-2">Información del Equipo Seleccionado</div>
                    </div>
                  )}
                  

                  {selectedEquipo && !confirmedSelection && (
                    <div className='RegisterSolicitudServicioForm-confirmation-div'>
                      <p className='RegisterSolicitudServicioForm-confirmation-question'>¿La información del equipo es la correcta para relacionar?</p>
                      <button
                        className='RegisterSolicitudServicioForm-confirmation-yes'
                        type="button"
                        onClick={() => {
                          setConfirmedSelection(true);
                          setUseSelectedEquipo(true);
                          setSearchError(null);
                        }}
                      >
                        Sí
                      </button>
                      <button
                        className='RegisterSolicitudServicioForm-confirmation-no'
                        type="button"
                        onClick={() => {
                          setSelectedEquipo(null);
                          setUseSelectedEquipo(false);
                          setSearchError(null);

                        }}
                      >
                        No
                      </button>
                    </div>
                  )}
                  </div>


                  <div className="RegisterSolicitudServicioForm-middle-separator"/>
                  <div className="RegisterSolicitudServicioForm-section-2">
                    {/* <div className="overlap-2">
                      <p className="text-wrapper-2">3- Solicitud creada en la fecha:</p>
                      <input
                      className="div-2"
                      type="text"
                      name="creacion"
                      value={solicitudData.creacion}
                      onChange={handleChange}
                      readOnly 
                      />
                    </div> */}
                    <div className="RegisterSolicitudServicioForm-overlap-3">
                      <div className="RegisterSolicitudServicioForm-text-wrapper-2">3- Aviso:</div>
                      <input 
                      className="RegisterSolicitudServicioForm-div-2"
                      name="aviso"
                      value={solicitudData.aviso}
                      onChange={handleChange}
                      />
                    </div>
                    <div className="RegisterSolicitudServicioForm-overlap-4">
                      <div className="RegisterSolicitudServicioForm-text-wrapper-2">4- Observación:</div>
                      <input
                      className="RegisterSolicitudServicioForm-div-2"
                      name="observacion"
                      value={solicitudData.observacion}
                      onChange={handleChange}
                      />
                    </div>

                    {/* {isAdmin && (

                      <div>
                        <div className="overlap-5">
                          <div className="text-wrapper-2">5- Estado Solicitud:</div>
                          <input className="div-2"
                          name='id_solicitud_estado'
                          value={estadoAccion || solicitudData.id_solicitud_estado}
                          readOnly
                          />
                        </div>
                        <CheckCircleIcon className="aprobar-icon" 
                        onClick={() => handleEstadoChange(estadoAprobadoId)} />
                        <div className="aprobar-text">Aprobar</div>
                        <CancelIcon className="rechazar-icon"
                        onClick={() => handleEstadoChange(estadoRechazadoId)}
                        />
                        <div className="rechazar-text">Rechazar</div>
                        <div className="overlap-6">
                          <div className="text-wrapper-2">5- Observación Estado:</div>
                          <textarea className="div-2"
                          name="observacion_estado"
                          value={solicitudData.observacion_estado}
                          onChange={handleChange}
                          />
                        </div>
                      </div>
)} */}
                    <button 
                    className="RegisterSolicitudServicioForm-cancelar-button"
                    type="button"
                    onClick={handleCancel}
                    >
                      Cancelar
                    </button>
                    <button
                    className="RegisterSolicitudServicioForm-actualizar-button" 
                    type='submit'
                    >
                      Registrar
                      </button>
                  </div>
                </div>
              </div>
            </div>



      </form>
    </div>
  );
};

export default RegisterSolicitudServicioForm;
