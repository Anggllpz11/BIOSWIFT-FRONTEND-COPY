import React from 'react';
import { AreaEquipo } from '../../utils/types/AreaEquipo.type';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
interface AreaEquipoCardProps {
  areaEquipo: AreaEquipo;
  onViewDetails: () => void;
}

const AreaEquipoCard: React.FC<AreaEquipoCardProps> = ({ areaEquipo, onViewDetails }) => {
  return (
        <ul className='AreasEquiposCard-cards-list'>
          <li>
              <div key={areaEquipo._id} onClick={onViewDetails} className="AreasEquiposCard-box">
                <div className="AreasEquiposCard-overlap-group-wrapper">
                  <div className="AreasEquiposCard-overlap-group">
                    <div className="AreasEquiposCard-overlap">
                      <SpaceDashboardIcon className="AreasEquiposCard-marcaequipo-icon"/>
                    </div>
                    <div className="AreasEquiposCard-marcaequipo-title">{areaEquipo.area}</div>
                    <div className="AreasEquiposCard-marcaequipo-id">AREA ID: {areaEquipo._id}</div>
                  </div>
                </div>
              </div>
          
          </li>
        </ul>

  );
};

export default AreaEquipoCard;
