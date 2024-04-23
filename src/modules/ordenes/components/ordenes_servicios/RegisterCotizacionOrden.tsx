import React, { useEffect, useState } from 'react';
import { createCotizacion, getPresignedUrlForFirma } from '../../services/cotizacionesService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getAllRepuestosEquipos } from '../../../equipos/services/repuestosEquiposService';
import SignaturePad from 'react-signature-canvas';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import './styles/RegisterCotizacionOrden.css'; 

interface RegisterCotizacionOrdenProps {
    idOrden: string;
    onCotizacionSuccess: () => void;
    onCancel: () => void;
    idCliente?: string;
    nombreCliente?: string;
  }
  
  // Definir un tipo para los repuestos y elementos adicionales
  interface Repuesto {
    id_repuesto: string;
    cantidad: number;
    valor_unitario: number;
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
  }
  
  const RegisterCotizacionOrden: React.FC<RegisterCotizacionOrdenProps> = ({
    idOrden,
    onCotizacionSuccess,
    onCancel,
    idCliente,
    nombreCliente,
  }) => {
    const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
    const [itemsAdicionales, setItemsAdicionales] = useState<ItemAdicional[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [condicion, setCondicion] = useState('');
    const [condiciones, setCondiciones] = useState('');
    const [firma, setFirma] = useState('');
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const token = useSessionStorage('sessionJWTToken');
    const userId = useSessionStorage('userId');
    const userName = useSessionStorage('userName');
    const estadoPendienteId = "6613312f445b229362edc87e"; 

    const [repuestosEquipo, setRepuestosEquipo] = useState<RepuestoEquipo[]>([]);
    const [repuestosSeleccionados, setRepuestosSeleccionados] = useState<Repuesto[]>([]);
    const [firmaGuardada, setFirmaGuardada] = useState(false);

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
          { id_repuesto: repuestoSeleccionado._id, cantidad: 1, valor_unitario: repuestoSeleccionado.repuesto_precio }
        ]);
      };
    
    const actualizarRepuestoSeleccionado = (index: number, campo: 'cantidad' | 'valor_unitario', valor: number) => {
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
        const nuevoItem: ItemAdicional = { descripcion: '', cantidad: 1, valor_unitario: 0 };
        setItemsAdicionales([...itemsAdicionales, nuevoItem]);
    };
    
    // Actualizar un item adicional existente
    const actualizarItemAdicional = (index: number, campo: keyof ItemAdicional, valor: string | number) => {
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
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError('');
    
      if (!token) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }
    
      try {
        if (firma) {
          // Convertir la firma Data URL a Blob para la subida
          const blob = await fetch(firma).then(res => res.blob());
          const fileName = `firma-${userId}-${Date.now()}.png`;
          // Obtener la URL firmada desde el servidor
          const presignedUrlObject = await getPresignedUrlForFirma(token, fileName);
          const presignedUrl = presignedUrlObject.url; // Asegúrate de que esto accede a la propiedad 'url' del objeto

          console.log('Presigned URL: ', presignedUrl);
          // Subir la imagen de la firma a S3 usando la URL firmada
          await fetch(presignedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'image/png' },
            body: blob,
          });
          const observacionEstado = `Estado pendiente generado, usuario: ${userId}`;
          // La URL de la imagen subida en S3 se deriva de la URL firmada sin la cadena de consulta
          const uploadedImageUrl = presignedUrl.split('?')[0];
            const cotizacionData = {
              id_cliente: idCliente,
              id_orden: idOrden, // Usar idOrden proporcionado como prop
              id_creador: userId,
              id_estado: estadoPendienteId,
              ids_repuestos: repuestosSeleccionados,
              items_adicionales: itemsAdicionales,
              fecha_creation: formattedDateCreated,
              cambio_estado: formattedDateCreated,
              mensaje,
              observacion_estado: observacionEstado,
              condiciones,
              firma:uploadedImageUrl,
              firma_username: userName,
            };
  
              // Crear la cotización con la firma incluida
                  await createCotizacion(token, cotizacionData);
                }

                setLoading(false);
                onCotizacionSuccess(); // Notificar al componente padre sobre el éxito
              } catch (error) {
                console.error('Error al registrar la cotización:', error);
                setError('Ocurrió un error al registrar la cotización');
                setLoading(false);
              }
            };

          const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

          const guardarFirma = () => {
            if (signaturePad) {
              const firmaImagen = signaturePad.toDataURL("image/png");
              setFirma(firmaImagen);
              setFirmaGuardada(true); // Indica que la firma ha sido guardada
            }
          };
          
          const limpiarFirma = () => {
            if (signaturePad) {
              signaturePad.clear();
              setFirmaGuardada(false); // Restablece el indicador de firma guardada
            }
          };
          
  return (
    <form onSubmit={handleSubmit} className="RegisterCotizacionOrden-box">
      <div className='RegisterCotizacionOrden-register-container'>
          <div className="RegisterCotizacionOrden-overlap">
            <div className="RegisterCotizacionOrden-title-t">AGREGAR COTIZACIÓN</div>
          </div>

        <div className="RegisterCotizacionOrden-register-cotizacion">
        <div className='RegisterCotizacionOrden-client-t'>Cliente</div>
          <div className='RegisterCotizacionOrden-client-name'>{nombreCliente}</div>
          <div className='RegisterCotizacionOrden-orden-id-t'>Orden Relacionada (opcional)</div>
          <div className='RegisterCotizacionOrden-orden-id'>{idOrden}</div>
          <div className='RegisterCotizacionOrden-mensaje-t'>Mensaje: *</div>
          <textarea
            className="RegisterCotizacionOrden-mensaje-value"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Mensaje"
            required
          />
          <div className='RegisterCotizacionOrden-condicion-t'>Condiciones: *</div>
          <textarea
            className="RegisterCotizacionOrden-condicion-value"
            value={condiciones}
            onChange={(e) => setCondiciones(e.target.value)}
            placeholder="Condiciones"
            required
          />
          
          <div className="RegisterCotizacionOrden-repuestos-title">Repuestos</div>
          <select onChange={(e) => handleRepuestoChange(e.target.value)} className="RegisterCotizacionOrden-repuestos-select">
          <option value="">Seleccione un repuesto</option>
          {repuestosEquipo.map((repuesto) => (
              <option key={repuesto._id} value={repuesto._id}>
              {repuesto.repuesto_name}
              </option>
          ))}
          </select>

          
          {repuestosSeleccionados.map((repuesto, index) => {
              const repuestoEncontrado = repuestosEquipo.find(r => r._id === repuesto.id_repuesto);

              // Si el repuesto no se encuentra, no renderizamos este bloque
              if (!repuestoEncontrado) {
                  return null;
              }

              return (
                  <div key={index} className='RegisterCotizacionOrden-repuestos-selected-div'>
                  <div className='RegisterCotizacionOrden-repuestos-selected-title'>Repuesto</div>
                  <p className='RegisterCotizacionOrden-repuestos-selected-value'>{repuestoEncontrado.repuesto_name}</p>
                  <div className='RegisterCotizacionOrden-repuestos-cantidad-title'>Cantidad</div>
                  <input
                      className='RegisterCotizacionOrden-repuestos-cantidad-input'
                      type="number"
                      value={repuesto.cantidad}
                      onChange={(e) => actualizarRepuestoSeleccionado(index, 'cantidad', Number(e.target.value))}
                      required
                  />
                  <div className='RegisterCotizacionOrden-repuestos-valoru-title'>Valor Unitario</div>
                  <input
                      className='RegisterCotizacionOrden-repuestos-valoru-input'
                      type="number"
                      value={repuesto.valor_unitario}
                      onChange={(e) => actualizarRepuestoSeleccionado(index, 'valor_unitario', Number(e.target.value))}
                      required
                  />
                  <CancelIcon  className='RegisterCotizacionOrden-repuestos-remove-icon' type="button" onClick={() => removerRepuestoSeleccionado(index)}/>
                  </div>
              );
              })}

          <div className='RegisterCotizacionOrden-items-div'>
              <div className='RegisterCotizacionOrden-items-title'>Items Adicionales</div>
              <AddCircleIcon className='RegisterCotizacionOrden-items-add-icon' onClick={agregarItemAdicional}/>
              {itemsAdicionales.map((item, index) => (
              <div key={index} className='RegisterCotizacionOrden-items-section'>
                  <div className='RegisterCotizacionOrden-items-description-title'>Descripción</div>
                  <textarea
                  className='RegisterCotizacionOrden-items-description-input'
                  value={item.descripcion}
                  onChange={(e) => actualizarItemAdicional(index, 'descripcion', e.target.value)}
                  placeholder="Descripción"
                  required
                  />
                  <div className='RegisterCotizacionOrden-items-cantidad-title'>Cantidad</div>
                  <input
                  className='RegisterCotizacionOrden-items-cantidad-input'
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => actualizarItemAdicional(index, 'cantidad', Number(e.target.value))}
                  placeholder="Cantidad"
                  required
                  />
                  <div className='RegisterCotizacionOrden-items-valoru-title'>Valor Unitario</div>
                  <input
                  className='RegisterCotizacionOrden-items-valoru-input'
                  type="number"
                  value={item.valor_unitario}
                  onChange={(e) => actualizarItemAdicional(index, 'valor_unitario', Number(e.target.value))}
                  placeholder="Valor unitario"
                  required
                  />
                  <CancelIcon className='RegisterCotizacionOrden-items-remove-icon' onClick={() => eliminarItemAdicional(index)}/>
              </div>
              ))}

          </div>


          <div className="RegisterCotizacionOrden-firma">
            <div className="RegisterCotizacionOrden-firma-title">Firma</div>
            <div className="RegisterCotizacionOrden-firma-username">{userName}</div>
            <SignaturePad
              penColor="black"
              canvasProps={{
                className: "RegisterCotizacionOrden-firma-signatureCanvas",
                style: { width: '312px', height: '100px', position: 'relative', backgroundColor: '#d9d9d9', top: '36px', left: '28px', borderRadius: '10px'}
              }}
              ref={(ref) => setSignaturePad(ref)}
            />
            <SaveAltIcon 
            className={`RegisterCotizacionOrden-firma-save-icon ${firmaGuardada ? 'RegisterCotizacionOrden-firma-save-icon-active' : ''}`}
            onClick={guardarFirma}></SaveAltIcon>
            <CleaningServicesIcon className="RegisterCotizacionOrden-firma-clear-icon" onClick={limpiarFirma} />
          </div>


                  
          <button className="RegisterCotizacionOrden-register-button" disabled={loading} type='submit'>
            {loading ? 'Cargando...' : 'Registrar Cotización'}
          </button>
          <button className="RegisterCotizacionOrden-cancel-button" type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          
          {error && <p className="RegisterCotizacionOrden-error-message">{error}</p>}
        </div>

      </div>
    
    </form>
  );
};

export default RegisterCotizacionOrden;
