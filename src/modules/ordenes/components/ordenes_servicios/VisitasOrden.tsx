import React, { useState } from 'react';
import './styles/VisitaOrden.css';

// Importamos todos los íconos necesarios
import HelpIcon from '@mui/icons-material/Help';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PersonIcon from '@mui/icons-material/Person';
import VisitaByIdOrden from './VisitaByIdOrden';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';
import RegisterVisitaOrden from '../../../visitas/components/visitas/forms/RegisterVisitaOrden';
import EditIcon from '@mui/icons-material/Edit';
import EditVisitaOrden from '../../../visitas/components/visitas/forms/EditVisitaOrden';

interface VisitasOrdenProps {
  visitas: any[];
  idOrden: string; // Añadir esta línea
}

const VisitasOrden: React.FC<VisitasOrdenProps> = ({ visitas, idOrden }) => {

  const [selectedVisitaId, setSelectedVisitaId] = useState<string | null>(null);
  const [showRegisterVisita, setShowRegisterVisita] = useState(false);
  const isAdmin = useUserRoleVerifier(['administrador']);
  const [showEditVisita, setShowEditVisita] = useState(false);
  const [showVisitaById, setShowVisitaById] = useState(false);
  const [selectedVisitaTipo, setSelectedVisitaTipo] = useState<'edit' | 'view' | null>(null); // New state


  const handleVisitaClick = (id: string | null) => {
    setSelectedVisitaId(id);
    setSelectedVisitaTipo('view'); // Show VisitaByIdOrden when a visit is clicked
    setShowRegisterVisita(false);

  };

  const handleEditVisitaClick = (visita: any) => {
    setSelectedVisitaId(visita._id);
    setSelectedVisitaTipo('edit'); // Show EditVisitaOrden when editing a visit
    setShowRegisterVisita(false);
  };
  // Function to filter visitas by estado
  const [filtro, setFiltro] = useState<string | null>(null);
  const filtrarVisitas = () => {
    return filtro ? visitas.filter(visita => visita.id_visita_estado.estado === filtro) : visitas;
  };
  // Function to select icon depending of visita's estado
  const EstadoIcono = ( estado : string) => {
    switch (estado) {
      case 'Pendiente':
        return <HelpIcon className="VisitasOrden-estado-pendiente" />;
      case 'Abierta':
        return <LockOpenIcon className="VisitasOrden-estado-abierto" />;
      case 'Cerrada':
        return <DoNotDisturbOnOutlinedIcon className="VisitasOrden-estado-cerrado" />;
      case 'Rechazada':
        return <DoNotDisturbAltOutlinedIcon className="VisitasOrden-estado-rechazado" />;
      default:
        return <HelpIcon className="VisitasOrden-estado-desconocido" />;
    }
  };
  const handleAddVisitaClick = () => {
    setShowRegisterVisita(true); // Mostrar el formulario al hacer clic en el ícono de añadir visita
    setSelectedVisitaId(null);
    setSelectedVisitaTipo(null); 


  };

  const handleCancel = () => {
    setShowRegisterVisita(false);
  };
  
  return (
    <div>
      <div className="VisitasOrden-visitas">
        <div className="VisitasOrden-div">
          <header className="VisitasOrden-header">
            <div className="VisitasOrden-overlap-group">
              <div className="VisitasOrden-visita-title">VISITAS</div>
            </div>
          </header>
          <div className="VisitasOrden-all-visitas">
            <div className="VisitasOrden-overlap">
              <div className="VisitasOrden-navbar">
                <div className="VisitasOrden-pendiente-t" onClick={() => setFiltro('Pendiente')}>PENDIENTES</div>
                <div className="VisitasOrden-estados" />
                <div className="VisitasOrden-abierta-t" onClick={() => setFiltro('Abierta')}>ABIERTAS</div>
                <div className="VisitasOrden-estados-separator" />
                <div className="VisitasOrden-cerrada-title" onClick={() => setFiltro('Cerrada')}>CERRADAS</div>
                <div className="VisitasOrden-img" />
                <div className="VisitasOrden-rechazada-t" onClick={() => setFiltro('Rechazada')}>RECHAZADAS</div>
              </div>
              <div className="VisitasOrden-visitas-list">
                <ul>
                  {filtrarVisitas().map((visita, index) => (
                    <li className="VisitasOrden-visita-card" key={index}>
                      <div className="VisitasOrden-overlap-group-2">
                      <EditIcon className='VisitasOrden-addVisita-edit-button'  onClick={() => handleEditVisitaClick(visita)}/>
                        <div className="VisitasOrden-oid-card" onClick={() => handleVisitaClick(visita._id)}>ID: {visita._id}</div>
                        <div className="VisitasOrden-separator"/>
                        <div className="VisitasOrden-separator-card"/>

                        {/* Renderizamos el ícono basado en el estado de la visita */}
                        {EstadoIcono(visita.id_visita_estado.estado)}

                        <CalendarMonthOutlinedIcon className="VisitasOrden-inicio-icon"/>
                        <div className="VisitasOrden-inicio-date">{visita && visita.fecha_inicio || 'N/A'}</div>
                        <EngineeringIcon className="VisitasOrden-tecnico-icon"/>
                        <div className="VisitasOrden-tecnico-name">{visita && visita.id_responsable.username || 'N/A'}</div>
                        <CalendarTodayOutlinedIcon className="VisitasOrden-created-icon"/>
                        <AddOutlinedIcon className="VisitasOrden-created-icon-add"/>
                        <div className="VisitasOrden-created-date">{visita && visita.fecha_creacion || 'N/A'}</div>
                        <PersonIcon className="VisitasOrden-user-icon"/>
                        <div className="VisitasOrden-user-creator">{visita && visita.id_creador.username || 'N/A'}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>


          {isAdmin && (
            <AddCircleIcon className='VisitasOrden-addVisita-button' onClick={handleAddVisitaClick}/>

          )}

          {showRegisterVisita && <RegisterVisitaOrden onCancel={handleCancel} idOrden={idOrden} />} 
          {selectedVisitaId && selectedVisitaTipo === 'edit' && <EditVisitaOrden idOrden={idOrden} visita={visitas.find(visita => visita._id === selectedVisitaId)} onCancel={() => setSelectedVisitaTipo(null)} />}
        </div>
      </div>

      {/* ESPACIO DE RENDERIZADO DE VisitaByIdOrden.tsx  */}
      {selectedVisitaId && selectedVisitaTipo === 'view' && <VisitaByIdOrden idVisita={selectedVisitaId} onVisitaSelect={handleVisitaClick}/>}

    </div>
  );
};

export default VisitasOrden;
