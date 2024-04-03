import React from 'react';
import { RepuestoEquipo } from '../../utils/types/RepuestoEquipo.type';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';


interface RepuestoEquipoCardProps {
  repuestoEquipo: RepuestoEquipo;
  onClick: () => void;
}

const RepuestoEquipoCard: React.FC<RepuestoEquipoCardProps> = ({ repuestoEquipo, onClick }) => {
  return (
    <div key={repuestoEquipo._id} className='RepuestoEquipoCard-box'onClick={onClick}>
      <ul className='RepuestosEquiposPages-cards-list'>
        <li>

            <div className="RepuestoEquipoCard-box-2">
                <div className="RepuestoEquipoCard-repuestos-equipos">
                    <div className="RepuestoEquipoCard-overlap-group">
                        <div className="RepuestoEquipoCard-overlap">
                            <HandymanOutlinedIcon className="RepuestoEquipoCard-screw"/>
                        </div>
                        <div className="RepuestoEquipoCard-div">
                            <div className="RepuestoEquipoCard-overlap-2">
                                <div className="RepuestoEquipoCard-repuestoequipo-name">{repuestoEquipo.repuesto_name}</div>
                                <div className="RepuestoEquipoCard-repuestoequipo-id">REPUESTO ID: {repuestoEquipo._id}</div>
                                <div className="RepuestoEquipoCard-repuestoequipo" />
                                <div className="RepuestoEquipoCard-repuestoequipo-2" />
                            </div>
                            <div className="RepuestoEquipoCard-text-wrapper">Cliente</div>
                            <div className="RepuestoEquipoCard-repuestoequipo-3">{repuestoEquipo.id_cliente ? repuestoEquipo.id_cliente.client_name : 'Cliente no especificado/a'}</div>
                            <div className="RepuestoEquipoCard-repuestoequipo-4">Cantidad</div>
                            <div className="RepuestoEquipoCard-repuestoequipo-5">{repuestoEquipo.repuesto_cantidad}</div>
                            <div className="RepuestoEquipoCard-repuestoequipo-6">Precio</div>
                            <div className="RepuestoEquipoCard-repuestoequipo-7">{repuestoEquipo.repuesto_precio}</div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
      </ul>
    </div>
  );
};

export default RepuestoEquipoCard;
