import React from 'react';
import { Equipo } from '../../utils/types/Equipo.type';
import FaxOutlinedIcon from '@mui/icons-material/FaxOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
interface EquipoCardProps {
  equipo: Equipo;
  onClick: () => void;
}

const EquipoCard: React.FC<EquipoCardProps> = ({ equipo, onClick }) => {
  return (
    <div key={equipo._id} className='EquipoCard-box'>
      <ul >
        <li className='EquiposPages-cards-list'>
                <div className="EquipoCard-equipospages-card" >
                  <div className="EquipoCard-overlap-group" onClick={onClick}>
                    <FaxOutlinedIcon className="EquipoCard-div" />
                    <p className='EquipoCard-oid'>ID: {equipo ? equipo._id : 'N/A'}</p>
                    <div className="EquipoCard-text-wrapper">{equipo.modelo_equipos ? equipo.modelo_equipos.id_clase.clase : 'N/A'}</div>
                    <div className="EquipoCard-equipospages-card-x">Client: </div>
                    <div className="EquipoCard-equipospages-card-2">{equipo.id_sede.id_client ? equipo.id_sede.id_client.client_name : 'N/A'}</div>
                    <div className="EquipoCard-overlap-2">
                      <div className="EquipoCard-equipospages-card-3">Sede:</div>
                      <div className="EquipoCard-equipospages-card-4">{equipo.id_sede ? equipo.id_sede.sede_nombre : 'Sede no especificada'}</div>
                    </div>
                    <div className="EquipoCard-overlap-3">
                      <div className="EquipoCard-equipospages-card-5">SN:</div>
                      <div className="EquipoCard-equipospages-card-6">{equipo ? equipo.serie : 'N/A'}</div>
                    </div>
                    <CheckOutlinedIcon className="EquipoCard-check" />
                  </div>
                </div>
        </li>
      </ul>
        
    </div>
  );
};

export default EquipoCard;
