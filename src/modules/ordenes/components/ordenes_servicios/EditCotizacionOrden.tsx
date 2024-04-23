import React, { useEffect, useState } from 'react';
import { updateCotizacion, getPresignedUrlForFirma, getCotizacionById, getPresignedUrlForGetFirma } from '../../services/cotizacionesService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getAllRepuestosEquipos } from '../../../equipos/services/repuestosEquiposService';
import { Cotizacion } from '../../utils/types/Cotizacion.type';
import SignaturePad from 'react-signature-canvas';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import EditIcon from '@mui/icons-material/Edit';
import './styles/RegisterCotizacionOrden.css';

interface EditCotizacionOrdenProps {
  idCotizacion: string; // ID de la cotización a editar
  idOrden?: string;
  onCotizacionSuccess: () => void;
  onCancel: () => void;
  idCliente?: string;
  nombreCliente?: string;
}

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

const EditCotizacionOrden: React.FC<EditCotizacionOrdenProps> = ({
  idOrden,
  idCotizacion,
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
  const [isEditingSignature, setIsEditingSignature] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = useSessionStorage('sessionJWTToken');
  const userId = useSessionStorage('userId');
  const userName = useSessionStorage('userName');

  const [repuestosEquipo, setRepuestosEquipo] = useState<RepuestoEquipo[]>([]);
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState<Repuesto[]>([]);
  const [firmaGuardada, setFirmaGuardada] = useState(false);
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);


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
          valor_unitario: repuestoSeleccionado.repuesto_precio
        }
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

  useEffect(() => {
    const fetchCotizacionDetails = async () => {
      if (!idCotizacion || !token) return;
      try {
        const cotizacionData = await getCotizacionById(token, idCotizacion);
        setMensaje(cotizacionData.mensaje);
        setCondiciones(cotizacionData.condiciones);
        setFirma(cotizacionData.firma);
        setItemsAdicionales(cotizacionData.items_adicionales || []);
        const repuestosTransformados = cotizacionData.ids_repuestos.map((repuesto: Repuesto) => ({
          id_repuesto: repuesto.id_repuesto,
          cantidad: repuesto.cantidad,
          valor_unitario: repuesto.valor_unitario
        }));
        setRepuestosSeleccionados(repuestosTransformados);
  

        if (cotizacionData.firma) {
          const urlPath = new URL(cotizacionData.firma).pathname;
          const s3ObjectKey = urlPath.substring(1);
          const presignedUrlResponse = await getPresignedUrlForGetFirma(token, s3ObjectKey);
          if (presignedUrlResponse.presignedUrl) {
            setFirma(presignedUrlResponse.presignedUrl);
          }
        }
      } catch (error) {
        console.error("Error al cargar los detalles de la cotización:", error);
        setError("No se pudo cargar la cotización");
      }
    };

    fetchCotizacionDetails();
  }, [idCotizacion, token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError('');
    
      if (!token) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }
      let uploadedImageUrl = firma;
      // Solo proceder si hay una nueva firma guardada
      if (firmaGuardada) {
        try {
          // Convertir la firma Data URL a Blob para la subida
          const blob = await fetch(firma).then(res => res.blob());
          const fileName = `firma-${userId}-${Date.now()}.png`;
          // Obtener la URL firmada desde el servidor
          const presignedUrlObject = await getPresignedUrlForFirma(token, fileName);
          const presignedUrl = presignedUrlObject.url;
    
          console.log('Presigned URL: ', presignedUrl);
          // Subir la imagen de la firma a S3 usando la URL firmada
          await fetch(presignedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'image/png' },
            body: blob,
          });
    
          // La URL de la imagen subida en S3 se deriva de la URL firmada sin la cadena de consulta
          const uploadedImageUrl = presignedUrl.split('?')[0];
          const cotizacionData = {
            ids_repuestos: repuestosSeleccionados,
            items_adicionales: itemsAdicionales,
            mensaje,
            condiciones,
            firma: uploadedImageUrl,
          };
    
          await updateCotizacion(token, idCotizacion, cotizacionData);
          setLoading(false);
          onCotizacionSuccess();
        } catch (error) {
          console.error('Error al registrar la cotización:', error);
          setError('Ocurrió un error al registrar la cotización');
          setLoading(false);
        }
      } else {
        // No hay nueva firma, actualizar solo otros datos
        const cotizacionData = {
          ids_repuestos: repuestosSeleccionados,
          items_adicionales: itemsAdicionales,
          mensaje,
          condiciones,
          firma,  // Usar la firma existente
        };
    
        await updateCotizacion(token, idCotizacion, cotizacionData);
        setLoading(false);
        onCotizacionSuccess();
      }
    };

        const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

        const toggleSignatureEdit = () => {
          if (!isEditingSignature) {
            setIsEditingSignature(true);
          } else {
            setIsEditingSignature(false);
            // fetchCotizacionDetails();  // Re-fetch para restaurar la firma original
          }
        };
        
        const guardarFirma = () => {
          if (signaturePad && !signaturePad.isEmpty()) {
            const firmaImagen = signaturePad.toDataURL("image/png");
            setFirma(firmaImagen);
            setFirmaGuardada(true);
            setIsEditingSignature(false);
          }
        };
      
        const limpiarFirma = () => {
          if (signaturePad) {
            signaturePad.clear();
            setFirmaGuardada(false);
          }
        };
      
  return (
    <form onSubmit={handleSubmit} className="RegisterCotizacionOrden-box">
      <div className='RegisterCotizacionOrden-register-container'>
          <div className="RegisterCotizacionOrden-overlap">
            <div className="RegisterCotizacionOrden-edit-title-t">EDITAR COTIZACIÓN - {idCotizacion}</div>
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

          
       
        {repuestosSeleccionados.map((repuesto, index) => (
          <div key={index} className='RegisterCotizacionOrden-repuestos-selected-div'>
            <div className='RegisterCotizacionOrden-repuestos-selected-title'>Repuesto</div>
            <p className='RegisterCotizacionOrden-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name}</p>
            <div className='RegisterCotizacionOrden-repuestos-cantidad-title'>Cantidad</div>
            <input
              type="number"
              className='RegisterCotizacionOrden-repuestos-cantidad-input'
              value={repuesto.cantidad}
              onChange={(e) => actualizarRepuestoSeleccionado(index, 'cantidad', Number(e.target.value))}
              required
            />
            <div className='RegisterCotizacionOrden-repuestos-valoru-title'>Valor Unitario</div>
            <input
              type="number"
              className='RegisterCotizacionOrden-repuestos-valoru-input'
              value={repuesto.valor_unitario}
              onChange={(e) => actualizarRepuestoSeleccionado(index, 'valor_unitario', Number(e.target.value))}
              required
            />
            <CancelIcon className='RegisterCotizacionOrden-repuestos-remove-icon' onClick={() => removerRepuestoSeleccionado(index)} />
          </div>
        ))}

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
            {!isEditingSignature ? (
                <>
                  <img className="RegisterCotizacionOrden-firma-img" src={firma || 'placeholder.png'} alt="Firma existente" />
                  <EditIcon className="RegisterCotizacionOrden-firma-edit-icon" onClick={toggleSignatureEdit} />
                </>
              ) : (
                <>
                  <SignaturePad
                    penColor="black"
                    canvasProps={{
                      className: "RegisterCotizacionOrden-firma-signatureCanvas",
                      style: { width: '312px', height: '100px', position: 'relative', backgroundColor: '#d9d9d9', top: '36px', left: '28px', borderRadius: '10px'}
                    }}
                    ref={setSignaturePad}
                  />
                  <SaveAltIcon
                    className={`RegisterCotizacionOrden-firma-save-icon ${firmaGuardada ? 'RegisterCotizacionOrden-firma-save-icon-active' : ''}`}
                    onClick={guardarFirma}
                  />
                  <CleaningServicesIcon className="RegisterCotizacionOrden-firma-clear-icon" onClick={limpiarFirma} />
                  <CancelIcon className="RegisterCotizacionOrden-firma-cancel-icon" onClick={toggleSignatureEdit} />
                </>
            )}
          </div>


                  
          <button className="RegisterCotizacionOrden-register-button" disabled={loading} type='submit'>
            {loading ? 'Cargando...' : 'Actualizar Cotización'}
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

export default EditCotizacionOrden;
