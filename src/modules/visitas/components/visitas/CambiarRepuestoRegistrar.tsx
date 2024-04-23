import React, { useEffect, useState } from 'react';
import { getVisitaById, updateVisita } from '../../services/visitasService'; // Asegúrate de que las rutas sean correctas
import { CircularProgress } from '@mui/material';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/CambiarRepuestoRegistrar.css'; // Asegúrate de que la ruta de los estilos sea correcta
import { getAllRepuestosEquipos } from '../../../equipos/services/repuestosEquiposService';
interface CambiarRepuestoRegistrarProps {
  idVisita: string;
  onActividadesUpdated: () => void;
}

interface Repuesto {
    _id: string;
    repuesto_name: string;
    repuesto_precio: number; 
    id_cliente: {
      _id: string;
    };
  }
  

const CambiarRepuestoRegistrar: React.FC<CambiarRepuestoRegistrarProps> = ({ idVisita, onActividadesUpdated }) => {
  const token = useSessionStorage('sessionJWTToken');
  const [observacion, setObservacion] = useState('');
  const [idRepuesto, setIdRepuesto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [valorUnitario, setValorUnitario] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [idRepuestoSeleccionado, setIdRepuestoSeleccionado] = useState('');
  
// visita && visita.id_orden && visita.id_orden.id_solicitud_servicio && visita.id_orden.id_solicitud_servicio.id_equipo && visita.id_orden.id_solicitud_servicio.id_equipo.id_sede && visita.id_orden.id_solicitud_servicio.id_equipo.id_sede.id_client._id;

useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      const visita = await getVisitaById(token, idVisita);
      console.log(visita._id); // Se imprime correctamente el _id de la visita
      // La propiedad 'id_orden' es un arreglo, por lo que accedemos al primer elemento con [0]
      console.log(visita.id_orden[0]); // Ahora debería mostrar el contenido de 'id_orden' correctamente
      console.log(visita.id_orden[0].id_solicitud_servicio); // Ahora debería mostrar 'id_solicitud_servicio'
  
      let idCliente = '';
      // Verificamos que cada paso de la cadena de acceso exista antes de acceder al siguiente
      if (visita && visita.id_orden && visita.id_orden[0] && visita.id_orden[0].id_solicitud_servicio && visita.id_orden[0].id_solicitud_servicio.id_equipo && visita.id_orden[0].id_solicitud_servicio.id_equipo.id_sede && visita.id_orden[0].id_solicitud_servicio.id_equipo.id_sede.id_client && visita.id_orden[0].id_solicitud_servicio.id_equipo.id_sede.id_client._id) {
        idCliente = visita.id_orden[0].id_solicitud_servicio.id_equipo.id_sede.id_client._id;
      }
  
      if (idCliente) {
        const repuestosDisponibles = await getAllRepuestosEquipos(token);
        // Asegúrate de que 'getAllRepuestosEquipos' devuelve la propiedad 'repuestoEquipos' y no todo el objeto de respuesta
        const repuestosFiltrados = repuestosDisponibles.filter((repuesto: Repuesto) => repuesto.id_cliente._id === idCliente);
        setRepuestos(repuestosFiltrados);
      }
  
      setIsLoading(false);
    };
  
    fetchDatos();
  }, [token, idVisita]);
  

  const handleChangeRepuesto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setIdRepuestoSeleccionado(selectedId);
  
    // Encuentra el repuesto seleccionado basado en el id
    const selectedRepuesto = repuestos.find(repuesto => repuesto._id === selectedId);
  
    // Si se encuentra el repuesto, actualiza el valorUnitario con el precio del repuesto
    if (selectedRepuesto) {
      setValorUnitario(selectedRepuesto.repuesto_precio);
      setIdRepuesto(selectedId);
    } else {
      // Si por alguna razón no se encuentra el repuesto, resetea el valorUnitario
      setValorUnitario(0);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ( !idRepuesto || cantidad <= 0 || valorUnitario <= 0) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const total = cantidad * valorUnitario;
    const now = new Date();
    const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const visitaActual = await getVisitaById(token, idVisita);

    const actividadesActualizadas = [
      ...visitaActual.actividades,
      {
        id_protocolo: '65a93d9e89a02ef211e75ec5',
        id_repuesto: idRepuesto,
        cantidad: cantidad,
        valor_unitario: valorUnitario,
        total: total,
        date_created: formattedDateCreated,
      }
    ];

    const datosActualizados = {
      ...visitaActual,
      actividades: actividadesActualizadas
    };

    try {
      if (token && idVisita) {
        await updateVisita(token, idVisita, datosActualizados);
        alert('Actividad "Cambiar Repuesto" agregada a la visita con éxito.');
        onActividadesUpdated(); 
      } else {
        alert('No se encontró token de sesión.');
      }
    } catch (error) {
      console.error('Error al actualizar la visita:', error);
      alert('Error al actualizar la visita.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="CambiarRepuestoRegistrar-actividad">
        <form onSubmit={handleSubmit}>
                <div className="CambiarRepuestoRegistrar-cambiar-repuesto">
                  <div className="CambiarRepuestoRegistrar-overlap-group">
                    <div className="CambiarRepuestoRegistrar-cambiar-repuestot">CAMBIAR REPUESTO</div>
                    <label className="CambiarRepuestoRegistrar-select-repuestot" htmlFor="idRepuesto">Seleccione el repuesto: *</label>
                    <select className="CambiarRepuestoRegistrar-select-repuestoi"
                    id="idRepuesto"
                    value={idRepuestoSeleccionado}
                    onChange={handleChangeRepuesto}
                    >
                    <option value="">Seleccione un repuesto</option>
                            {repuestos.map(repuesto => (
                                <option key={repuesto._id} value={repuesto._id}>
                                {repuesto.repuesto_name}
                                </option>
                            ))}
                    </select>
                    <label className="CambiarRepuestoRegistrar-select-quantityt" htmlFor="cantidad">Seleccione la cantidad: *</label>
                    <input
                    className="CambiarRepuestoRegistrar-select-quantity-i"
                    type="number"
                    id="cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    placeholder="Cantidad"
                    />
                    <div className="CambiarRepuestoRegistrar-separator"/>
                    <label className="CambiarRepuestoRegistrar-valor-unitariot" htmlFor="valorUnitario">Valor unitario: *</label>
                    <input
                    className="CambiarRepuestoRegistrar-valor-unitarioi"
                    type="number"
                    id="valorUnitario"
                    value={valorUnitario}
                    onChange={(e) => setValorUnitario(Number(e.target.value))}
                    placeholder="Valor unitario"
                    />
                    <label className="CambiarRepuestoRegistrar-total-t" htmlFor="total">Total: *</label>
                    <input
                    className="CambiarRepuestoRegistrar-total-input"
                    type="text" // Cambiado a text para evitar problemas con números negativos
                    id="total"
                    value={(cantidad * valorUnitario).toFixed(2)}  // Formatear para tener dos decimales
                    readOnly 
                    />
                  </div>
                  <button className="CambiarRepuestoRegistrar-overlap" type='submit'>
                    CREAR ACTIVIDAD
                  </button>
                </div>

        </form>
    </div>
  );
}

export default CambiarRepuestoRegistrar;
