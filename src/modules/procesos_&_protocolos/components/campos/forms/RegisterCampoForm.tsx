import React, { useState, FormEvent } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { createCampos } from '../../../services/camposService';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterCampoForm.css'

const RegisterCampoForm: React.FC = () => {
  const [campoData, setCampoData] = useState({
    id_tipo: '',
    title: '',
  });

  const loggedIn = useSessionStorage('sessionJWTToken');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCampoData({ ...campoData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = loggedIn;
      await createCampos(token, campoData);
      window.alert('Campo registrado exitosamente');
      navigate('/campos');
    } catch (error) {
      console.error('Error al registrar el campo:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
           <div className="RegisterCampoForm-box">
              <div className="RegisterCampoForm-register-campo">
                <div className="RegisterCampoForm-overlap-group">
                  <div className="RegisterCampoForm-overlap">
                    <div className="RegisterCampoForm-campo-title">REGISTRAR NUEVO CAMPO</div>
                  </div>
                  <p className="RegisterCampoForm-tipo-p">Seleccione el tipo de campo:</p>
                  <select
                    className="RegisterCampoForm-tipo-input"
                    name="id_tipo"
                    value={campoData.id_tipo}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione el tipo</option>
                    <option value="Pasó ó Falló">Pasó ó Falló</option>
                    <option value="Cuantitativo">Cuantitativo</option>
                  </select>
                  <p className="RegisterCampoForm-title-p">Ingrese el titulo del campo:</p>
                  <input
                  className="RegisterCampoForm-title-input"
                  type="text"
                  name="title"
                  value={campoData.title}
                  onChange={handleChange}
                  placeholder="Título del Campo"
                  />
                  <button className="RegisterCampoForm-cancelar" onClick={() => navigate('/campos')}>CANCELAR</button> 
                  <button className="RegisterCampoForm-registrar" type='submit'>REGISTRAR</button> 
                </div>
              </div>
            </div>
      </form>
    </div>
  );
};

export default RegisterCampoForm;
