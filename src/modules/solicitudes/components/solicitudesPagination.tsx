import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';

interface SolicitudesPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const SolicitudesPagination: React.FC<SolicitudesPaginationProps> = ({
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
    <div className='SolicitudesPagination-pagination-controls'>
      <IconButton className='SolicitudesPagination-IconButton' onClick={handlePrevPage} disabled={currentPage === 1}>
        <ArrowBackIosNewIcon className='SolicitudesPagination-ArrowBackIosNewIcon'/>
      </IconButton>
      <IconButton className='SolicitudesPagination-IconButton' onClick={handleNextPage} disabled={currentPage === totalPages}>
        <ArrowForwardIosIcon className='SolicitudesPagination-ArrowForwardIosIcon'/>
      </IconButton>
      <span className='SolicitudesPagination-ArrowForwardIosIcon'>Página {currentPage} de {totalPages}</span>
    </div>
  );
};

export default SolicitudesPagination;
