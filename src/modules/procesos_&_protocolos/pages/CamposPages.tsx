import React, { useState, useEffect } from 'react';
import { getAllCampos } from '../services/camposService';
import { useSessionStorage } from '../hooks/useSessionStorage';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import './styles/CamposPages.css';
import { Campo } from '../utils/types/Campo.type';
import { useNavigate } from 'react-router-dom';
import RegisterCampoButton from '../components/campos/RegisterCampoButton';
import SearchCampos from '../components/searchProcesos&ProtocolosTool/searchCampos';
import CamposCard from '../components/campos/CampoCard';

const CamposPages: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [campos, setCampos] = useState<Array<Campo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false); 

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampos = async () => {
      try {
        const token = loggedIn;
        const result = await getAllCampos(token);

        setCampos(result);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener campos:', error);
        window.location.href = '/login';
      }
    };

    fetchCampos();
  }, [loggedIn]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const navigateToCampoDetail = (id: string) => {
    navigate(`/campos/${id}`);
  };

  return (
    <div className='CamposPages-container'>
      <DashboardMenuLateral />
      <RegisterCampoButton />
      <SearchCampos
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
      />
      <div className='CamposPages-Container-Card'>
        {showSearchResults ? (
          <p></p>
        ) : (
          campos.map((campo) => (
            <CamposCard
              key={campo._id}
              campo={campo}
              onClick={() => navigateToCampoDetail(campo._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CamposPages;
