import React from 'react';
import { Preventivo } from '../../utils/types/Preventivo.type';
import { useNavigate } from 'react-router-dom';
import FlakyOutlinedIcon from '@mui/icons-material/FlakyOutlined';

interface PreventivoCardProps {
  preventivo: Preventivo;
  onClick: () => void;
}

const PreventivoCard: React.FC<PreventivoCardProps> = ({ preventivo, onClick }) => {
  const navigate = useNavigate();

  return (
    <div key={preventivo._id} className='PreventivoCard-box'>
      <ul className='PreventivoPages-cards-list'  onClick={onClick}>
        <li>
              <div className="PreventivoCard-preventivo-card">
                <div className="PreventivoCard-overlap-group">
                  <div className="PreventivoCard-overlap">
                    <FlakyOutlinedIcon className="PreventivoCard-icon" />
                  </div>
                  <div className="PreventivoCard-title">{preventivo.title}</div>
                  <div className="PreventivoCard-id">{preventivo._id}</div>
                  <div className="PreventivoCard-div">
                    <div className="PreventivoCard-codigo-title">Código</div>
                    <div className="PreventivoCard-codigo-value">{preventivo.codigo}</div>
                  </div>
                  <div className="PreventivoCard-separator" />
                  <div className="PreventivoCard-overlap-2">
                    <div className="PreventivoCard-version-title">Versión</div>
                    <div className="PreventivoCard-text-wrapper">{preventivo.version}</div>
                  </div>
                  <div className="PreventivoCard-separator-2" />
                  <div className="PreventivoCard-overlap-3">
                    <div className="PreventivoCard-fecha-title">Fecha</div>
                    <div className="PreventivoCard-text-wrapper">{preventivo.fecha}</div>
                  </div>
                </div>
              </div>
        </li>
      </ul>
    </div>
  );
};

export default PreventivoCard;
