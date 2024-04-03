import React, { useState } from 'react';
import { getPresignedUrl, updateVisita } from '../../services/visitasService';
import { useSessionStorage } from '../../../ordenes/hooks/useSessionStorage';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import './styles/TecnicoEnSede.css';
import { CircularProgress } from '@mui/material';

interface RegisterTecnicoEnSedeProps {
  idVisita: string;
  onActividadRegistrada: () => void;
}

const RegisterTecnicoEnSede: React.FC<RegisterTecnicoEnSedeProps> = ({ idVisita, onActividadRegistrada }) => {
  const token = useSessionStorage('sessionJWTToken');
  const [idProtocolo, setIdProtocolo] = useState('');
  const [observacion, setObservacion] = useState('');
  const [idImage, setIdImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && token) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);

      try {
        setIsLoading(true);
        const response = await getPresignedUrl(token, file.name);
        const presignedUrl = response.presignedUrl;

        await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type, // Ajuste según el tipo de archivo
          },
          body: file,
        });

        const uploadedImageUrl = presignedUrl.split('?')[0];
        setIdImage(uploadedImageUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        setIsLoading(false);
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdProtocolo(e.target.value);
    setIsLoading(true); // Inicia la carga

    // Simula un proceso de carga antes de mostrar el contenido
    setTimeout(() => {
      setIsLoading(false); // Finaliza la carga
    }, 1000); // Ajusta el tiempo según sea necesario
  };


  const validateForm = () => {
    const missingFields = [];
    if (!idProtocolo) missingFields.push("Actividad");
    if (!observacion) missingFields.push("Observación");
    if (!idImage) missingFields.push("Imagen Capturada");

    if (missingFields.length > 0) {
      alert(`Por favor, complete los siguientes campos: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDateCreated = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const nuevaActividad = {
      actividades: [{
        id_protocolo: idProtocolo,
        id_image: idImage,
        observacion: observacion,
        date_created: formattedDateCreated,
      }]
    };

    try {
      if (token && idVisita) {
        await updateVisita(token, idVisita, nuevaActividad);
        alert('Actividad agregada a la visita con éxito.');
        onActividadRegistrada();
      } else {
        alert('No se encontró token de sesión.');
      }
    } catch (error) {
      console.error('Error al actualizar la visita:', error);
      alert('Error al actualizar la visita.');
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="TecnicoEnSede-box">
        <form  onSubmit={handleSubmit}>
        <div className="TecnicoEnSede-visita-actividad">
          <div className="TecnicoEnSede-actividad-group">
                <div className="TecnicoEnSede-overlap-group">
                  <div className="TecnicoEnSede-actividad-title">ACTIVIDAD A EJECUTAR</div>
                  <select
                      className="TecnicoEnSede-actividad-select"
                      value={idProtocolo}
                      onChange={handleSelectChange}
                  >
                      <option value="" disabled selected>Seleccione una actividad</option>
                      <option value="65a93dd789a02ef211e75ecd">Técnico en sede</option>
                      {/* Añade más opciones según sea necesario */}
                  </select>
                </div>
          </div>
        </div>
  
          {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <CircularProgress className='TecnicoEnSede-loading-icon'/> {/* Indicador de carga */}
          </div>
        ) : (
          idProtocolo === '65a93dd789a02ef211e75ecd' && (
              <div className="TecnicoEnSede-tecnico-en-sede">
              <div className="TecnicoEnSede-en-sede-group">
                <div className="TecnicoEnSede-overlap-group2">
                  <div className="TecnicoEnSede-tecsede-title">TÉCNICO EN SEDE</div>
                </div>
                <label htmlFor="observacion" className="TecnicoEnSede-observacion-t">Observación: *</label>
                  <textarea
                      id="observacion"
                      className="TecnicoEnSede-observacion-text"
                      value={observacion}
                      onChange={(e) => setObservacion(e.target.value)}
                      placeholder="Escribe tu observación aquí..."
                  />
                {/* Botón para activar la captura de la imagen */}
                <label htmlFor="capture" className="TecnicoEnSede-image-input-label">
                          <AddAPhotoIcon className="TecnicoEnSede-image-input" />
                      </label>
                      {/* Input para capturar la imagen */}
                      <input
                          id="capture"
                          type="file"
                          accept="image/*"
                          capture="environment" // Usa 'environment' para preferir la cámara trasera
                          onChange={handleCapture}
                          style={{ display: 'none' }} // Oculta el input real
                      />
                      {/* Muestra la imagen capturada */}
                      {capturedImage && 
                                          
                      <img src={capturedImage} alt="Captura" style={{ width: '100px', height: '100px', top: '227px', left: '174px' , position: 'absolute' }} />}
  
                <button type='submit' className="TecnicoEnSede-crear-actividad">CREAR ACTIVIDAD</button>
              </div>
            </div>
          )
        )}
      </form>

    </div>
  );

}


export default RegisterTecnicoEnSede;
