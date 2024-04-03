import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultClientImg from '../../pages/img/defaultClientImg.png';

interface ClientCardProps {
  client: any;
  onClick: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const navigate = useNavigate();

  const navigateToClientDetail = (id: string) => {
    navigate(`/clientes/${id}`);
  };

  return (
    <div key={client._id} className='ClientsPages-container-card'>
      <div className='ClientsPages-card-section'>
        <ul className='ClientsPages-cards-list'>
          <li>
            <a type='#' className='ClientsPages-card' onClick={onClick}>
              <div className='ClientsPages-card-cover'></div>
              <div className='ClientsPages-card-overlay'>
                <div className='ClientsPages-card-header'>
                  <img
                    src={DefaultClientImg}
                    className='ClientsPages-card-ClientImage'
                    alt=''
                    height='70px'
                    width='70px'
                  ></img>
                  <div className='ClientsPages-card-header-text'>
                    <h3 className='ClientsPages-card-title'>{client.client_name}</h3>
                    <br />
                    <span className='ClientsPages-card-status'>{client.client_nit}</span>
                  </div>
                </div>
                <p className='ClientsPages-card-description'>{client.client_address}</p>
                <p className='ClientsPages-card-description'>{client.client_email}</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClientCard;
