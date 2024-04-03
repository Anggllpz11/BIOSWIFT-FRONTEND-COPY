import React, { useState, useEffect } from 'react';
import { getAllPreventivos } from '../services/preventivosService';
import { useSessionStorage } from '../hooks/useSessionStorage';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import './styles/PreventivosPages.css'; 
// Importa PreventivoCard
import PreventivoCard from '../components/preventivos/PreventivoCard';
import { Preventivo } from '../utils/types/Preventivo.type';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import RegisterPreventivoButton from '../components/preventivos/RegisterPreventivoButton';
import SearchPreventivos from '../components/searchProcesos&ProtocolosTool/searchPreventivos';
// import SearchPreventivos from '../components/searchPreventivosTools/SearchPreventivos';

const PreventivosPages: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [preventivos, setPreventivos] = useState<Array<Preventivo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nuevo estado

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Agrega useNavigate para la navegación

  useEffect(() => {
    const fetchPreventivos = async () => {
      try {
        const token = loggedIn;
        const result = await getAllPreventivos(token);

        setPreventivos(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener preventivos:', error);
        window.location.href = '/login';
      }
    };

    fetchPreventivos();
  }, [loggedIn]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Define la función navigateToPreventivoDetail para la navegación
  const navigateToPreventivoDetail = (id: string) => {
    navigate(`/preventivos/${id}`);
  };

  return (
    <div className='PreventivosPages-container'>
      <DashboardMenuLateral />
      <RegisterPreventivoButton />
      <SearchPreventivos // Renderiza el componente SearchPreventivos
        showSearchResults={showSearchResults} // Inicialmente, no muestra los resultados de la búsqueda
        setShowSearchResults={setShowSearchResults} // Esta función no se utiliza inicialmente
      />
      <div className='PreventivosPages-Container-Card'>
        {showSearchResults ? (
          <p></p>
        ) : (
          preventivos.map((preventivo) => (
            <PreventivoCard
              key={preventivo._id}
              preventivo={preventivo}
              onClick={() => navigateToPreventivoDetail(preventivo._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PreventivosPages;
