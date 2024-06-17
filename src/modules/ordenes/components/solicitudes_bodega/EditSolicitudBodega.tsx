import React, { useEffect, useState } from 'react';
import { createCotizacion, getPresignedUrlForFirma } from '../../services/cotizacionesService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getAllRepuestosEquipos } from '../../../equipos/services/repuestosEquiposService';
import './styles/RegisterSolicitudBodega.css';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Switch from '@mui/material/Switch';
import { createSolicitudBodega, getSolicitudBodegaById, updateSolicitudBodega } from '../../services/solicitudesBodegaService';

interface EditSolicitudBodegaProps {
    idSolicitudBodega: string;
    idOrden?: string;
    onSolicitudBodegaSuccess: () => void;
    onCancel: () => void;
    idCliente?: string;
    nombreCliente?: string;
  }
  
  // Definir un tipo para los repuestos y elementos adicionales
  interface Repuesto {
    id_repuesto: {
      _id: string;
      repuesto_name: string;
      repuesto_precio: number;
      id_cliente: {
        _id: string;
      };
    };
    cantidad: number;
    valor_unitario: number;
    sum_client: boolean;
  }
  interface RepuestoEquipo {
    _id: string;
    repuesto_name: string;
    repuesto_precio: number;
    id_cliente: {
      _id: string;
    };
  }
  
  
  interface ItemAdicional {
    descripcion: string;
    cantidad: number;
    valor_unitario: number;
    sum_client: boolean;
  }
  
  const EditSolicitudBodega: React.FC<EditSolicitudBodegaProps> = ({
    idOrden,
    onSolicitudBodegaSuccess,
    onCancel,
    idCliente,
    nombreCliente,
    idSolicitudBodega,
  }) => {
    const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
    const [itemsAdicionales, setItemsAdicionales] = useState<ItemAdicional[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [condicion, setCondicion] = useState('');
    const [condiciones, setCondiciones] = useState('');
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const token = useSessionStorage('sessionJWTToken');
    const [solicitud, setSolicitud] = useState(null);
    const userId = useSessionStorage('userId');
    const userName = useSessionStorage('userName');
    const estadoPendienteId = "6613312f445b229362edc87e"; 

    const [repuestosEquipo, setRepuestosEquipo] = useState<RepuestoEquipo[]>([]);
    const [repuestosSeleccionados, setRepuestosSeleccionados] = useState<Repuesto[]>([]);

    const now = new Date();
    const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    useEffect(() => {
        const fetchRepuestos = async () => {
          if (!token || !idCliente) return;
      
          try {
            const repuestosDisponibles = await getAllRepuestosEquipos(token);
            // Filtrar los repuestos por el ID del cliente
            const repuestosFiltrados = repuestosDisponibles.filter((repuesto: RepuestoEquipo ) => repuesto.id_cliente._id === idCliente);
            setRepuestosEquipo(repuestosFiltrados);
          } catch (error) {
            console.error("Error al cargar repuestos:", error);
          }
        };
        fetchRepuestos();
      }, [token, idCliente]);
      const handleRepuestoChange = (id_repuesto: string) => {
        const repuestoSeleccionado = repuestosEquipo.find(repuesto => repuesto._id === id_repuesto);
      
        if (!repuestoSeleccionado) return;
      
        setRepuestosSeleccionados(prevRepuestos => [
          ...prevRepuestos,
          {
            id_repuesto: {
              _id: repuestoSeleccionado._id,
              repuesto_name: repuestoSeleccionado.repuesto_name,
              repuesto_precio: repuestoSeleccionado.repuesto_precio,
              id_cliente: repuestoSeleccionado.id_cliente
            },
            cantidad: 1,
            valor_unitario: repuestoSeleccionado.repuesto_precio,
            sum_client: false,
          }
        ]);
      };
      
      
    
      const actualizarRepuestoSeleccionado = (index: number, campo: keyof Repuesto, valor: any) => {
        const nuevosRepuestos = repuestosSeleccionados.map((repuesto, i) => {
          if (i === index) {
            return { ...repuesto, [campo]: valor };
          }
          return repuesto;
        });
      
        setRepuestosSeleccionados(nuevosRepuestos);
      };

    const removerRepuestoSeleccionado = (indexParaRemover: number) => {
        setRepuestosSeleccionados(repuestosSeleccionados.filter((_, index) => index !== indexParaRemover));
    };
    
    // Añadir un nuevo item adicional
    const agregarItemAdicional = () => {
      const nuevoItem: ItemAdicional = {
        descripcion: '',
        cantidad: 1,
        valor_unitario: 0,
        sum_client: false  // Inicializar sum_client para nuevos items adicionales
      };
      setItemsAdicionales([...itemsAdicionales, nuevoItem]);
    };
    
    
    // Actualizar un item adicional existente
    const actualizarItemAdicional = (index: number, campo: keyof ItemAdicional, valor: any) => {
      const nuevosItems = itemsAdicionales.map((item, i) => {
        if (i === index) {
          return { ...item, [campo]: valor };
        }
        return item;
      });
      setItemsAdicionales(nuevosItems);
    };
    
    // Eliminar un item adicional
    const eliminarItemAdicional = (indexParaEliminar: number) => {
        setItemsAdicionales(itemsAdicionales.filter((_, index) => index !== indexParaEliminar));
    };

    useEffect(() => {
      const loadSolicitud = async () => {
        setLoading(true);
        try {
          const result = await getSolicitudBodegaById(token, idSolicitudBodega);
          setSolicitud(result);
          setRepuestosSeleccionados(result.ids_repuestos);
          setItemsAdicionales(result.items_adicionales);
        } catch (error) {
          console.error('Error fetching solicitud details:', error);
          setError('Failed to load solicitud details');
        }
        setLoading(false);
      };
      loadSolicitud();
    }, [token, idSolicitudBodega]);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      try {
        await updateSolicitudBodega(token, idSolicitudBodega, {
          ids_repuestos: repuestosSeleccionados,
          items_adicionales: itemsAdicionales,
        });
        onSolicitudBodegaSuccess();
      } catch (error) {
        console.error('Error updating solicitud:', error);
        setError('Error updating solicitud');
      } finally {
        setLoading(false);
      }
    };
          
  return (
    <form onSubmit={handleSubmit} className="RegisterSolicitudBodega-box">
      <div className='RegisterSolicitudBodega-register-container'>
          <div className="RegisterSolicitudBodega-edit-overlap">
            <div className="RegisterSolicitudBodega-edit-title-t">EDITAR SOLICITUD BODEGA - {idSolicitudBodega}</div>
          </div>

        <div className="RegisterSolicitudBodega-register-cotizacion">
        <div className='RegisterSolicitudBodega-client-t'>Cliente</div>
          <div className='RegisterSolicitudBodega-client-name'>{nombreCliente}</div>
          <div className='RegisterSolicitudBodega-orden-id-t'>Orden Relacionada</div>
          <div className='RegisterSolicitudBodega-orden-id'>{idOrden}</div>
       
          <div className="RegisterSolicitudBodega-repuestos-title">Repuestos</div>
          <select onChange={(e) => handleRepuestoChange(e.target.value)} className="RegisterSolicitudBodega-repuestos-select">
          <option value="">Seleccione un repuesto</option>
          {repuestosEquipo.map((repuesto) => (
              <option key={repuesto._id} value={repuesto._id}>
              {repuesto.repuesto_name}
              </option>
          ))}
          </select>

          
          {repuestosSeleccionados.map((repuesto, index) => (

                  <div key={index} className='RegisterSolicitudBodega-repuestos-selected-div'>
                  <div className='RegisterSolicitudBodega-repuestos-selected-title'>Repuesto</div>
                  <p className='RegisterSolicitudBodega-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name}</p>
                  <div className='RegisterSolicitudBodega-repuestos-cantidad-title'>Cantidad</div>
                  <input
                      className='RegisterSolicitudBodega-repuestos-cantidad-input'
                      type="number"
                      value={repuesto.cantidad}
                      onChange={(e) => actualizarRepuestoSeleccionado(index, 'cantidad', Number(e.target.value))}
                      required
                  />
                  <div className='RegisterSolicitudBodega-repuestos-valoru-title'>Valor Unitario</div>
                  <input
                      className='RegisterSolicitudBodega-repuestos-valoru-input'
                      type="number"
                      value={repuesto.valor_unitario}
                      onChange={(e) => actualizarRepuestoSeleccionado(index, 'valor_unitario', Number(e.target.value))}
                      required
                  />
                  <div className='RegisterSolicitudBodega-repuestos-switch-label'>Sum Cliente</div>
                  <label className="RegisterSolicitudBodega-repuestos-switch">
                    <input
                      className='RegisterSolicitudBodega-repuestos-switch-input'
                      type="checkbox"
                      name="sum_client"
                      checked={repuesto.sum_client}
                      onChange={(e) => actualizarRepuestoSeleccionado(index, 'sum_client', e.target.checked)}
                    />
                      <span className="RegisterSolicitudBodega-slider round"></span>
                  </label>
                  <CancelIcon  className='RegisterSolicitudBodega-repuestos-remove-icon' type="button" onClick={() => removerRepuestoSeleccionado(index)}/>
                  </div>
          ))}

          <div className='RegisterSolicitudBodega-items-div'>
              <div className='RegisterSolicitudBodega-items-title'>Items Adicionales</div>
              <AddCircleIcon className='RegisterSolicitudBodega-items-add-icon' onClick={agregarItemAdicional}/>
              {itemsAdicionales.map((item, index) => (
              <div key={index} className='RegisterSolicitudBodega-items-section'>
                  <div className='RegisterSolicitudBodega-items-description-title'>Descripción</div>
                  <textarea
                  className='RegisterSolicitudBodega-items-description-input'
                  value={item.descripcion}
                  onChange={(e) => actualizarItemAdicional(index, 'descripcion', e.target.value)}
                  placeholder="Descripción"
                  required
                  />
                  <div className='RegisterSolicitudBodega-items-cantidad-title'>Cantidad</div>
                  <input
                  className='RegisterSolicitudBodega-items-cantidad-input'
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => actualizarItemAdicional(index, 'cantidad', Number(e.target.value))}
                  placeholder="Cantidad"
                  required
                  />
                  <div className='RegisterSolicitudBodega-items-valoru-title'>Valor Unitario</div>
                  <input
                  className='RegisterSolicitudBodega-items-valoru-input'
                  type="number"
                  value={item.valor_unitario}
                  onChange={(e) => actualizarItemAdicional(index, 'valor_unitario', Number(e.target.value))}
                  placeholder="Valor unitario"
                  required
                  />

                  <div className='RegisterSolicitudBodega-repuestos-switch-label'>Sum Cliente</div>
                  <label className="RegisterSolicitudBodega-repuestos-switch">
                    <input
                      className='RegisterSolicitudBodega-repuestos-switch-input'
                      type="checkbox"
                      name="sum_client"
                      checked={item.sum_client}
                      onChange={(e) => actualizarItemAdicional(index, 'sum_client', e.target.checked)}
                    />
                      <span className="RegisterSolicitudBodega-slider round"></span>
                  </label>
                  <CancelIcon className='RegisterSolicitudBodega-items-remove-icon' onClick={() => eliminarItemAdicional(index)}/>
              </div>
              ))}

          </div>
                  
          <button className="RegisterSolicitudBodega-register-button" disabled={loading} type='submit'>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          <button className="RegisterSolicitudBodega-cancel-button" type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          
          {error && <p className="RegisterSolicitudBodega-error-message">{error}</p>}
        </div>

      </div>
    
    </form>
  );
};

export default EditSolicitudBodega;
