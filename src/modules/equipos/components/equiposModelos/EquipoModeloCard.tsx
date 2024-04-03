import React from 'react';
import { EquiposModelo } from '../../utils/types/EquipoModelo.type';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

interface EquipoModeloCardProps {
  modeloEquipo: EquiposModelo;
  onViewDetails: () => void;
}

const EquipoModeloCard: React.FC<EquipoModeloCardProps> = ({ modeloEquipo, onViewDetails }) => {
  return (
       <div key={modeloEquipo._id} className='EquipoModeloCard-box'>
          <ul className='EquipoModeloPage-cards-list'>
            <li>
                  <div className="EquipoModeloCard-overlap" onClick={onViewDetails}>
                    <div className="EquipoModeloCard-equipospages-card">
                      <div className="EquipoModeloCard-overlap-group">
                        <DevicesOtherOutlinedIcon className="EquipoModeloCard-div" />
                        <div className="EquipoModeloCard-text-wrapper">{modeloEquipo.modelo}</div>
                        <div className="EquipoModeloCard-equipospages-card-2">$: {modeloEquipo.precio}</div>
                        <div className="EquipoModeloCard-overlap-2">
                          <div className="EquipoModeloCard-equipospages-card-3">Marca:</div>
                          <div className="EquipoModeloCard-equipospages-card-4">{modeloEquipo.id_marca.marca}</div>
                        </div>
                        <div className="EquipoModeloCard-overlap-3">
                          <div className="EquipoModeloCard-equipospages-card-5">Clase:</div>
                          <div className="EquipoModeloCard-equipospages-card-6">{modeloEquipo.id_clase.clase}</div>
                        </div>
                        <CheckOutlinedIcon className="EquipoModeloCard-check" />
                      </div>
                    </div>
                    <div className="EquipoModeloCard-equipospages-2" />
                  </div>
            </li>
          </ul>
        
      </div>
  );
};

export default EquipoModeloCard;
