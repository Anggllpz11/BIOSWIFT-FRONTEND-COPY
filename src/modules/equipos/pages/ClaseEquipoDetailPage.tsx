import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getClaseEquipoById, deleteClaseEquipoById } from '../services/clasesEquipoService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import EditClaseEquipoButton from '../components/clasesEquipos/EditClaseEquipoButton';
import DeleteClaseEquipoButton from '../components/clasesEquipos/DeleteClaseEquipoButton';
import ClassIcon from '@mui/icons-material/Class';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import './styles/ClaseEquipoDetailPage.css'
const ClaseEquipoDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    return <p>Clase de equipo no encontrada.</p>;
  }

  const loggedIn = useSessionStorage('sessionJWTToken');
  const [claseEquipo, setClaseEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
        navigate('/login');
    } else {
      const fetchClaseEquipo = async () => {
        try {
          const token = loggedIn;
          const result = await getClaseEquipoById(token, id);

          setClaseEquipo(result);
          setLoading(false);
        } catch (error) {
          console.error('Error al obtener detalles de la clase de equipo:', error);
        }
      };

      fetchClaseEquipo();
    }
  }, [loggedIn, id, navigate]);


  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleDeleteSuccess = () => {
    navigate('/equipos/clases');
  };

  return (
    <div>
      <DashboardMenuLateral />

      {isEditing ? (
        <EditClaseEquipoButton
          claseEquipoId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={claseEquipo}
        />
      ) : (
          <div className="ClaseEquipoDetailPage-box">
            <div className="ClaseEquipoDetailPage-overlap-group-wrapper">
              <div className="ClaseEquipoDetailPage-overlap-group">
                <div className="ClaseEquipoDetailPage-overlap">
                  <ClassIcon className="ClaseEquipoDetailPage-marcaequipo-icon"/>
                </div>
                <div className="ClaseEquipoDetailPage-marcaequipo-title">{claseEquipo ? claseEquipo.clase : ''}</div>
                <div className="ClaseEquipoDetailPage-marcaequipo-id">CLASE ID: {claseEquipo ? claseEquipo._id : ''}</div>
                <EditOutlinedIcon onClick={() => setIsEditing(true)} className="ClaseEquipoDetailPage-marcaequipo-edit"/>
                <DeleteClaseEquipoButton claseEquipoId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClaseEquipoDetailPage;
