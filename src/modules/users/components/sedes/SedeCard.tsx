
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultSedeImg from './img/DefaultSedeImg.png';

interface SedeCardProps {
  sede: any;
  onClick: () => void;
}

const SedeCard: React.FC<SedeCardProps> = ({ sede, onClick }) => {
  const navigate = useNavigate();

  const navigateToSedeDetail = (id: string) => {
    navigate(`/sedes/${id}`);
  };

  return (
    <div key={sede._id} className='SedesPages-container-card'>
      <div className='SedesPages-card-section'>
        <ul className='SedesPages-cards-list'>
          <li>
            <a type='#' className='SedesPages-card' onClick={onClick}>
              <div className='SedesPages-card-cover'></div>
              <div className='SedesPages-card-overlay'>
                <div className='SedesPages-card-header'>
                  <img
                    src={DefaultSedeImg}
                    className='SedesPages-card-SedeImage'
                    alt=''
                    height='70px'
                    width='70px'
                  ></img>
                  <div className='SedesPages-card-header-text'>
                    <h3 className='SedesPages-card-title'>{sede.sede_nombre}</h3>
                    <span className='SedesPages-card-status'>{sede.sede_telefono}</span>
                    <br></br>
                    <span className='SedesPages-card-status'>{sede.sede_email}</span>
                  </div>
                </div>
                <p className='SedesPages-card-description'>{sede.sede_address}</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SedeCard;
