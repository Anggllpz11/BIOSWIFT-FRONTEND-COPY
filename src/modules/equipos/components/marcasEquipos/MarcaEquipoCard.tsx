import React from 'react';
import { MarcaEquipo } from '../../utils/types/MarcaEquipo.type';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';



interface MarcaEquipoCardProps {
  marcaEquipo: MarcaEquipo;
  onViewDetails: () => void;
}

const MarcaEquipoCard: React.FC<MarcaEquipoCardProps> = ({ marcaEquipo, onViewDetails }) => {
  return (
        <ul className='MarcasEquipos-cards-list'>
          <li>
            <div key={marcaEquipo._id} onClick={onViewDetails} className="MarcasEquiposCard-box">
                <div className="MarcasEquiposCard-overlap-group-wrapper">
                  <div className="MarcasEquiposCard-overlap-group">
                    <div className="MarcasEquiposCard-overlap">
                      <LocalOfferOutlinedIcon className="MarcasEquiposCard-marcaequipo-icon"/>
                    </div>
                    <div className="MarcasEquiposCard-marcaequipo-title">{marcaEquipo.marca}</div>
                    <div className="MarcasEquiposCard-marcaequipo-id">MARCA ID: {marcaEquipo._id}</div>
                  </div>
                </div>
              </div>
          </li>
        </ul>

    
  );
};

export default MarcaEquipoCard;
