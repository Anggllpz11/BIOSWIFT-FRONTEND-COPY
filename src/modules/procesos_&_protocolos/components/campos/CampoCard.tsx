import React from 'react';
import { Campo } from '../../utils/types/Campo.type';
import { useNavigate } from 'react-router-dom';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';

interface CamposCardProps {
  campo: Campo;
  onClick: () => void;
}

const CamposCard: React.FC<CamposCardProps> = ({ campo, onClick }) => {
  const navigate = useNavigate();

  return (
    <div key={campo._id} className='CamposCard-box' onClick={onClick}>
      <div className="CamposCard-campo-card">
          <div className="CamposCard-box-1">
            <div className="CamposCard-campos-container">
              <div className="CamposCard-overlap-group">
                <FormatListBulletedOutlinedIcon className="CamposCard-icon"/>
                <div className="CamposCard-overlap">
                  <div className="CamposCard-title">{campo.title}</div>
                  <div className="CamposCard-id">ID: {campo._id}</div>
                </div>
                <div className="CamposCard-tipo">TIPO: {campo.id_tipo.nombre}</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CamposCard;
