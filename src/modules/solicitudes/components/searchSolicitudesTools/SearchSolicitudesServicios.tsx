import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SearchSolicitudesServicios.css'; 
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { searchSolicitudesServiciosByKeyword } from '../../services/searchSolicitudesService'; // Importa tu servicio de búsqueda
import { useSessionStorage } from '../../../users/hooks/useSessionStorage';
import SolicitudServicioCard from '../solicitudes_servicios/SolicitudServicioCard';

interface SearchSolicitudesServiciosProps {
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

const SearchSolicitudesServicios: React.FC<SearchSolicitudesServiciosProps> = ({ showSearchResults, setShowSearchResults }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const results = await searchSolicitudesServiciosByKeyword(loggedIn, keyword); // Usa la función de búsqueda para solicitudes de servicios
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToSolicitudDetail = (id: string) => {
    navigate(`/solicitudes-servicios/${id}`); // Asegúrate de tener esta ruta en tu Router
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que el formulario se envíe
    handleSearch(); // Llama a la función de búsqueda al presionar "Enter"
  };

  return (
    <div>
      <div className='SearchSolicitudesServicios-section'>
        <div className='SearchSolicitudesServicios-section-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="SEARCH..."
              className='SearchSolicitudesServicios-input'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton className='SearchSolicitudesServicios-IconButton' type="submit" aria-label="search">
              <SearchIcon className='SearchSolicitudesServicios-icon-search' />
            </IconButton>
          </form>
        </div>
      </div>
      <div>
        {showSearchResults ? (
          <div className='SolicitudesServiciosPages-Container-Card-Results'>
            {searchResults.map((solicitud) => (
              <SolicitudServicioCard key={solicitud._id} solicitud={solicitud} onClick={() => navigateToSolicitudDetail(solicitud._id)} />
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SearchSolicitudesServicios;
