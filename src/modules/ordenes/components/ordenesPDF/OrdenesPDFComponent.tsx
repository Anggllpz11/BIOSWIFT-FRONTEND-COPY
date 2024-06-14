import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import OrdenAbiertaCorrectivoPDF from './OrdenAbiertaCorrectivoPDF/OrdenAbiertaCorrectivoPDF';
import { Orden } from '../../utils/types/Orden.type';

import './styles/OrdenesPDFComponent.css'

interface OrdenesPDFComponentProps {
  orden: Orden;
  onClose: () => void;
}

const OrdenesPDFComponent: React.FC<OrdenesPDFComponentProps> = ({ orden, onClose }) => {
  return (
    <div className="OrdenesPDFComponent-modal-overlay">
      <div className="OrdenesPDFComponent-modal-content">
        {orden.id_solicitud_servicio.id_servicio.servicio === "Correctivo" && (
          <OrdenAbiertaCorrectivoPDF orden={orden} />
        )}
        <CancelIcon className="OrdenesPDFComponent-modal-close-icon" onClick={onClose} />
      </div>
    </div>
  );
};

export default OrdenesPDFComponent;
