import React, { useState } from 'react';
import { getPresignedUrl, getVisitaById, updateVisita } from '../../services/visitasService';
import { useSessionStorage } from '../../../ordenes/hooks/useSessionStorage';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import './styles/ImagenActividadRegistrar.css'; // Asegúrate de que la ruta sea correcta
import { CircularProgress } from '@mui/material';

interface ImagenActividadRegistrarProps {
  idVisita: string;
  onActividadesUpdated: () => void;
}

const ImagenActividadRegistrar: React.FC<ImagenActividadRegistrarProps> = ({ idVisita, onActividadesUpdated }) => {
  const token = useSessionStorage('sessionJWTToken');
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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!observacion || !idImage) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    setIsLoading(true);

    try {
      const visitaActual = await getVisitaById(token, idVisita);
      const formattedDateCreated = new Date().toISOString().replace('T', ' ').slice(0, 19);

      const nuevaActividad = {
        id_protocolo: '65a93dcf89a02ef211e75ecb',
        observacion: observacion,
        id_image: idImage,
        date_created: formattedDateCreated,
      };

      const actividadesActualizadas = [...visitaActual.actividades, nuevaActividad];

      const datosActualizados = {
        ...visitaActual,
        actividades: actividadesActualizadas
      };

      await updateVisita(token, idVisita, datosActualizados);
      alert('Actividad agregada a la visita con éxito.');
      onActividadesUpdated();
    } catch (error) {
      console.error('Error al actualizar la visita:', error);
      alert('Error al actualizar la visita.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ImagenActividadRegistrar-box">
      <form onSubmit={handleSubmit} className="ImagenActividadRegistrar-form">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <CircularProgress className='TecnicoEnSede-loading-icon'/> {/* Indicador de carga */}
          </div>
        ) : (
          <div className="ImagenActividadRegistrar-captura">
            <div className="ImagenActividadRegistrar-captura-group"></div>
                <div className="ImagenActividadRegistrar-overlap-group2">
                    <div className="ImagenActividadRegistrar-captura-title">TOMA DE IMAGEN</div>
                </div>
                <label htmlFor="observacion" className="ImagenActividadRegistrar-observacion-t">Observación: *</label>
                    <textarea
                    id="observacion"
                    className="ImagenActividadRegistrar-observacion-text"
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Escribe tu observación aquí..."
                    ></textarea>

            {/* Botón para activar la captura de la imagen */}
            <label htmlFor="capture" className="ImagenActividadRegistrar-image-input-label">
              <AddAPhotoIcon className="ImagenActividadRegistrar-image-input" />
            </label>

            {/* Input para capturar la imagen */}
            <input
              id="capture"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              style={{ display: 'none' }}
            />
            {capturedImage && 
            <img src={capturedImage} alt="Captura" style={{ width: '100px', height: '100px', top: '227px', left: '174px' , position: 'absolute' }}/>}
            
            <button type="submit" className="ImagenActividadRegistrar-crear-actividad">CREAR ACTIVIDAD</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ImagenActividadRegistrar;
