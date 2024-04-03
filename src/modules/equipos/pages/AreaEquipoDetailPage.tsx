import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAreaEquipoById, deleteAreaEquipoById } from '../services/areasEquiposService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import EditAreaEquipoButton from '../components/areasEquipos/EditAreaEquipoButton';
import DeleteAreaEquipoButton from '../components/areasEquipos/DeleteAreaEquipoButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

import './styles/AreaEquipoDetailPage.css'; 
import { logoutService } from '../../users/services/authService';

const AreaEquipoDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    return <p>Área de equipo no encontrada.</p>;
  }

  const loggedIn = useSessionStorage('sessionJWTToken');
  const [areaEquipo, setAreaEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      logoutService();
    }

    const fetchAreaEquipo = async () => {
      try {
        const token = loggedIn;
        const result = await getAreaEquipoById(token, id);

        setAreaEquipo(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener detalles del área de equipo:', error);
      }
    };

    fetchAreaEquipo();
  }, [loggedIn, id]);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleDeleteSuccess = () => {
    navigate('/equipos/areas');
  };

  return (
    <div>
      <DashboardMenuLateral />

      {isEditing ? (
        <EditAreaEquipoButton
          areaEquipoId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={areaEquipo}
        />
      ) : (
          <div className="AreaEquipoDetailPage-box">
            <div className="AreaEquipoDetailPage-overlap-group-wrapper">
              <div className="AreaEquipoDetailPage-overlap-group">
                <div className="AreaEquipoDetailPage-overlap">
                  <SpaceDashboardIcon className="AreaEquipoDetailPage-marcaequipo-icon"/>
                </div>
                <div className="AreaEquipoDetailPage-marcaequipo-title">{areaEquipo ? areaEquipo.area : ''}</div>
                <div className="AreaEquipoDetailPage-marcaequipo-id">AREA ID: {areaEquipo ? areaEquipo._id : ''}</div>
                <EditOutlinedIcon onClick={() => setIsEditing(true)} className="AreaEquipoDetailPage-marcaequipo-edit"/>
                <DeleteAreaEquipoButton areaEquipoId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AreaEquipoDetailPage;
