import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getMarcaEquipoById, deleteMarcaEquipoById } from '../services/marcasEquipoService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';
import EditMarcaEquipoButton from '../components/marcasEquipos/EditMarcaEquipoButton';
import DeleteMarcaEquipoButton from '../components/marcasEquipos/DeleteMarcaEquipoButton';

import './styles/MarcaEquipoDetailPage.css'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const MarcaEquipoDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    return <p>Marca de equipo no encontrada.</p>;
  }

  const loggedIn = useSessionStorage('sessionJWTToken');
  const [marcaEquipo, setMarcaEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const fetchMarcaEquipo = async () => {
      try {
        const token = loggedIn;
        const result = await getMarcaEquipoById(token, id);

        setMarcaEquipo(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener detalles de la marca de equipo:', error);
      }
    };

    fetchMarcaEquipo();
  }, [loggedIn, id]);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleDeleteSuccess = () => {
    navigate('/equipos/marcas');
  };

  return (
    <div>
      <DashboardMenuLateral />

      {isEditing ? (
        <EditMarcaEquipoButton
          marcaEquipoId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={marcaEquipo}
        />
      ) : (
          <div className="MarcaEquipoDetailPage-box">
            <div className="MarcaEquipoDetailPage-overlap-group-wrapper">
              <div className="MarcaEquipoDetailPage-overlap-group">
                <div className="MarcaEquipoDetailPage-overlap">
                  <LocalOfferOutlinedIcon className="MarcaEquipoDetailPage-marcaequipo-icon"/>
                </div>
                <div className="MarcaEquipoDetailPage-marcaequipo-title">{marcaEquipo ? marcaEquipo.marca : ''}</div>
                <div className="MarcaEquipoDetailPage-marcaequipo-id">MARCA ID: {marcaEquipo ? marcaEquipo._id : ''}</div>
                <EditOutlinedIcon onClick={() => setIsEditing(true)} className="MarcaEquipoDetailPage-marcaequipo-edit"/>
                <DeleteMarcaEquipoButton marcaEquipoId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
              </div>
            </div>
          </div>

      )}
    </div>
  );
};

export default MarcaEquipoDetailPage;
