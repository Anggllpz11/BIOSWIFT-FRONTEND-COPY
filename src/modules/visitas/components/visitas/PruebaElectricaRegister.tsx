import React, { useEffect, useState } from 'react';
import { getVisitaById, updateVisita } from '../../services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { CircularProgress } from '@mui/material';
import './styles/PruebaElectricaRegister.css'; // Ajusta la ruta a los estilos de este componente

interface PruebaElectricaRegisterProps {
  idVisita: string;
  onActividadesUpdated: () => void;
}
interface PruebaElectrica {
    title: string;
    medida: number | '';
    minimo: number;
    maximo: number;
    unidad?: string;
    resultado?: string;
  }
  
const PruebaElectricaRegister: React.FC<PruebaElectricaRegisterProps> = ({ idVisita, onActividadesUpdated }) => {
  const token = useSessionStorage('sessionJWTToken');
  const [title, setTitle] = useState('');
  const [medida, setMedida] = useState<number | ''>('');
  const [minimo, setMinimo] = useState<number | ''>('');
  const [maximo, setMaximo] = useState<number | ''>('');
  const [unidad, setUnidad] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitaActual, setVisitaActual] = useState<any>(null);
  const [pruebasElectricas, setPruebasElectricas] = useState<PruebaElectrica[]>([
    {
      title: 'Voltaje de linea',
      medida: '',
      minimo: 110,
      maximo: 120,
      unidad: 'V',
      resultado: '',
    },
    {
      title: 'Resistencia de alistamiento L1-L2 Case',
      medida: '',
      minimo: 0,
      maximo: 2,
      unidad: 'MΩ',
      resultado: '',
    },
    {
        title: 'Fuga corriente a tierra (polo normal)',
        medida: '',
        minimo: 0,
        maximo: 500,
        unidad: 'μA',
        resultado: '',
    },
    {
        title: 'Fuga de corriente Tierra (L2 Open)',
        medida: '',
        minimo: 0,
        maximo: 1000,
        unidad: 'μA',
        resultado: '',
    },
    {
        title: 'Fuga de corriente Tierra (Pol Inv)',
        medida: '',
        minimo: 0,
        maximo: 500,
        unidad: 'μA',
        resultado: '',
    },
    {
        title: 'Fuga de corriente chasis (Pol Inv - L2 open)',
        medida: '',
        minimo: 0,
        maximo: 1000,
        unidad: 'μA',
        resultado: '',
    },
    {
        title: 'Fuga de corriente chasis (Pol Normal)',
        medida: '',
        minimo: 0,
        maximo: 100,
        unidad: 'μA',
        resultado: '',
    },
    {
        title: 'Fuga de corriente chasis (L2 open)',
        medida: '',
        minimo: 0,
        maximo: 500,
        unidad: 'μA',
        resultado: '',
    },

  ]);

  const handleMedidaChange = (index: number, medida: number) => {
    const newPruebasElectricas = [...pruebasElectricas];
    newPruebasElectricas[index].medida = medida;
    newPruebasElectricas[index].resultado = medida >= newPruebasElectricas[index].minimo && medida <= newPruebasElectricas[index].maximo ? 'Pasó' : 'Falló';
    setPruebasElectricas(newPruebasElectricas);
  };


  const calculateResultado = (): string => {
    if (medida === '' || minimo === '' || maximo === '') {
      return '';
    }
    const medidaNum = Number(medida);
    const minimoNum = Number(minimo);
    const maximoNum = Number(maximo);
    return medidaNum >= minimoNum && medidaNum <= maximoNum ? 'Pasó' : 'Falló';
  };

  useEffect(() => {
    // Función para cargar la visita actual
    const cargarVisita = async () => {
      const visita = await getVisitaById(token, idVisita);
      setVisitaActual(visita);
    };

    cargarVisita();
  }, [token, idVisita]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const todasLasMedidasCompletadas = pruebasElectricas.every(prueba => prueba.medida !== '');

    if (!todasLasMedidasCompletadas) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const now = new Date();
    const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const nuevaActividad = {
      id_protocolo: '65a93e0689a02ef211e75ed7', // Protocolo de prueba eléctrica
      prueba_electrica: pruebasElectricas.map(prueba => ({
        title: prueba.title,
        medida: Number(prueba.medida), // Convertir a número por si acaso
        minimo: prueba.minimo,
        maximo: prueba.maximo,
        unidad: prueba.unidad,
        resultado: prueba.resultado,
      })),
      date_created: formattedDateCreated,
    };

    const datosActualizados = {
      ...visitaActual,
      actividades: [...visitaActual.actividades, nuevaActividad],
    };

    try {
      if (token && idVisita) {
        setIsLoading(true);
        await updateVisita(token, idVisita, datosActualizados);
        alert('Prueba eléctrica registrada con éxito.');
        onActividadesUpdated(); 
      } else {
        alert('No se encontró token de sesión.');
      }
    } catch (error) {
      console.error('Error al registrar la prueba eléctrica:', error);
      alert('Error al registrar la prueba eléctrica.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="PruebaElectricaRegister-box">
      <form onSubmit={handleSubmit}>
        <div className="PruebaElectricaRegister-actividad-prueba">
              <div className="PruebaElectricaRegister-div">
                  <div className="PruebaElectricaRegister-prueba-electrica-t">PRUEBA DE SEGURIDAD ELECTRICA</div>
                    <div className="PruebaElectricaRegister-form-container">
                        <div className="PruebaElectricaRegister-title-section">
                            <div className="PruebaElectricaRegister-form-t-wrapper">
                                <div className="PruebaElectricaRegister-form-t">PRUEBAS CUALITATIVAS</div>
                            </div>
                        </div>
                        <div className='PruebaElectricaRegister-container-list'>
                            {pruebasElectricas.map((prueba, index) => (
                                <ul key={index} className='PruebaElectricaRegister-ul'>
                                    <li className="PruebaElectricaRegister-section">
                                        <div className="PruebaElectricaRegister-campo-title">{prueba.title} *</div>
                                        <input
                                            type="number"
                                            className="PruebaElectricaRegister-input"
                                            value={prueba.medida}
                                            onChange={(e) => handleMedidaChange(index, Number(e.target.value))}
                                        />
                                        <p className="PruebaElectricaRegister-range">En {prueba.unidad} Rango ( {prueba.minimo} a {prueba.maximo} ) </p>
                                        <button className="PruebaElectricaRegister-paso" style={{ backgroundColor: prueba.resultado === 'Pasó' ? '#00ff47' : '#ffffff' }} disabled >Pasó</button>
                                        <button className="PruebaElectricaRegister-fallo" style={{ backgroundColor: prueba.resultado === 'Falló' ? '#ff0000' : '#ffffff' }} disabled >Falló</button>
                                    </li>
                                </ul>
                                
                            ))}
                        </div>
                    </div>

                    <div className="PruebaElectricaRegister-line"/>
                <button className="PruebaElectricaRegister-button">
                    CREAR ACTIVIDAD
                </button>
                </div>
            </div>
      </form>
    </div>
  );
};

export default PruebaElectricaRegister;
