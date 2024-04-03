import React, { useEffect, useState } from 'react';
import './styles/UserDetailPage.css';
import Userimg from './img/defaultUserImg.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getUserById } from '../services/usersService';
import { AxiosResponse } from 'axios';
import { User } from '../utils/types/User.type';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import DeleteUserButton from '../components/users/DeleteUserButton';
import EditUserButton from '../components/users/EditUserButton';
import useUserRoleVerifier from '../hooks/useUserRoleVerifier';
import { logoutService } from '../services/authService';

export const UserDetailPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loggedIn) {
      return logoutService();
    } else {
      if (id) {
        getUserById(loggedIn, id)
          .then((response: AxiosResponse) => {
            if (response.status === 200 && response.data) {
              setUser(response.data);
            }
          })
          .catch((error: any) => console.error(`[USER BY ID ERROR]: ${error}`));
      } else {
        return navigate('/users');
      }
    }
  }, [loggedIn, id, navigate]);

  const handleDeleteSuccess = () => {
    navigate('/users');
    window.alert('Usuario Eliminado satisfactoriamente');
  };

  const handleSaveSuccess = (editedUser: User) => {
    setUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="">
      <DashboardMenuLateral />
      <div className="">
        {user ? (
          <div className='UserCard'>
            <section className="usercard-user-section">
              <div className="usercard" data-state="#about">
                <div className="usercard-header">
                  <div className="usercard-cover"></div>
                  <img
                    className='usercard-Avatar'
                    src={Userimg}
                    alt=""
                    width="90px"
                    height="80px"
                  />
                  <h2 className="usercard-fullname">{user.name}</h2>
                  {user.roles && user.roles.length > 0 && (
                    <div>
                      {user.roles.map((role: any) => (
                        <h2 className='usercard-jobtitle' key={role._id}>
                          {role.name}
                        </h2>
                      ))}
                    </div>
                  )}
                </div>
                <div className="usercard-main">
                  <EditUserButton
                    userId={id || ''}
                    userData={user}
                    onSaveSuccess={handleSaveSuccess}
                    isEditing={isEditing} // Asegúrate de pasar el prop isEditing aquí
                  />
                  {isEditing ? null : (
                    <div className="usercard-section is-active">
                      <div className="usercard-content-1">
                        <div className="usercard-subtitle">Nombre de usuario</div>
                        <p className="usercard-desc">{user.username}</p>
                        <br />
                        <div className="usercard-subtitle">Cédula</div>
                        <p className="usercard-desc">{user.cedula}</p>
                        <br />
                        <div className="usercard-subtitle">Más Info</div>
                        <p className="usercard-desc">{user.more_info}</p>
                      </div>
                      <div className="usercard-content-2">
                        <div className="usercard-subtitle">Object id</div>
                        <p className="usercard-desc">{id}</p>
                        <br />
                        <div className="usercard-subtitle">Teléfono</div>
                        <p className="usercard-desc">{user.telefono}</p>
                        <br />
                        <div className="usercard-subtitle">Email</div>
                        <p className="usercard-desc">{user.email}</p>
                      </div>
                      {/* Renderizar campos adicionales si el rol es "tecnico" */}
                      {user.roles.some((role: any) => role.name === 'tecnico') && (
                          <div className='usercard-content-3'>
                            <div className="usercard-subtitle">Tipo</div>
                            <p className="usercard-desc">{user.type}</p>
                            <br />
                            <div className="usercard-subtitle">Título</div>
                            <p className="usercard-desc">{user.titulo}</p>
                            <br />
                            <div className="usercard-subtitle">Registro INVIMA</div>
                            <p className="usercard-desc">{user.reg_invima}</p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
                    {isAdmin && !isEditing && (
                <div className='usercard-buttons'>
                      <button
                        className="usercard-button"
                        data-section="#experience"
                        onClick={() => setIsEditing(!isEditing)}

                      >
                        Editar
                      </button>
                  </div>
                    )}
              </div>
            </section>
          </div>
        ) : (
          <div>
            <h2>Loading data...</h2>
          </div>
        )}
        <div className='delete-button-user'>
          <DeleteUserButton userId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
        </div>
      </div>
    </div>
  );
};
