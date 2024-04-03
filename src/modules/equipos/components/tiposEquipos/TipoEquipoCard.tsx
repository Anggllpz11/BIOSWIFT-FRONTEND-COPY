import React from 'react';
import { TipoEquipo } from '../../utils/types/TipoEquipo.type';
import TypeSpecimenOutlinedIcon from '@mui/icons-material/TypeSpecimenOutlined';

interface TipoEquipoCardProps {
  tipoEquipo: TipoEquipo;
  onViewDetails: () => void;
}

const TipoEquipoCard: React.FC<TipoEquipoCardProps> = ({ tipoEquipo, onViewDetails }) => {
  return (
    <div key={tipoEquipo._id} className='TipoEquipoCard-container-card'>
       <ul className='TipoEquipoCard-cards-list'>
          <li>
              <div onClick={onViewDetails} className="TipoEquipoCard-box">
                <div className="TipoEquipoCard-overlap-group-wrapper">
                  <div className="TipoEquipoCard-overlap-group">
                    <div className="TipoEquipoCard-overlap">
                      <TypeSpecimenOutlinedIcon className="TipoEquipoCard-marcaequipo-icon"/>
                    </div>
                    <div className="TipoEquipoCard-marcaequipo-title">{tipoEquipo.tipo}</div>
                    <div className="TipoEquipoCard-marcaequipo-id">AREA ID: {tipoEquipo._id}</div>
                  </div>
                </div>
              </div>
          
          </li>
        </ul>
    </div>
  );
};

export default TipoEquipoCard;
