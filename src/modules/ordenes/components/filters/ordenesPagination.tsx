import React from 'react';
import './styles/OrdenesPagination.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';

interface OrdenesPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const OrdenesPagination: React.FC<OrdenesPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className='OrdenesPagination-pagination-controls'>
      <IconButton
        className='OrdenesPagination-IconButton'
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <ArrowBackIosNewIcon
          className={`OrdenesPagination-ArrowBackIosNewIcon ${
            currentPage > 1 ? 'active' : 'inactive'
          }`}
        />
      </IconButton>
      <IconButton
        className='OrdenesPagination-IconButton'
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <ArrowForwardIosIcon
          className={`OrdenesPagination-ArrowForwardIosIcon ${
            currentPage < totalPages ? 'active' : 'inactive'
          }`}
        />
      </IconButton>
      <span className='OrdenesPagination-page-number'>
        Página <span className='OrdenesPagination-page-number-value'>{currentPage}</span> de <span className='OrdenesPagination-page-number-value'>{totalPages}</span> 
      </span>
    </div>
  );
};

export default OrdenesPagination;
