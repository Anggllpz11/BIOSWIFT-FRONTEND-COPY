import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';
import './styles/FiltersCamposToSelectOrdenes.css';

interface FiltersCamposToSelectOrdenesProps {
  onSubmit: (selectedFields: string[]) => void;
  onClose: () => void;
  initialSelectedFields: string[];
}

const FiltersCamposToSelectOrdenes: React.FC<FiltersCamposToSelectOrdenesProps> = ({
  onSubmit,
  onClose,
  initialSelectedFields,
}) => {
  const [fields] = useState<string[]>([
    'ID',
    'ID SOLICITUD',
    'ID SERVICIO',
  ]);

  const [selectedFields, setSelectedFields] = useState<string[]>(initialSelectedFields);

  useEffect(() => {
    setSelectedFields(initialSelectedFields);
  }, [initialSelectedFields]);

  const handleFieldChange = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedFields);
    onClose();
  };

  return (
    <div className="FiltersCamposToSelectOrdenes-box">
      <div className="FiltersCamposToSelectOrdenes-select-campos">
        <div className="FiltersCamposToSelectOrdenes-overlap">
          <div className="FiltersCamposToSelectOrdenes-container" />
          <div className="FiltersCamposToSelectOrdenes-header-section">
            <div className="FiltersCamposToSelectOrdenes-overlap-group">
              <div className="FiltersCamposToSelectOrdenes-header-title">SELECCIONAR CAMPOS</div>
            </div>
          </div>
          <div className="FiltersCamposToSelectOrdenes-campo-t">CAMPO</div>
          <div className="FiltersCamposToSelectOrdenes-visible-t">VISIBLE</div>
          <ul className="FiltersCamposToSelectOrdenes-campo-section">
            {fields.map((field) => (
              <li key={field} className="FiltersCamposToSelectOrdenes-div">
                <div className="FiltersCamposToSelectOrdenes-campo-value">{field}</div>
                <FormControlLabel
                  control={
                    <Checkbox
                      className="FiltersCamposToSelectOrdenes-check-box"
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldChange(field)}
                      style={{ color: '#00ddfa' }}
                    />
                  }
                  label=""
                />
              </li>
            ))}
          </ul>
          <button className="FiltersCamposToSelectOrdenes-cancel-button" onClick={onClose}>Cancelar</button>
          <button className="FiltersCamposToSelectOrdenes-send-button" onClick={handleSubmit}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default FiltersCamposToSelectOrdenes;
