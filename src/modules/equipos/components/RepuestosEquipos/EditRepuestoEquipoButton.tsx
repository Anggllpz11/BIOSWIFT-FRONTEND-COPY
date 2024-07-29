import React, { useEffect, useState } from 'react';
import './styles/EditRepuestoEquipoButton.css'; // Asegúrate de tener la ruta correcta
import { AxiosRequestConfig } from 'axios';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { updateRepuestoEquipo } from '../../services/repuestosEquiposService';
import { searchClientByKeyword } from '../../../users/services/clientsService';

type EditRepuestoEquipoButtonProps = {
  repuestoEquipoId: string;
  onEditSuccess: () => void;
  onCancel: () => void;
  initialData: any;
};

const EditRepuestoEquipoButton: React.FC<EditRepuestoEquipoButtonProps> = ({ repuestoEquipoId, onEditSuccess, onCancel, initialData }) => {
  const [repuestoEquipoData, setRepuestoEquipoData] = useState(initialData);

  const loggedIn = useSessionStorage('sessionJWTToken');

  const [clientKeyword, setClientKeyword] = useState(initialData.id_cliente ? initialData.id_cliente.client_name : '');
  const [clientResults, setClientResults] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchClients = async () => {
      if (clientKeyword.trim()) {
        try {
          const results = await searchClientByKeyword(loggedIn, clientKeyword);
          setClientResults(results);
        } catch (error) {
          console.error('Error searching for clients:', error);
        }
      } else {
        setClientResults([]);
      }
    };

    fetchClients();
  }, [clientKeyword, loggedIn]);

  const handleSelectClient = (client: any) => {
    setRepuestoEquipoData({ ...repuestoEquipoData, id_cliente: client._id });
    setClientKeyword(client.client_name);
    setClientResults([]);
  };

  const handleEdit = async () => {
    try {
      const token = loggedIn;

      // Mapear los campos relacionados al formato correcto
      const mappedData = {
        id_cliente: repuestoEquipoData.id_cliente._id || repuestoEquipoData.id_cliente, // Agregamos el campo id_cliente
        repuesto_name: repuestoEquipoData.repuesto_name,
        repuesto_precio: repuestoEquipoData.repuesto_precio,
        // Agrega más campos según sea necesario
      };

      await updateRepuestoEquipo(token, repuestoEquipoId, mappedData);
      onEditSuccess();
      // Mostrar la alerta y luego recargar la página después de 2 segundos
      window.alert(`Repuesto Equipo ID: ${repuestoEquipoId} actualizado satisfactoriamente`);
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milisegundos (2 segundos)
    } catch (error) {
      console.error('Error al editar el repuesto equipo:', error);
    }
  };

  return (
    <div>
    <form className="EditRepuestoEquipoButton-form">
        <div className="EditRepuestoEquipoButton-box">
          <div className="EditRepuestoEquipoButton-edit-repuesto-equipo">
            <div className="EditRepuestoEquipoButton-overlap-group">
              <div className="EditRepuestoEquipoButton-overlap">
                <div className="EditRepuestoEquipoButton-edit-title">ACTUALIZAR INFORMACIÓN DE REPUESTO</div>
                <div className="EditRepuestoEquipoButton-repuesto-id">ID: {repuestoEquipoData._id}</div>
              </div>
              <label className="EditRepuestoEquipoButton-repuesto-cliente">1. Select the related client:</label>
              <input 
                className="EditRepuestoEquipoButton-cliente-input"
                type="text"
                value={clientKeyword}
                onChange={(e) => setClientKeyword(e.target.value)}
                autoComplete="off"
                placeholder="Search client..."
              />
              {clientResults.length > 0 && (
                <ul className="EditRepuestoEquipoButton-client-search-results">
                  {clientResults.map((client) => (
                    <li key={client._id} onClick={() => handleSelectClient(client)} className="EditRepuestoEquipoButton-client-search-item">
                      {client.client_name}
                    </li>
                  ))}
                </ul>
              )}
              <label className="EditRepuestoEquipoButton-repuesto-nombre">2.  Ingrese el nombre del repuesto:</label>
              <input 
              className="EditRepuestoEquipoButton-nombre-input" 
              type="text"
              value={repuestoEquipoData.repuesto_name || ''}
              onChange={(e) => setRepuestoEquipoData({ ...repuestoEquipoData, repuesto_name: e.target.value })}
               />

              <label className="EditRepuestoEquipoButton-repuesto-precio">3.  Ingrese el precio del repuesto</label>
              <input 
              className="EditRepuestoEquipoButton-precio-input"
              type="number"
              value={repuestoEquipoData.repuesto_precio || 0}
              onChange={(e) => setRepuestoEquipoData({ ...repuestoEquipoData, repuesto_precio: e.target.value })}
              />
              <div className='EditRepuestoEquipoButton-actionButtons'>
                <div className="EditRepuestoEquipoButton-actualizar-texto-wrapper" onClick={handleEdit}>ACTUALIZAR</div>
                <div className="EditRepuestoEquipoButton-cancelar-texto-wrapper" onClick={onCancel}>CANCELAR</div>
              </div>
              <div className="EditRepuestoEquipoButton-repuesto-separator" />
            </div>
          </div>
        </div>
    </form>
      
    </div>
  );
};

export default EditRepuestoEquipoButton;