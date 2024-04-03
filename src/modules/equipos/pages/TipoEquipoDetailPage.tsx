import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getTipoEquipoById, deleteTipoEquipoById } from '../services/tiposEquipoService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import EditTipoEquipoButton from '../components/tiposEquipos/EditTipoEquipoButton';

import './styles/TipoEquipoDetailPage.css'
import DeleteTipoEquipoButton from '../components/tiposEquipos/DeleteTipoEquipoButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TypeSpecimenOutlinedIcon from '@mui/icons-material/TypeSpecimenOutlined';
import { logoutService } from '../../users/services/authService';

const TipoEquipoDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    return <p>Tipo de equipo no encontrado.</p>;
  }

  const loggedIn = useSessionStorage('sessionJWTToken');
  const [tipoEquipo, setTipoEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      logoutService();
    }

    const fetchTipoEquipo = async () => {
      try {
        const token = loggedIn;
        const result = await getTipoEquipoById(token, id);

        setTipoEquipo(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener detalles del tipo de equipo:', error);
      }
    };

    fetchTipoEquipo();
  }, [loggedIn, id]);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleDeleteSuccess = () => {
    navigate('/equipos/tipos');
  };

  return (
    <div>
      <DashboardMenuLateral />

      {isEditing ? (
        <EditTipoEquipoButton
          tipoEquipoId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={tipoEquipo}
        />
      ) : (
          <div className="TipoEquipoDetailPage-box">
            <div className="TipoEquipoDetailPage-overlap-group-wrapper">
              <div className="TipoEquipoDetailPage-overlap-group">
                <div className="TipoEquipoDetailPage-overlap">
                  <TypeSpecimenOutlinedIcon className="TipoEquipoDetailPage-marcaequipo-icon"/>
                </div>
                <div className="TipoEquipoDetailPage-marcaequipo-title">{tipoEquipo ? tipoEquipo.tipo : ''}</div>
                <div className="TipoEquipoDetailPage-marcaequipo-id">AREA ID: {tipoEquipo ? tipoEquipo._id : ''}</div>
                <EditOutlinedIcon onClick={() => setIsEditing(true)} className="TipoEquipoDetailPage-marcaequipo-edit"/>
                <DeleteTipoEquipoButton tipoEquipoId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default TipoEquipoDetailPage;
