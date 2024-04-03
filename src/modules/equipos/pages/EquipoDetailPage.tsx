import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getEquipoById } from '../services/equiposService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import EditEquipoButton from '../components/equipos/EditEquipoButton';
import DeleteEquipoButton from '../components/equipos/DeleteEquipoButton';
import { getClientById } from '../../users/services/clientsService';
import { Equipo } from '../utils/types/Equipo.type';
import { Client } from '../../users/utils/types/Client.type';

// styles imports

import './styles/EquipoDetailPage.css'
import FaxOutlinedIcon from '@mui/icons-material/FaxOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


const EquipoDetailPage: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const { id } = useParams();
  const [equipo, setEquipo] = useState<Equipo | null>(null); // Utiliza el tipo Equipo
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState<Client | null>(null); // Utiliza el tipo Cliente
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      // Manejar la redirección si el usuario no está autenticado
      return;
    }

    if (!id) {
      // Maneja el caso en el que id es undefined (parámetro no encontrado en la URL)
      console.error('ID del equipo no encontrado en la URL');
      return;
    }

    const fetchEquipo = async () => {
      try {
        const token = loggedIn;
        const result = await getEquipoById(token, id);
    
        setEquipo(result);
        setLoading(false);
    
        // Obtener los detalles del cliente utilizando la función getClientById
        if (result && result.id_sede && result.id_sede.id_client) {
          const clientResponse = await getClientById(token, result.id_sede.id_client);
          const clientData = clientResponse.data; // Extraer el cuerpo de la respuesta
          setClient(clientData);
        }
      } catch (error) {
        console.error('Error al obtener detalles del equipo:', error);
      }
    };
    

    fetchEquipo();
  }, [loggedIn, id]);

  const handleEditSuccess = () => {
    console.log('Equipo editado con éxito');
    setIsEditing(false);
  };

  const handleRedirectToSedeDetail = () => {
    navigate(`/sedes/${equipo && equipo.id_sede ? equipo.id_sede._id : ''}`);
  };

  const handleRedirectToClientDetail = () => {
    navigate(`/clientes/${client ? client._id: ''}`);
  };

  const handleRedirectToModelDetail = () => {
    navigate(`/equipos/modelo/${equipo ? equipo.modelo_equipos._id : 'N/A'}`);
  };

  const handleRedirectToMarcaDetail = () => {
    navigate(`/equipos/marcas/${equipo ? equipo.modelo_equipos.id_marca._id : 'N/A'}`);
  };

  return (
    <div>
      <DashboardMenuLateral />

      {isEditing ? (
        <EditEquipoButton
          equipoId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={equipo}
        />
      ) : (
        <div className="EquipoDetailPage-box">
        <div className="EquipoDetailPage-complete-details">
          <div className="EquipoDetailPage-overlap-group">
            <div className="EquipoDetailPage-overlap">
              <div className="EquipoDetailPage-modelo-name">{equipo && equipo.modelo_equipos ? equipo.modelo_equipos.id_clase.clase : 'N/A'}</div>
              <CheckOutlinedIcon className="EquipoDetailPage-check-funcionamiento"  />
              <FaxOutlinedIcon className="EquipoDetailPage-machine-icon" />
              <div className="EquipoDetailPage-serie-header">SN: {equipo ? equipo.serie : 'N/A'}</div>
              <div className="EquipoDetailPage-mtto">MTTO: {equipo ? equipo.mtto : 'N/A'}</div>
              <div className="EquipoDetailPage-activo-fijo">ACTIVO FIJO: {equipo ? equipo.activo_fijo : 'N/A'}</div>
              <div className="EquipoDetailPage-sap-id">SAP ID: {equipo ? equipo.activo_fijo : 'N/A'}</div>
              <div className="EquipoDetailPage-price-header">$ SIN IVA: {equipo && equipo.modelo_equipos ? equipo.modelo_equipos.precio : ''}</div>
              <div className="EquipoDetailPage-equipo-id-header">ID: {equipo ? equipo._id: ''}</div>
              <EditOutlinedIcon onClick={() => setIsEditing(true)} className="EquipoDetailPage-edit-icon-header"  />
              <DeleteEquipoButton equipoId={id || ''} serie={equipo ? equipo.serie : ''} />
  
            </div>
            <div className="EquipoDetailPage-div">
              <RemoveRedEyeIcon className='EquipoDetailPage-see-sede' onClick={handleRedirectToSedeDetail}/>
              <div className="EquipoDetailPage-sede-separator" />
              <div className="EquipoDetailPage-sede-name">{equipo && equipo.id_sede ? equipo.id_sede.sede_nombre : ''}</div>
              <div className="EquipoDetailPage-sede-id">ID: {equipo && equipo.id_sede ? equipo.id_sede._id : ''}</div>
              <div className="EquipoDetailPage-direccion-sede-title">Dirección Sede</div>
              <div className="EquipoDetailPage-sede-address">{equipo && equipo.id_sede ? equipo.id_sede.sede_address : ''}</div>
              <div className="EquipoDetailPage-ubicacion-equipo">Ubicación en Sede</div>
              <div className="EquipoDetailPage-text-wrapper">{equipo ? equipo.ubicacion : ''}</div>
              <ApartmentOutlinedIcon className="EquipoDetailPage-sede-icon" />
              <LocationOnOutlinedIcon className="EquipoDetailPage-location-icon" />
              <div className="EquipoDetailPage-sede-telefono">{equipo && equipo.id_sede ? equipo.id_sede.sede_telefono : ''}</div>
              <div className="EquipoDetailPage-sede-email">{equipo && equipo.id_sede ? equipo.id_sede.sede_email : ''}</div>
              <CallOutlinedIcon className="EquipoDetailPage-sede-telefono-icon"  />
              <EmailOutlinedIcon className="EquipoDetailPage-sede-email-icon" />
            </div>
            <div className="EquipoDetailPage-overlap-2">
              <div className="EquipoDetailPage-frecuencia-title">FRECUENCIA MANTENIMIENTO</div>
              <AccessTimeOutlinedIcon className="EquipoDetailPage-img" />
              <div className="EquipoDetailPage-frecuencia-time">{equipo ? equipo.frecuencia : ''} MESES</div>
              <p className="EquipoDetailPage-frecuencia">Siguiente mantenimiento en: 0 H</p>
            </div>
            <div className="EquipoDetailPage-overlap-3">
              <div className="EquipoDetailPage-serie-title">NÚMERO DE SERIE</div>
              <QrCodeOutlinedIcon className="EquipoDetailPage-img"/>
              <div className="EquipoDetailPage-serie-number">{equipo ? equipo.serie : ''}</div>
            </div>
            <div className="EquipoDetailPage-overlap-4">
            <RemoveRedEyeIcon className='EquipoDetailPage-see-client' onClick={handleRedirectToClientDetail}/>
              <div className="EquipoDetailPage-client-separator" />
              <div className="EquipoDetailPage-client-name">{client ? client.client_name : ''}</div>
              <div className="EquipoDetailPage-client-id">ID: {client ? client._id: ''}</div>
              <div className="EquipoDetailPage-overlap-5">
                <div className="EquipoDetailPage-client-nit-title">NIT</div>
                <div className="EquipoDetailPage-overlap-6">
                  <div className="EquipoDetailPage-client-nit">{client ? client.client_nit : ''}</div>
                  <FeedOutlinedIcon className="EquipoDetailPage-client-nit-icon" />
                </div>
              </div>
              <div className="EquipoDetailPage-client-address-title">Dirección Cliente</div>
              <div className="EquipoDetailPage-client-address">{client ? client.client_address : ''}</div>
              <LocationOnOutlinedIcon className="EquipoDetailPage-client-location-icon"/>
              <CallOutlinedIcon className="EquipoDetailPage-client-telefono-icon" />
              <div className="EquipoDetailPage-client-telefono">{client ? client.client_telefono : ''}</div>
              <div className="EquipoDetailPage-client-email">{client ? client.client_email : ''}</div>
              <EmailOutlinedIcon className="EquipoDetailPage-client-email-icon" />
            </div>
            <div className="EquipoDetailPage-overlap-7">
              <div className="EquipoDetailPage-overlap-8">
                <div className="EquipoDetailPage-funcionamiento" />
                <div className="EquipoDetailPage-text-wrapper-2">MODELO</div>
                {/* <AlarmOnOutlinedIcon className="EquipoDetailPage-notas-icon" /> */}
                <RemoveRedEyeIcon className='EquipoDetailPage-see-modelo' onClick={handleRedirectToModelDetail}/>

                <p className="EquipoDetailPage-notas-icon">{equipo ? equipo.modelo_equipos.modelo : 'N/A'}</p>
              </div>
              <div className="EquipoDetailPage-notas-title">MARCA</div>
              <RemoveRedEyeIcon className='EquipoDetailPage-see-client' onClick={handleRedirectToMarcaDetail}/>
              <p className="EquipoDetailPage-notas-p">{equipo ? equipo.modelo_equipos.id_marca.marca : 'N/A'}</p>
            </div>
            <div className="EquipoDetailPage-overlap-9">
              <div className="EquipoDetailPage-overlap-10">
                <div className="EquipoDetailPage-text-wrapper-2">BOARD TEMPERATURE</div>
                <DeviceThermostatOutlinedIcon className="EquipoDetailPage-temperature-icon"/>
              </div>
              <div className="EquipoDetailPage-temperature-grades">0 °C</div>
            </div>
          </div>
        </div>
      </div>
      )}





    </div>
  );
};

export default EquipoDetailPage;

