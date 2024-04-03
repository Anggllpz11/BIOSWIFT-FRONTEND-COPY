import React, { useState, FormEvent, useEffect } from 'react';
import { createRepuestoEquipo } from '../../../services/repuestosEquiposService';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';

import './styles/RegisterRepuestoEquipoForm.css'; // Ajusta la ruta a tus estilos
import { searchClientByKeyword } from '../../../../users/services/clientsService';

const RegisterRepuestoEquipoForm: React.FC = () => {
  const loggedIn = useSessionStorage('sessionJWTToken');
  const [repuestoEquipoData, setRepuestoEquipoData] = useState({
    id_cliente: '',
    repuesto_name: '',
    repuesto_cantidad: 0,
    repuesto_precio: 0,
  });
  const [clientKeyword, setClientKeyword] = useState('');
  const [clientResults, setClientResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      if (clientKeyword.trim()) {
        try {
          const results = await searchClientByKeyword(loggedIn, clientKeyword);
          setClientResults(results);
        } catch (error) {
          console.error('Error searching for clients:', error);
        }
      } else {
        setClientResults([]);
      }
    };

    fetchClients();
  }, [clientKeyword, loggedIn]);

  const handleSelectClient = (client: any) => {
    setRepuestoEquipoData({ ...repuestoEquipoData, id_cliente: client._id });
    setClientKeyword(client.client_name);
    setClientResults([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRepuestoEquipoData({ ...repuestoEquipoData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = loggedIn;
      await createRepuestoEquipo(token, repuestoEquipoData);
      // Puedes redirigir o mostrar un mensaje de éxito aquí
      console.log('Repuesto equipo registrado exitosamente');
      window.alert('Repuesto equipo registrado exitosamente');
      navigate('/equipos-repuestos');
    } catch (error) {
      // Maneja errores, muestra mensajes de error, etc.
      console.error('Error al registrar el repuesto equipo:', error);
    }
  };

  return (
    <div>
      <div className="RegisterRepuestoEquipoForm-box">
        <form onSubmit={handleSubmit} className="REGISTER-REPUESTO-EQUIPO-FORM">
        <div className="box">
              <div className="register-repuesto">
                <div className="overlap-group">
                  <div className="overlap">
                    <div className="register-title">REGISTRAR NUEVO REPUESTO</div>
                  </div>

                  <label htmlFor="id_cliente" className="repuesto-cliente">1. Select the related client:</label>
                    <input 
                      type="text"
                      id="id_cliente"
                      className="cliente-input"
                      value={clientKeyword}
                      onChange={(e) => setClientKeyword(e.target.value)}
                      autoComplete="off"
                      placeholder="Search client..."
                    />
                    {clientResults.length > 0 && (
                      <ul className="client-search-results">
                        {clientResults.map((client) => (
                          <li key={client._id} onClick={() => handleSelectClient(client)} className="client-search-item">
                            {client.client_name}
                          </li>
                        ))}
                      </ul>
                    )}

                  <label htmlFor="repuesto_name" className="repuesto-nombre">2.  Ingrese el nombre del repuesto:</label>
                  <input
                  type="text"
                  id="repuesto_name"
                  name="repuesto_name"
                  value={repuestoEquipoData.repuesto_name}
                  onChange={handleChange}
                  className="nombre-input"
                  />

                  <label className="repuesto-precio">3.  Ingrese el precio del repuesto sin IVA</label>
                  <input className="precio-input" 
                  type="number"
                  id="repuesto_precio"
                  name="repuesto_precio"
                  value={repuestoEquipoData.repuesto_precio}
                  onChange={handleChange}
                  />


                  <div className="registrar-texto-wrapper">
                    <div className="text-wrapper" onClick={handleSubmit}>REGISTRAR</div>
                  </div>
                  <div className="cancelar-texto-wrapper">
                    <div  className="text-wrapper" onClick={() => navigate('/equipos-repuestos')}>CANCELAR</div>
                  </div>
                  <div className="repuesto-separator" />
                </div>
              </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterRepuestoEquipoForm;
