import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSedeById } from '../services/sedesService';
import { AxiosResponse } from 'axios';
import DefaultSedeImg from './img/DefaultSedeImg.png';
import { useSessionStorage } from '../hooks/useSessionStorage';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import './styles/SedeDetailPage.css';
import DeleteSedeButton from '../components/sedes/DeleteSedeButton';
import EditSedeButton from '../components/sedes/EditSedeButton'; 
import { Sede } from '../utils/types/Sede.type';
import { logoutService } from '../services/authService'; 
import useUserRoleVerifier from '../hooks/useUserRoleVerifier';

const SedeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sede, setSede] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false); 
  const isAdmin = useUserRoleVerifier(['administrador']);

  useEffect(() => {
    // Verifica si id tiene un valor antes de llamar a getSedeById
    if (id) {
      const loggedIn = useSessionStorage('sessionJWTToken');

      getSedeById(loggedIn, id)
        .then((response: AxiosResponse) => {
          if (response.status === 200 && response.data) {
            setSede(response.data);
          } else {
            throw new Error(`Error obtaining Sede details: ${response.data}`);
          }
        })
        .catch((error) => {
          console.error(`[GET SEDE BY ID ERROR] ${error}`);
        });
    }
  }, [id]);

  const handleDeleteSuccess = () => {
    navigate('/sedes');
    window.alert('Sede Eliminada satisfactoriamente');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveSuccess = (editedSede: Sede) => {
    setIsEditing(false);
    setSede(editedSede);
  };

  useEffect(() => {
    const loggedIn = useSessionStorage('sessionJWTToken');

    if (!loggedIn) {
      logoutService(); // Utiliza la función de logoutService para manejar el cierre de sesión
    }
  }, []);

  return (
    <div>
      <DashboardMenuLateral />
      <div className=''>
        <div className="SedeDetail">
          <section className="sedeDetail-sede-section">
            <div className="sedeDetailcard" data-state="#about">
              <div className="sedeDetail-header">
                <div className="sedeDetail-cover"></div>
                <img
                  className="sedeDetail-avatar"
                  src={DefaultSedeImg}
                  alt=""
                  width="90px"
                  height="80px"
                />
                <h2 className="sedeDetail-fullname">{sede.sede_nombre}</h2>
                <h2 className="sedeDetail-oid">{id}</h2>
              </div>
              <div className="sedeDetail-main">
                {isEditing ? (
                  <EditSedeButton
                    sedeId={id || ''}
                    sedeData={sede}
                    onSaveSuccess={handleSaveSuccess}
                    isEditing={isEditing}
                  />
                ) : (
                  <div className="sedeDetail-section is-active">
                    <div className="sedeDetail-content-1">
                      <div className="sedeDetail-subtitle">Dirección</div>
                      <p className="sedeDetail-desc">{sede.sede_address}</p>
                      <br></br>
                      <div className="sedeDetail-subtitle">Teléfono</div>
                      <p className="sedeDetail-desc">{sede.sede_telefono}</p>
                      <br></br>
                      <div className="sedeDetail-subtitle">Email</div>
                      <p className="sedeDetail-desc">{sede.sede_email}</p>
                    </div>
                  </div>
                )}
              </div>
              {isAdmin && !isEditing && (
                <div className="sedeDetail-buttons">
                  <>
                    <button
                      className="sedeDetail-button"
                      data-section="#experience"
                      onClick={handleEditClick}
                    >
                      Editar
                    </button>
                  </>
                </div>
              )}
            </div>
          </section>
        </div>
        <div className='sedeDetail-delete-button'>
          <DeleteSedeButton sedeId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
        </div>
      </div>
    </div>
  );
};

export default SedeDetailPage;
