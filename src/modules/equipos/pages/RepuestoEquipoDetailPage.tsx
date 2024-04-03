import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getRepuestoEquipoById, deleteRepuestoEquipoById } from '../services/repuestosEquiposService'; // Asegúrate de tener la ruta correcta
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import EditRepuestoEquipoButton from '../components/RepuestosEquipos/EditRepuestoEquipoButton';

import './styles/RepuestoEquipoDetailPage.css'; // Asegúrate de tener la ruta correcta
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import DeleteRepuestoEquipoButton from '../components/RepuestosEquipos/DeleteRepuestoEquipoButton';

const RepuestoEquipoDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    return <p>Repuesto Equipo no encontrado.</p>;
  }

  const loggedIn = useSessionStorage('sessionJWTToken');
  const [repuestoEquipo, setRepuestoEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      const fetchRepuestoEquipo = async () => {
        try {
          const token = loggedIn;
          const result = await getRepuestoEquipoById(token, id);

          setRepuestoEquipo(result);
          setLoading(false);
        } catch (error) {
          console.error('Error al obtener detalles del repuesto equipo:', error);
        }
      };

      fetchRepuestoEquipo();
    }
  }, [loggedIn, id, navigate]);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleDeleteSuccess = () => {
    navigate('/equipos-repuestos');
  };

  return (
    <div>
      <DashboardMenuLateral />

      {isEditing ? (
        <EditRepuestoEquipoButton
          repuestoEquipoId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={repuestoEquipo}
        />
      ) : (
            <div>
                <div className="RepuestoEquipoDetailPage-box">
                        <div className="RepuestoEquipoDetailPage-repuestos-equipos">
                                <div className="RepuestoEquipoDetailPage-overlap-group">
                                        <div className="RepuestoEquipoDetailPage-overlap">
                                            <div className="RepuestoEquipoDetailPage-div">
                                            <div className="RepuestoEquipoDetailPage-repuestoequipo-name">{repuestoEquipo ? repuestoEquipo.repuesto_name : ''}</div>
                                            <div className="RepuestoEquipoDetailPage-repuestoequipo-id">REPUESTO ID: {repuestoEquipo ? repuestoEquipo._id : ''}</div>
                                            </div>
                                            <DeleteRepuestoEquipoButton repuestoEquipoId={id || ''} repuestoName={repuestoEquipo ? repuestoEquipo.repuesto_name : ''} />
                                            <EditOutlinedIcon onClick={() => setIsEditing(true)} className="RepuestoEquipoDetailPage-edit-icon-header"/>
                                        </div>
                                    <div className="RepuestoEquipoDetailPage-overlap-2">
                                    <div className="RepuestoEquipoDetailPage-repuestoequipo" />
                                    <div className="RepuestoEquipoDetailPage-client-name">{repuestoEquipo && repuestoEquipo.id_cliente ? repuestoEquipo.id_cliente.client_name : ''}</div>
                                    <div className="RepuestoEquipoDetailPage-client-id">ID CLIENTE: {repuestoEquipo && repuestoEquipo.id_cliente ? repuestoEquipo.id_cliente._id : ''}</div>
                                    <FeedOutlinedIcon className="RepuestoEquipoDetailPage-client-nit-icon"/>
                                    <div className="RepuestoEquipoDetailPage-client-nit">NIT: {repuestoEquipo && repuestoEquipo.id_cliente ? repuestoEquipo.id_cliente.client_nit : ''}</div>
                                    <LocationOnOutlinedIcon className="RepuestoEquipoDetailPage-client-location-icon"/>
                                    <div className="RepuestoEquipoDetailPage-client-address">{repuestoEquipo && repuestoEquipo.id_cliente ? repuestoEquipo.id_cliente.client_address : ''}</div>
                                    <CallOutlinedIcon className="RepuestoEquipoDetailPage-client-telefono-icon" />
                                    <div className="RepuestoEquipoDetailPage-client-telefono">{repuestoEquipo && repuestoEquipo.id_cliente ? repuestoEquipo.id_cliente.client_telefono : ''}</div>
                                    <div className="RepuestoEquipoDetailPage-overlap-3">
                                    <EmailOutlinedIcon className="RepuestoEquipoDetailPage-client-email-icon"/>
                                    <div className="RepuestoEquipoDetailPage-client-email">{repuestoEquipo && repuestoEquipo.id_cliente ? repuestoEquipo.id_cliente.client_email : ''}</div>
                                    </div>
                                </div>
                                {/* <div className="RepuestoEquipoDetailPage-overlap-4">
                                    <div className="RepuestoEquipoDetailPage-text-wrapper">CANTIDAD</div>
                                    <DashboardCustomizeOutlinedIcon className="RepuestoEquipoDetailPage-img"  />
                                    <div className="RepuestoEquipoDetailPage-cantidad-value">{repuestoEquipo ? repuestoEquipo.repuesto_cantidad : ''}</div>
                                </div> */}
                                <div className="RepuestoEquipoDetailPage-overlap-5">
                                    <PaidOutlinedIcon className="RepuestoEquipoDetailPage-img" />
                                    <div className="RepuestoEquipoDetailPage-text-wrapper">PRECIO SIN IVA</div>
                                    <div className="RepuestoEquipoDetailPage-precio-value">{repuestoEquipo ? repuestoEquipo.repuesto_precio : ''}</div>
                                </div>
                        </div>
                    </div>
                </div>
             </div>
      )}
    </div>
  );
};

export default RepuestoEquipoDetailPage;
