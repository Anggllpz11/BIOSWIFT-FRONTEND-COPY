import React, { useState, useEffect } from 'react';
import { getAllOrdenes, searchOrdenesByKeyword } from '../services/ordenesService';
import { useSessionStorage } from '../../users/hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import { Orden } from '../utils/types/Orden.type';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import OrdenCard from '../components/ordenes_servicios/OrdenCard';
import OrdenesPagination from '../components/filters/ordenesPagination';
import OrdenLimitation from '../components/filters/OrdenLimitation';
import SearchOrdenes from '../components/filters/SearchOrdenes';
import './styles/OrdenesServicioPages.css';
import { CircularProgress } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import AdvancedFiltersOrdenes from '../components/filters/AdvancedFiltersOrdenes';

const OrdenesPages: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [ordenes, setOrdenes] = useState<Array<Orden>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<Orden>>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0); 
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAdvancedFiltersOrdenesModal, setShowAdvancedFiltersOrdenesModal] = useState(false);
  const navigate = useNavigate();

  const fetchOrdenes = async (page: number, limit: number) => {
    try {
      const token = loggedIn;
      const result = await getAllOrdenes(token, limit, page);
      setOrdenes(result.ordenes);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems); 
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      window.location.href = '/login';
    }
  };

  const handleSearch = async (keyword: string, page: number, limit: number) => {
    try {
      const token = loggedIn;
      const result = await searchOrdenesByKeyword(token, keyword, limit, page);
      setSearchResults(result.ordenes);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems); 
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error al buscar órdenes:', error);
    }
  };

  useEffect(() => {
    if (!showSearchResults) {
      fetchOrdenes(currentPage, limitPerPage);
    } else {
      handleSearch(searchKeyword, currentPage, limitPerPage);
    }
  }, [loggedIn, currentPage, limitPerPage, showSearchResults, searchKeyword]);

  if (loading) {
    return (
      <div className="OrdenesPages-loading-overlay">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  const navigateToOrdenDetail = (id: string) => {
    navigate(`/ordenes/${id}`);
  };

  return (
    <div className='OrdenesPages-container'>
      <DashboardMenuLateral />
      <div className='OrdenesPages-filters-container'>
        <OrdenesPagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
        <OrdenLimitation 
          limitPerPage={limitPerPage}
          setLimitPerPage={(limit) => {
            setLimitPerPage(limit);
            setCurrentPage(1); 
          }}
        />
        <div className='OrdenesPages-document-count'>
          {showSearchResults ? (
            <p className='OrdenesPages-totalItems'>
               Viendo <span className='OrdenesPages-highlight'>{searchResults.length}</span> de <span className='OrdenesPages-highlight'>{totalItems}</span>
            </p>
          ) : (
            <p className='OrdenesPages-totalItems'>
               Viendo <span className='OrdenesPages-highlight'>{ordenes.length}</span> de <span className='OrdenesPages-highlight'>{totalItems}</span>
            </p>
          )}
        </div>
        <div className='OrdenesPages-title'>ORDENES DE SERVICIO</div>
        <TuneIcon className='OrdenesPages-filters-icon' onClick={() => setShowAdvancedFiltersOrdenesModal(true)} />
        <div className='OrdenesPages-xls-title'>XLS</div>
        <div className='OrdenesPages-select-items'>Seleccionar</div>

        <SearchOrdenes
          showSearchResults={showSearchResults}
          setShowSearchResults={(show) => {
            setShowSearchResults(show);
            if (!show) setCurrentPage(1); 
          }}
          setSearchResults={setSearchResults}
          handleSearch={async (keyword) => {
            setSearchKeyword(keyword);
            setCurrentPage(1); 
            await handleSearch(keyword, 1, limitPerPage);
          }}
        />
      </div>
      
      <div className='OrdenesPages-container-Card'>
        <ul className='OrdenesPages-ul-cards'>
          {showSearchResults ? (
            searchResults.map((orden) => (
              <OrdenCard key={orden._id} orden={orden} onClick={() => navigateToOrdenDetail(orden._id)} />
            ))
          ) : (
            ordenes.map((orden) => (
              <OrdenCard key={orden._id} orden={orden} onClick={() => navigateToOrdenDetail(orden._id)} />
            ))
          )}
        </ul>
      </div>

      {showAdvancedFiltersOrdenesModal && (
        <AdvancedFiltersOrdenes
          isOpen={showAdvancedFiltersOrdenesModal}
          onClose={() => setShowAdvancedFiltersOrdenesModal(false)}
          setFilteredOrdenes={setOrdenes}
          setTotalPages={setTotalPages}
          setTotalItems={setTotalItems}
        />
      )}
    </div>
  );
};

export default OrdenesPages;
