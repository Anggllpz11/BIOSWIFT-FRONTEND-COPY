import React from 'react';
import './styles/OrdenLimitation.css';

interface OrdenLimitationProps {
  limitPerPage: number;
  setLimitPerPage: React.Dispatch<React.SetStateAction<number>>;
}

const predefinedLimits = [50, 100, 150, 200, 250, 300];

const OrdenLimitation: React.FC<OrdenLimitationProps> = ({ limitPerPage, setLimitPerPage }) => {
  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setLimitPerPage(Number(event.target.value));
  };

  return (
    <div className="orden-limitation-container">
      <label htmlFor="limit-select" className="orden-limitation-label">Limite por página:</label>
      <select
        id="limit-select"
        value={limitPerPage}
        onChange={handleLimitChange}
        className="orden-limitation-select"
      >
        {predefinedLimits.map((limit) => (
          <option key={limit} value={limit}>
            {limit}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={limitPerPage}
        onChange={handleLimitChange}
        className="orden-limitation-input"
      />
    </div>
  );
};

export default OrdenLimitation;
