import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getModeloEquipoById, deleteModeloEquipoById } from '../services/equiposModeloService';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import { useNavigate, useParams } from 'react-router-dom';


//Styles imports
import './styles/EquipoModeloDetailPage.css'
import EditEquipoModeloButton from '../components/equiposModelos/EditEquipoModeloButton';
import DeleteEquipoModeloButton from '../components/equiposModelos/DeleteEquipoModeloButton';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
const EquipoModeloDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    // Maneja el caso en el que id es undefined (parámetro no encontrado en la URL)
    return <p>Modelo de equipo no encontrado.</p>;
  }

  const loggedIn = useSessionStorage('sessionJWTToken');
  const [modeloEquipo, setModeloEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }

    const fetchModeloEquipo = async () => {
      try {
        const token = loggedIn;
        const result = await getModeloEquipoById(token, id);

        setModeloEquipo(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener detalles del modelo de equipo:', error);
      }
    };

    fetchModeloEquipo();
  }, [loggedIn, id, navigate]);


  const handleEditSuccess = () => {
    console.log('Modelo de equipo editado con éxito');
    setIsEditing(false);
  };

  const handleDeleteSuccess = () => {
    console.log('Modelo de equipo eliminado con éxito');
    navigate('/equipos/modelo'); // Redirige a la página de modelos de equipo después de eliminar
  };
  const handleViewMarcaDetails = () =>{
    navigate( `/equipos/marcas/${modeloEquipo.id_marca._id}`);
  }

  const handleViewClaseDetails = () =>{
    navigate( `/equipos/clases/${modeloEquipo.id_clase._id}`);
  }


  return (
    <div>
      <DashboardMenuLateral />

      {isEditing ? (
        <EditEquipoModeloButton
          modeloEquipoId={id || ''}
          onEditSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
          initialData={modeloEquipo}
        />
      ) : (

      <div className="EquipoModeloDetailPage-box">
      <div className="EquipoModeloDetailPage-equipodetailpage">
        <div className="EquipoModeloDetailPage-overlap-group">
          <div className="EquipoModeloDetailPage-overlap">
            <div className="EquipoModeloDetailPage-client-id">MODELO ID: {modeloEquipo ? modeloEquipo._id : ''}</div>
            <div className="EquipoModeloDetailPage-div">
              <div className="EquipoModeloDetailPage-text-wrapper">{modeloEquipo ? modeloEquipo.precio : ''}</div>
              <PaidOutlinedIcon className="EquipoModeloDetailPage-money"/>
            </div>
            <div className="EquipoModeloDetailPage-machine-learning-wrapper">
              <DevicesOtherOutlinedIcon className="EquipoModeloDetailPage-machine-learning" />
            </div>
            <div className="EquipoModeloDetailPage-text-wrapper-2">{modeloEquipo ? modeloEquipo.modelo : ''}</div>
            <EditOutlinedIcon className="EquipoModeloDetailPage-edit" onClick={() => setIsEditing(true)}/>
            <DeleteEquipoModeloButton modeloEquipoId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
          </div>
          <div className="EquipoModeloDetailPage-overlap-2">
            <div className="EquipoModeloDetailPage-overlap-3">
              <div className="EquipoModeloDetailPage-client-id-2">ID: {modeloEquipo && modeloEquipo.id_marca ? modeloEquipo.id_marca._id : 'N/A'}</div>
              <div className="EquipoModeloDetailPage-text-wrapper-3">MARCA</div>
              <VisibilityOutlinedIcon className="EquipoModeloDetailPage-eye" onClick={handleViewMarcaDetails} />
            </div>
            <div className="EquipoModeloDetailPage-client-id-3">{modeloEquipo && modeloEquipo.id_marca ? modeloEquipo.id_marca.marca : 'N/A'}</div>
            <LocalOfferOutlinedIcon className="EquipoModeloDetailPage-billboard" />
          </div>
          <div className="EquipoModeloDetailPage-overlap-4">
            <div className="EquipoModeloDetailPage-client-id-4">ID: {modeloEquipo && modeloEquipo.id_clase ? modeloEquipo.id_clase._id : 'N/A'}</div>
            <div className="EquipoModeloDetailPage-text-wrapper-4">CLASE</div>
            <ClassOutlinedIcon className="EquipoModeloDetailPage-img"/>
            <VisibilityOutlinedIcon className="EquipoModeloDetailPage-eye-2" onClick={handleViewClaseDetails}/>
            <div className="EquipoModeloDetailPage-client-id-5">{modeloEquipo && modeloEquipo.id_clase ? modeloEquipo.id_clase.clase : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
      )}
    </div>
  );
};

export default EquipoModeloDetailPage;
