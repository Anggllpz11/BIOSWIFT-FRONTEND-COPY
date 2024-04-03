import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getAllModeloEquipos } from '../services/equiposModeloService';
import { EquiposModelo } from '../utils/types/EquipoModelo.type';
import EquipoModeloCard from '../components/equiposModelos/EquipoModeloCard';
import { useNavigate } from 'react-router-dom';
import './styles/EquipoModeloPage.css';
import DashboardMenuLateral from '../../users/components/dashboard/DashboardMenulateral';
import SearchModelosEquipos from '../components/searchEquiposTools/SearchModeloEquipos';
import RegisterModeloEquipoButton from '../components/equiposModelos/RegisterModeloEquipoButton';
import { WindPowerOutlined } from '@mui/icons-material';

const EquipoModeloPage = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [modelosEquipos, setModelosEquipos] = useState<Array<EquiposModelo>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }

    getAllModeloEquipos(loggedIn)
      .then((data: EquiposModelo[]) => {
        setModelosEquipos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // También puedes redirigir a la página de inicio de sesión en caso de error aquí
        navigate('/login');
      });
  }, [loggedIn, navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleViewDetails = (id: string) => {
    navigate(`/equipos/modelo/${id}`);
  };

  return (
    <div className="EquipoModeloPage-container">
      <DashboardMenuLateral />
      <RegisterModeloEquipoButton />
      <SearchModelosEquipos
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
      />
      <div className="EquipoModeloPage-Container-Card">
        {showSearchResults ? <p></p> : modelosEquipos.map((modeloEquipo) => (
          <EquipoModeloCard
            key={modeloEquipo._id}
            modeloEquipo={modeloEquipo}
            onViewDetails={() => handleViewDetails(modeloEquipo._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipoModeloPage;
