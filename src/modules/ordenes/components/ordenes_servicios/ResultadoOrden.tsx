import React, { useEffect, useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getAllFallosSistemas } from '../../services/falloSistemasService';
import { getAllModosFallos } from '../../services/modosFallosService';
import { getAllCausasFallas } from '../../services/causasFallasService';
import './styles/ResultadoOrden.css'
import { CircularProgress } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { updateOrden } from '../../services/ordenesService';
import MuiAlertComponent from '../../../../components/MuiAlertsComponent';
import { createSolicitudDadoBaja } from '../../services/solicitudesDadoBajaService';

interface ResultadoOrdenProps {
  idOrden?: string;
  idCliente?: string;
  resultadoOrden?: any;
  onUpdate?: () => void;
}

interface FalloSistema {
  _id: string;
  name: string;
}

interface ModoFallos {
  _id: string;
  id_fallo_sistema: any;
  name: string;
}

interface CausaFalla {
  _id: string;
  title: string;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}


const ResultadoOrden: React.FC<ResultadoOrdenProps> = ({ idOrden, resultadoOrden, onUpdate, idCliente }) => {
  const token = useSessionStorage('sessionJWTToken');
  const userId = useSessionStorage('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [fallosSistemas, setFallosSistemas] = useState<FalloSistema[]>([]);
  const [modosFallos, setModosFallos] = useState<ModoFallos[]>([]);
  const [causasFallas, setCausasFallas] = useState<CausaFalla[]>([]);
  const [selectedModos, setSelectedModos] = useState<string[]>([]);
  const [selectedCausas, setSelectedCausas] = useState<string[]>([]);
  const [selectedFalloSistema, setSelectedFalloSistema] = useState<string>('');
  const [modoValue, setModoValue] = useState('');  
  const [causaValue, setCausaValue] = useState('');
  const [comentariosFinales, setComentariosFinales] = useState('');
  const [accionEjecutada, setAccionEjecutada] = useState('');
  const [solicitudDarBaja, setSolicitudDarBaja] = useState(false);
  const [alerts, setAlerts] = useState<{ id: number, message: string, severity: 'error' | 'warning' | 'info' | 'success' }[]>([]);
  const readOnly = resultadoOrden != null;

  useEffect(() => {
    if (resultadoOrden) {
      setSelectedFalloSistema(resultadoOrden.id_fallo_sistema._id);
      setSelectedModos(resultadoOrden.ids_modos_fallos.map((modo: any) => modo._id));
      setSelectedCausas(resultadoOrden.ids_causas_fallos.map((causa: any) => causa._id));
      setComentariosFinales(resultadoOrden.comentarios_finales);
      setAccionEjecutada(resultadoOrden.accion_ejecutada);
      setSolicitudDarBaja(resultadoOrden.solicitud_dar_baja);
    }
  
    // Load additional data if necessary
    if (token) {
      setIsLoading(true);
      Promise.all([
        getAllFallosSistemas(token),
        getAllModosFallos(token),
        getAllCausasFallas(token)
      ]).then(([fallosData, modosData, causasData]) => {
        setFallosSistemas(fallosData);
        setModosFallos(modosData);
        setCausasFallas(causasData);
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [token, resultadoOrden]);
  
  const handleModoFallosChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedModos(prev => [...prev, value]);
    setModoValue('');  
  };

  const handleCausaFallaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedCausas(prev => [...prev, value]);
    setCausaValue('');
  };

  const handleFalloSistemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedFalloSistema(value);
  };

  const removeSelectedModo = (id: string) => {
    setSelectedModos(prev => prev.filter(modo => modo !== id));
  };

  const removeSelectedCausa = (id: string) => {
    setSelectedCausas(prev => prev.filter(causa => causa !== id));
  };

  const handleAccionEjecutadaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccionEjecutada(event.target.value);
  };

  const addAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message, severity }]);
  };
  
  
  const now = new Date();
  const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const createSolicitudDadoBajaIfNeeded = async () => {
    if (solicitudDarBaja) {
      const solicitudData = {
        id_solicitud_baja_estado: '6642654cc858b4a7a115053c',
        id_cliente: idCliente,
        id_orden: idOrden,
        id_creador: userId,
        date_created: formattedDateCreated
      };
      
      try {
        await createSolicitudDadoBaja(token, solicitudData);
        addAlert('Solicitud de dado de baja creada exitosamente.', 'success');
      } catch (error) {
        addAlert('Error al crear la solicitud de dado de baja.', 'error');
      }
    }
  };
  
  
  const handleSubmit = async () => {
    if (!idOrden || !selectedFalloSistema || selectedModos.length === 0 || selectedCausas.length === 0 || comentariosFinales.trim() === '' || accionEjecutada === '') {
      addAlert('Todos los campos son requeridos.', 'error');
      return;
    }
  
    const resultadoOrden = {
      id_fallo_sistema: selectedFalloSistema,
      ids_modos_fallos: selectedModos,
      ids_causas_fallos: selectedCausas,
      comentarios_finales: comentariosFinales.trim(),
      accion_ejecutada: accionEjecutada,
      solicitud_dar_baja: solicitudDarBaja
    };
  
    try {
      const response = await updateOrden(token, idOrden, { resultado_orden: resultadoOrden });
      console.log(response);
      await createSolicitudDadoBajaIfNeeded();  // Crear solicitud si es necesario
      addAlert('Orden actualizada correctamente.', 'success');
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error updating orden:', error);
      addAlert('Error al actualizar la orden.', 'error');
    }
  };
  

  const handleCloseAlert = (id: number) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#00ddfa', position: 'relative', top: '400px' }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }



  return (

            <div className="ResultadoOrden-orden">
              <MuiAlertComponent alerts={alerts} onClose={handleCloseAlert}  />
                <div className="ResultadoOrden-div">
                    <header className="ResultadoOrden-header">
                    <div className="ResultadoOrden-overlap-group">
                        <div className="ResultadoOrden-cambios-t">RESULTADO DE LA ORDEN</div>
                    </div>
                    </header>
                        <div className="resultOrden-box">
                            <div className="resultOrden-box-overlap-group">
                                 <div className="resultOrden-box-sistema-falla">
                                   <p className="resultOrden-box-text-wrapper">Seleccione el sistema que falló: *</p>
                                   <select className="resultOrden-box-div" value={selectedFalloSistema} onChange={handleFalloSistemaChange} disabled={readOnly}>
                                      <option value="" disabled>Seleccione un sistema de falla</option>
                                      {fallosSistemas.map((fallo) => (
                                        <option key={fallo._id} value={fallo._id}>{fallo.name}</option>
                                      ))}
                                    </select>
                                 </div>
                                 <div className="resultOrden-box-modos-falla-section">
                                  <p className="resultOrden-box-text-wrapper">Seleccione los modos de falla: *</p>
                                  <select className="resultOrden-box-div" value={modoValue} onChange={handleModoFallosChange} disabled={readOnly}>
                                    <option value="" disabled>Seleccione un modo de falla</option>
                                    {modosFallos.filter(modo => modo.id_fallo_sistema._id === selectedFalloSistema).map((modo) => (
                                      <option key={modo._id} value={modo._id}>{modo.name}</option>
                                    ))}
                                  </select>
                                    <ul className="resultOrden-ul">
                                    {selectedModos.map(modo => {
                                      const modoEncontrado = modosFallos.find(m => m._id === modo);
                                      return modoEncontrado ? (
                                        <>
                                          <li key={modo} className="resultOrden-box-div-2">{modoEncontrado.name}
                                          { !readOnly && (
                                            <CancelIcon className="resultOrden-remove-icon" onClick={() => removeSelectedModo(modo)}/>
                                          )}
                                          </li>
                                        </>
                                      ) : null;
                                    })}
                                    </ul>
                                 </div>
                                 <div className="resultOrden-box-causas-falla-section">
                                  <p className="resultOrden-box-text-wrapper">Seleccione las causas de falla: *</p>
                                  <select className="resultOrden-box-div" value={causaValue} onChange={handleCausaFallaChange} disabled={readOnly}>
                                    <option value="" disabled>Seleccione una causa de falla</option>
                                    {causasFallas.map((causa) => (
                                      <option key={causa._id} value={causa._id}>{causa.title}</option>
                                    ))}
                                  </select>
                                  <ul className="resultOrden-ul">
                                    {selectedCausas.map(causaId => {
                                      const causa = causasFallas.find(c => c._id === causaId);
                                      return causa ? 
                                      <>
                                      <li key={causaId} className="resultOrden-box-div-2">{causa.title}
                                      { !readOnly && (
                                      <CancelIcon className="resultOrden-remove-icon" onClick={() => removeSelectedCausa(causaId)}/>
                                      )}
                                      </li>
                                      </>
                                      
                                      : null;
                                    })}
                                  </ul>
                                 </div>
                                 <div className="resultOrden-box-separator" />
                                 <div className="resultOrden-box-acciones-ejecutadas">
                                  <div className="resultOrden-box-text-wrapper">Acciones ejecutadas: *</div>
                                    <select className="resultOrden-box-div" value={accionEjecutada} onChange={handleAccionEjecutadaChange} disabled={readOnly}>
                                      <option value="" disabled>Seleccione una acción ejecutada</option>
                                      <option value="Inmediata" >Inmediata</option>
                                      <option value="Largo Plazo" >Largo Plazo</option>
                                      <option value="Mediano Plazo" >Mediano Plazo</option>
                                    </select>
                                 </div>
                                 <div className="resultOrden-box-final-comments">
                                   <div className="resultOrden-box-text-wrapper">Ingrese los comentarios finales: *</div>
                                   <textarea 
                                   className="resultOrden-box-final-comments-input"
                                   placeholder='Comentarios...'
                                   value={comentariosFinales}
                                   onChange={(e) => setComentariosFinales(e.target.value)}  
                                   disabled={readOnly}
                                    />
                                 </div>
                                 <div className="resultOrden-box-dado-baja-section">
                                   <div className="resultOrden-box-dado-baja-t">Solicitar Dado de Baja: *</div>
                                   <label className="resultOrden-switch">
                                    <input
                                      className='resultOrden-darbaja-input'
                                      type="checkbox"
                                      name="dar_baja"
                                      checked={solicitudDarBaja}
                                      onChange={(e) => setSolicitudDarBaja(e.target.checked)}
                                      disabled={readOnly}
                                    />
                                    <span className="resultOrden-slider round"></span>
                                  </label>
                                 </div>
                                 { !readOnly && (
                                    <button className="resultOrden-update-button" onClick={handleSubmit}>
                                      Generar Resultado
                                    </button>
                                  )}
                            </div>
                        </div>
                </div>
            </div>
  );
};

export default ResultadoOrden;