import React from 'react';
import { ClaseEquipo } from '../../utils/types/ClaseEquipo.type';
import ClassIcon from '@mui/icons-material/Class';

interface ClaseEquipoCardProps {
  claseEquipo: ClaseEquipo;
  onViewDetails: () => void;
}

const ClaseEquipoCard: React.FC<ClaseEquipoCardProps> = ({ claseEquipo, onViewDetails }) => {
  return (
        <ul className='ClasesEquiposCard-cards-list'>
          <li>
             <div key={claseEquipo._id} onClick={onViewDetails} className="ClasesEquiposCard-box">
                <div className="ClasesEquiposCard-overlap-group-wrapper">
                  <div className="ClasesEquiposCard-overlap-group">
                    <div className="ClasesEquiposCard-overlap">
                      <ClassIcon className="ClasesEquiposCard-marcaequipo-icon"/>
                    </div>
                    <div className="ClasesEquiposCard-marcaequipo-title">{claseEquipo.clase}</div>
                    <div className="ClasesEquiposCard-marcaequipo-id">AREA ID: {claseEquipo._id}</div>
                  </div>
                </div>
              </div>
          </li>
        </ul>
  );
};

export default ClaseEquipoCard;
