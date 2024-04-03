import React, { useEffect, useState } from 'react';
import './styles/ClientDetailPage.css';
import ClientImg from './img/defaultClientImg.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getClientById } from '../services/clientsService';
import { AxiosResponse } from 'axios';
import { Client } from '../utils/types/Client.type';
import DashboardMenuLateral from '../components/dashboard/DashboardMenulateral';
import DeleteClientButton from '../components/clients/DeleteClientButton';
import EditClientButton from '../components/clients/EditClientButton';
import useUserRoleVerifier from '../hooks/useUserRoleVerifier';
import { logoutService } from '../services/authService';

export const ClientDetailPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const isAdmin = useUserRoleVerifier(['administrador']);
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loggedIn) {
      return logoutService();
    } else {
      if (id) {
        getClientById(loggedIn, id)
          .then((response: AxiosResponse) => {
            if (response.status === 200 && response.data) {
              setClient(response.data);
            }
          })
          .catch((error: any) => console.error(`[CLIENT BY ID ERROR]: ${error}`));
      } else {
        return navigate('/clientes');
      }
    }
  }, [loggedIn, id, navigate]);

  const handleDeleteSuccess = () => {
    navigate('/clientes');
    window.alert('Cliente Eliminado satisfactoriamente');
  };

  const handleSaveSuccess = (editedClient: Client) => {
    setClient(editedClient);
    setIsEditing(false);
  };

  return (
    <div className="">
      <DashboardMenuLateral />
      <div className="">
        {client ? (
          <div className='ClientCard'>
            <section className="clientcard-client-section">
              <div className="clientcard" data-state="#about">
                <div className="clientcard-header">
                  <div className="clientcard-cover"></div>
                  <img
                    className='clientcard-Avatar'
                    src={ClientImg}
                    alt=""
                    width="90px"
                    height="80px"
                  />
                  <h2 className="clientcard-fullname">{client.client_name}</h2>
                  <div className="clientcard-nit">NIT: {client.client_nit}</div>
                </div>
                <div className="clientcard-main">
                  <EditClientButton
                    clientId={id || ''}
                    clientData={client}
                    onSaveSuccess={handleSaveSuccess}
                    isEditing={isEditing}
                  />
                  {isEditing ? null : (
                    <div className="clientcard-section is-active">
                      <div className="clientcard-content-1">
                        <div className="clientcard-subtitle">Dirección</div>
                        <p className="clientcard-desc">{client.client_address}</p>
                        <br />
                        <div className="clientcard-subtitle">Teléfono</div>
                        <p className="clientcard-desc">{client.client_telefono}</p>
                        <br />
                        <div className="clientcard-subtitle">Email</div>
                        <p className="clientcard-desc">{client.client_email}</p>
                      </div>
                    </div>
                  )}
                </div>
                {isAdmin && !isEditing && (
                  <div className='clientcard-buttons'>
                    <button
                      className="clientcard-button"
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
        <div className='delete-button-client'>
          <DeleteClientButton clientId={id || ''} onDeleteSuccess={handleDeleteSuccess} />
        </div>
      </div>
    </div>
  );
};
