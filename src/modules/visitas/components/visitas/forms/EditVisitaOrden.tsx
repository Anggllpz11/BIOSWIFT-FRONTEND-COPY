import React, { useState, useEffect, FormEvent } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { updateVisita } from '../../../services/visitasService';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAllProtocolos } from '../../../services/protocolosService';
import { getOrdenById, updateOrden } from '../../../../ordenes/services/ordenesService';
import { searchUsersByKeyword } from '../../../../users/services/usersService';
import './styles/RegisterVisitaOrden.css';


interface EditVisitaOrdenProps {
  onCancel: () => void;
  idOrden: string;
  visita: any; // Información de la visita seleccionada
}

interface Protocolo {
    _id: string;
    title: string;
  }

  interface VisitaData {
    id_responsable: string;
    ids_protocolos: string[];
    fecha_inicio: string;
    ejecutar_sede: boolean;
    duracion: string;
    // Añade los campos adicionales según sea necesario
  }
  

const EditVisitaOrden: React.FC<EditVisitaOrdenProps> = ({ onCancel, idOrden, visita }) => {
  const loggedIn = useSessionStorage('sessionJWTToken');

  // PROTOCOLOS STATES
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const protocoloIdsIniciales = visita.ids_protocolos.map((protocolo: { _id: string }) => protocolo._id);
  const [selectedProtocolos, setSelectedProtocolos] = useState<string[]>(
    visita.ids_protocolos.map((protocolo: { _id: string }) => protocolo._id)
  );
  
  const [duracion, setDuracion] = useState('');
  // Estados de la visita
  const [visitaData, setVisitaData] = useState({
      id_responsable: '',
      ids_protocolos: selectedProtocolos,
      fecha_inicio: '',
      ejecutar_sede: false,
      duracion: '',
      ...visita // Proporcionamos los datos de la visita seleccionada
    });
    // USER STATES
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = loggedIn;
        const results = await searchUsersByKeyword(token, keyword);
        setSearchResults(results);
      } catch (error) {
        console.error('Error al buscar usuarios:', error);
      }
    };

    if (keyword.trim() !== '') {
      fetchUsers();
    } else {
      setSearchResults([]);
    }
  }, [keyword, loggedIn]);

  useEffect(() => {
    const fetchProtocolos = async () => {
      try {
        const token = loggedIn;
        const protocolosData = await getAllProtocolos(token);
        setProtocolos(protocolosData);
      } catch (error) {
        console.error('Error al obtener los protocolos:', error);
      }
    };

    fetchProtocolos();
  }, [loggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'id_responsable') {
      setKeyword(value); // Actualizamos la palabra clave de búsqueda solo para el campo de búsqueda de usuarios
    }
    setVisitaData({ ...visitaData, [name]: value }); // Actualizamos el estado visitaData para otros campos
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setVisitaData({ ...visitaData, id_responsable: user._id });
    setKeyword(''); // Limpiamos la palabra clave después de seleccionar un usuario
    setSearchResults([]); // Limpiamos los resultados de búsqueda después de seleccionar un usuario
  };

  const handleCancelUser = () => {
    setSelectedUser(null);
    setVisitaData({ ...visitaData, id_responsable: '' });
  };

 // Cuando se selecciona un nuevo protocolo
 const handleProtocoloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProtocoloId = e.target.value;
    if (!selectedProtocolos.includes(selectedProtocoloId)) {
      setSelectedProtocolos(prevSelected => [...prevSelected, selectedProtocoloId]);
      // Actualiza visitaData solo al enviar el formulario
    }
    e.target.value = ''; // Restablece el valor del select después de seleccionar
  };

  // Cuando se elimina un protocolo de la lista
  const removeProtocolo = (id: string) => {
    setSelectedProtocolos(prevSelected => prevSelected.filter(protocoloId => protocoloId !== id));
    // Actualiza visitaData solo al enviar el formulario
  };

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Actualiza visitaData con los protocolos seleccionados actualmente
    const updatedVisitaData = {
      ...visitaData,
      ids_protocolos: selectedProtocolos,
    };
  
    try {
      const token = loggedIn;
      // Usa updatedVisitaData, que ahora incluye los ids_protocolos actualizados
      const updatedVisita = await updateVisita(token, updatedVisitaData._id, updatedVisitaData);
      window.alert(`Visita con ID ${visitaData._id} actualizada correctamente`)
      window.location.reload();
      // Lógica adicional después de actualizar la visita
    } catch (error) {
      console.error('Error al actualizar la visita:', error);
    }
  };
  

  const handleCancel = () => {
    onCancel(); // Llama a la función de cancelar pasada desde VisitasOrden.tsx
  };

  // Efectos para la búsqueda de usuarios y protocolos, y otros efectos necesarios

  return (
    <div className='RegisterVisita-div'>
    <form onSubmit={handleSubmit}>
      <div className="RegisterVisitaOrden-visita-nueva">
        <div className="RegisterVisitaOrden-div">
          <header className="RegisterVisitaOrden-header">
            <div className="RegisterVisitaOrden-overlap-group">
              <div className="RegisterVisitaOrden-register-title">EDITAR VISITA - {visitaData._id}</div>
            </div>
          </header>
          <div className="RegisterVisitaOrden-overlap">
            <div className="RegisterVisitaOrden-user-div">
              <p className="RegisterVisitaOrden-text-wrapper">1. Seleccione la persona encargada de ejecutar la visita: *</p>
              <input
                className="RegisterVisitaOrden-rectangle"
                type="text"
                name="id_responsable"
                value={selectedUser ? selectedUser._id : visitaData.id_responsable ? visitaData.id_responsable.username : ''}
                onChange={handleChange}
                placeholder="Buscar..."
              />
              {selectedUser && (
                <div className="RegisterVisitaOrden-user-pick">
                  {selectedUser.username}
                  <CancelIcon className='RegisterVisitaOrden-user-selected-cancel' onClick={handleCancelUser}/>
                </div>
              )}
              {searchResults.length > 0 && (
                <ul className='RegisterVisitaOrden-users-ul'>
                  {searchResults.map((user) => (
                    <li className="RegisterVisitaOrden-users-listed" key={user._id} onClick={() => handleUserClick(user)}>
                      {user.username}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="RegisterVisitaOrden-protocolos-div">
                <p className="RegisterVisitaOrden-text-wrapper">2. Seleccione las actividades a programar: *</p>
                <select
                className="RegisterVisitaOrden-rectangle"
                name="ids_protocolos"
                value=""
                onChange={handleProtocoloChange}
                >
                <option value="" disabled>Seleccionar</option>
                {protocolos.map(protocolo => (
                    <option key={protocolo._id} value={protocolo._id}>{protocolo.title}</option>
                ))}
                </select>
                <ul className="RegisterVisitaOrden-protocolos-listed">
                    {selectedProtocolos.map(protocoloId => {
                    const protocolo = protocolos.find(p => p._id === protocoloId) || visita.ids_protocolos.find((p: { _id: string }) => p._id === protocoloId);
                    return protocolo ? (
                        <li key={protocolo._id} className="RegisterVisitaOrden-img">
                        {protocolo.title}
                        <CancelIcon
                            className="RegisterVisitaOrden-protocolo-selected-cancel"
                            onClick={() => removeProtocolo(protocolo._id)}
                        />
                        </li>
                    ) : null;
                    })}
                </ul>
            </div>



            <div className="RegisterVisitaOrden-separator"/>
            <div className="RegisterVisitaOrden-fecha-div">
              <div className="RegisterVisitaOrden-text-wrapper-2">3. Seleccione fecha de inicio: *</div>
              <input
                className="RegisterVisitaOrden-div-2"
                type="datetime-local"
                name="fecha_inicio"
                value={visitaData.fecha_inicio}
                onChange={handleChange}
              />
            </div>
            <div className="RegisterVisitaOrden-insede-div">
              <div className="RegisterVisitaOrden-text-wrapper-2">4. Ejecutar en sede: *</div>
              <label className="RegisterVisitaOrden-switch">
                <input
                  className='RegisterVisitaOrden-ejecutar-sede-input'
                  type="checkbox"
                  name="ejecutar_sede"
                  checked={visitaData.ejecutar_sede}
                  onChange={(e) => setVisitaData({ ...visitaData, ejecutar_sede: e.target.checked })}
                />
                <span className="RegisterVisitaOrden-slider round"></span>
              </label>
            </div>
            <div className="RegisterVisitaOrden-time-div">
              <div className="RegisterVisitaOrden-text-wrapper-2">5. Duración estimada (minutos): *</div>
              <input
                className="RegisterVisitaOrden-div-2"
                type="text"
                name="duracion"
                value={visitaData.duracion}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {/* ESPACIO PARA BOTONES DE CREAR Y CANCELAR */}
        <div className="RegisterVisitaOrden-button-container">
          <button type="submit" className="RegisterVisitaOrden-btn-register">Actualizar</button>
          <button type="button" className="RegisterVisitaOrden-btn-cancel" onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </form>
  </div>
  );
};

export default EditVisitaOrden;
