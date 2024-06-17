import React, { useState } from 'react';
import { Orden } from '../../utils/types/Orden.type';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { filterAdvancedOrdenes } from '../../services/ordenesService';
import './styles/AdvancedFiltersOrdenes.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import MuiAlertComponent from '../../../../components/MuiAlertsComponent';
import FiltersCamposToSelectOrdenes from './FiltersCamposToSelectOrdenes';

interface AdvancedFiltersOrdenesProps {
  isOpen: boolean;
  onClose: () => void;
  setFilteredOrdenes: (ordenes: Orden[]) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalItems: (totalItems: number) => void;
}

interface Alert {
  id: number;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

const AdvancedFiltersOrdenes: React.FC<AdvancedFiltersOrdenesProps> = ({
  isOpen,
  onClose,
  setFilteredOrdenes,
  setTotalPages,
  setTotalItems,
}) => {
  const [filters, setFilters] = useState<any[]>([{ _id: '', 'id_solicitud_servicio._id': '', 'id_solicitud_servicio.id_servicio': '' }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean[]>(filters.map(() => false));
  const [results, setResults] = useState<(boolean | null)[]>(filters.map(() => null));
  const [showViewButton, setShowViewButton] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(['ID', 'ID SOLICITUD', 'ID SERVICIO']);
  const token = useSessionStorage('sessionJWTToken');

  const handleAddFilter = () => {
    setFilters([...filters, { _id: '', 'id_solicitud_servicio._id': '', 'id_solicitud_servicio.id_servicio': '' }]);
    setLoading([...loading, false]);
    setResults([...results, null]);
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const hexPattern = /^[0-9a-fA-F]*$/;
    if (hexPattern.test(value) && value.length <= 24) {
      const newFilters = [...filters];
      newFilters[index][field] = value;
      setFilters(newFilters);
    }
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    const newLoading = [...loading];
    const newResults = [...results];
    newFilters.splice(index, 1);
    newLoading.splice(index, 1);
    newResults.splice(index, 1);
    setFilters(newFilters);
    setLoading(newLoading);
    setResults(newResults);
  };

  const handleSearch = async () => {
    const invalidFilters = filters.some(filter => filter._id.length !== 24 || (selectedFields.includes('ID SOLICITUD') && filter['id_solicitud_servicio._id'].length !== 24) || (selectedFields.includes('ID SERVICIO') && filter['id_solicitud_servicio.id_servicio'].length !== 24));
    if (invalidFilters) {
      const newAlert: Alert = {
        id: new Date().getTime(),
        message: 'Por favor ingrese un formato de ID válido.',
        severity: 'error',
      };
      setAlerts([...alerts, newAlert]);
      return;
    }

    const newLoading = filters.map(() => true);
    const newResults: (boolean | null)[] = filters.map(() => null);
    setLoading(newLoading);
    setResults(newResults);
    let allResults: Orden[] = [];

    for (let i = 0; i < filters.length; i++) {
      try {
        const result = await filterAdvancedOrdenes(token, [filters[i]], limitPerPage, currentPage);
        if (result.ordenes.length > 0) {
          newResults[i] = true;
          allResults.push(...result.ordenes);
        } else {
          newResults[i] = false;
        }
      } catch (error) {
        console.error('Error al filtrar órdenes:', error);
        newResults[i] = false;
      } finally {
        newLoading[i] = false;
        setLoading([...newLoading]);
        setResults([...newResults]);
      }
    }

    setFilteredOrdenes(allResults);
    setTotalPages(Math.ceil(allResults.length / limitPerPage));
    setTotalItems(allResults.length);
    setShowViewButton(true);
    setIsEditing(false);
  };

  const handleView = () => {
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowViewButton(false);
    setResults(filters.map(() => null));
  };

  const handleCloseAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleFieldSelection = (fields: string[]) => {
    setSelectedFields(fields);
    const newFilters = filters.map(filter => {
      const newFilter: any = { _id: filter._id };
      if (fields.includes('ID SOLICITUD')) {
        newFilter['id_solicitud_servicio._id'] = filter['id_solicitud_servicio._id'] || '';
      }
      if (fields.includes('ID SERVICIO')) {
        newFilter['id_solicitud_servicio.id_servicio'] = filter['id_solicitud_servicio.id_servicio'] || '';
      }
      return newFilter;
    });
    setFilters(newFilters);
    setShowFieldSelector(false);
  };

  return (
    isOpen ? (
      <div className="AdvancedFiltersOrdenes-modal-overlay">
        <div className="AdvancedFiltersOrdenes-modal-content">
          <div className="AdvancedFiltersOrdenes-advanced-filters">
            <div className="AdvancedFiltersOrdenes-div">
              <div className="AdvancedFiltersOrdenes-overlap">
                <header className="AdvancedFiltersOrdenes-header">
                  <div className="AdvancedFiltersOrdenes-overlap-group">
                    <div className="AdvancedFiltersOrdenes-filter-title">FILTRAR ORDENES</div>
                  </div>
                </header>
                {isEditing && <AddCircleIcon className="AdvancedFiltersOrdenes-filter-add-icon" onClick={handleAddFilter} />}
                <FilterListIcon className="AdvancedFiltersOrdenes-options-icon" onClick={() => setShowFieldSelector(true)} />
              </div>
              <ul className="AdvancedFiltersOrdenes-filter-ul">
                {filters.map((filter, index) => (
                  <li key={index} className="AdvancedFiltersOrdenes-filter-li">
                    <div className="AdvancedFiltersOrdenes-id-parameter">
                      <input
                        type="text"
                        className="AdvancedFiltersOrdenes-id-input"
                        value={filter._id || ''}
                        pattern="[0-9a-fA-F]{0,24}"
                        maxLength={24}
                        onChange={(e) => handleFilterChange(index, '_id', e.target.value)}
                        disabled={!isEditing}
                      />
                      <div className="AdvancedFiltersOrdenes-id-title">ID</div>
                    </div>
                    {selectedFields.includes('ID SOLICITUD') && (
                      <div className="AdvancedFiltersOrdenes-id-parameter">
                        <input
                          type="text"
                          className="AdvancedFiltersOrdenes-id-input"
                          value={filter['id_solicitud_servicio._id'] || ''}
                          pattern="[0-9a-fA-F]{0,24}"
                          maxLength={24}
                          onChange={(e) => handleFilterChange(index, 'id_solicitud_servicio._id', e.target.value)}
                          disabled={!isEditing}
                        />
                        <div className="AdvancedFiltersOrdenes-id-title">ID SOLICITUD</div>
                      </div>
                    )}
                    {selectedFields.includes('ID SERVICIO') && (
                      <div className="AdvancedFiltersOrdenes-id-parameter">
                        <input
                          type="text"
                          className="AdvancedFiltersOrdenes-id-input"
                          value={filter['id_solicitud_servicio.id_servicio'] || ''}
                          pattern="[0-9a-fA-F]{0,24}"
                          maxLength={24}
                          onChange={(e) => handleFilterChange(index, 'id_solicitud_servicio.id_servicio', e.target.value)}
                          disabled={!isEditing}
                        />
                        <div className="AdvancedFiltersOrdenes-id-title">ID SERVICIO</div>
                      </div>
                    )}
                    {loading[index] ? (
                      <CircularProgress className="AdvancedFiltersOrdenes-loading-icon" />
                    ) : results[index] === true ? (
                      <CheckCircleIcon className="AdvancedFiltersOrdenes-check-icon" />
                    ) : results[index] === false ? (
                      <CancelIcon className="AdvancedFiltersOrdenes-error-icon" />
                    ) : (
                      isEditing && <CancelIcon className="AdvancedFiltersOrdenes-delete-icon" onClick={() => handleRemoveFilter(index)} />
                    )}
                    <div className="AdvancedFiltersOrdenes-separator" />
                  </li>
                ))}
              </ul>

              {isEditing ? (
                <button className="AdvancedFiltersOrdenes-cancel-button" onClick={onClose}>Cancelar</button>
              ) : (
                <button className="AdvancedFiltersOrdenes-edit-button" onClick={handleEdit}>Editar</button>
              )}
              {showViewButton ? (
                <button className="AdvancedFiltersOrdenes-view-button" onClick={handleView}>Ver</button>
              ) : (
                <button className="AdvancedFiltersOrdenes-send-button" onClick={handleSearch}>Enviar</button>
              )}
            </div>
          </div>
        </div>
        <MuiAlertComponent alerts={alerts} onClose={handleCloseAlert} />
        {showFieldSelector && (
          <FiltersCamposToSelectOrdenes
            onSubmit={handleFieldSelection}
            onClose={() => setShowFieldSelector(false)}
            initialSelectedFields={selectedFields}
          />
        )}
      </div>
    ) : null
  );
};

export default AdvancedFiltersOrdenes;
