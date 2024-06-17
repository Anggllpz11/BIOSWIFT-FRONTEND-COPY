import React, { useEffect, useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getAllFallosSistemas } from '../../services/falloSistemasService';
import { getAllModosFallos } from '../../services/modosFallosService';
import { getAllCausasFallas } from '../../services/causasFallasService';
import MuiAlert from '@mui/material/Alert';
import './styles/ResultadoOrden.css'
import { CircularProgress, Snackbar } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { updateOrden } from '../../services/ordenesService';
import { Orden } from '../../utils/types/Orden.type';
import MuiAlertComponent from '../../../../components/MuiAlertsComponent';
import { createSolicitudDadoBaja } from '../../services/solicitudesDadoBajaService';

interface ResultadoOrdenOtrosProps {
  idOrden?: string;
  idClient?: string;
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


const ResultadoOrdenOtros: React.FC<ResultadoOrdenOtrosProps> = ({ idOrden, resultadoOrden, onUpdate, idClient }) => {
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
      setComentariosFinales(resultadoOrden.comentarios_finales);
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

  // Función para agregar una nueva alerta
  const addAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message, severity }]);
  };

  const now = new Date();
  const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const createSolicitudDadoBajaIfNeeded = async () => {
    if (solicitudDarBaja) {
      const solicitudData = {
        id_solicitud_baja_estado: '6642654cc858b4a7a115053c',
        id_cliente: idClient,
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
    if (!idOrden || comentariosFinales.trim() === '') {
      addAlert('Todos los campos son requeridos.', 'error');
      return;
    }
  
    const resultadoOrden = {
      comentarios_finales: comentariosFinales.trim(),
      solicitud_dar_baja: solicitudDarBaja,
    };
  
    try {
      const response = await updateOrden(token, idOrden, { resultado_orden: resultadoOrden });
      console.log(response);
      await createSolicitudDadoBajaIfNeeded(); 
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
                                 
                                 <div className="resultOrdenOtros-box-final-comments">
                                   <div className="resultOrden-box-text-wrapper">Ingrese los comentarios finales: *</div>
                                   <textarea 
                                   className="resultOrden-box-final-comments-input"
                                   placeholder='Comentarios...'
                                   value={comentariosFinales}
                                   onChange={(e) => setComentariosFinales(e.target.value)}  
                                   disabled={readOnly}
                                    />
                                 </div>
                                 <div className="resultOrdenOtros-box-dado-baja-section">
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
                                    <button className="resultOrdenOtros-update-button" onClick={handleSubmit}>
                                      Generar Resultado
                                    </button>
                                  )}
                            </div>
                        </div>
                </div>
            </div>
  );
};

export default ResultadoOrdenOtros;