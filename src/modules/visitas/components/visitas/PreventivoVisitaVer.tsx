import React, { useEffect, useState } from 'react';
import { getVisitaById } from '../../services/visitasService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import DateRangeIcon from '@mui/icons-material/DateRange';
import './styles/PreventivoVisitaRegistrar.css'

interface Actividad {
  id_protocolo: {
    _id?: string;
    title?: string;
  };
  ids_campos_preventivo: Array<{
    id_campo?:  {
      _id?: string;
      id_tipo?: string;
      title?: string;
    };
    title?: string;
    resultado?: string;
    tipo?: string;
    minimo?: number;
    maximo?: number;
    unidad?: string;
    medida?: number;
    // Incluye aquí cualquier otra propiedad necesaria de los campos
  }>;
  date_created?: string;
}

interface PreventivoVisitaVerProps {
  actividad: Actividad;
}

const PreventivoVisitaVer: React.FC<PreventivoVisitaVerProps> = ({ actividad }) => {
  


  // Filtrar los campos cualitativos de la actividad preventiva
  const camposCualitativos = actividad.ids_campos_preventivo.filter(campo => campo.tipo === "Cualitativo");
  const camposMantenimiento = actividad.ids_campos_preventivo.filter(campo => campo.tipo === "Mantenimiento");
  const camposCuantitativos = actividad.ids_campos_preventivo.filter(campo => campo.tipo === "Cuantitativo");
  const camposOtros = actividad.ids_campos_preventivo.filter(campo => campo.tipo === "Otros");

  return (
    <div className="PreventivoVisitaRegistrar-container">
        <div className="PreventivoVisitaRegistrar-actividad-preventivo">
            <div className="PreventivoVisitaRegistrar-overlap-wrapper">
                <div className="PreventivoVisitaRegistrar-overlap">
                    <div className="PreventivoVisitaRegistrar-title-text">{actividad.id_protocolo.title || 'N/A'}</div>

                      <div className="PreventivoVisitaRegistrar-cualitativo-section">
                        <div className='PreventivoVisitaRegistrar-overlap-group'>
                            <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                                <div className="PreventivoVisitaRegistrar-text-wrapper">PRUEBAS CUALITATIVAS</div>
                            </div>

                            <div className='PreventivoVisitaRegistrar-overflow-container'>
                                <div className='PreventivoVisitaRegistrar-container-list'>
                                    {camposCualitativos.length > 0 ? (
                                        camposCualitativos.map((campo: any, index: number) => (
                                        <ul key={index} className="PreventivoVisitaRegistrar-div">
                                            <li className="PreventivoVisitaRegistrar-div">
                                                <div className="PreventivoVisitaRegistrar-p">{campo.title || 'NA'}</div>
                                                
                                                <button
                                                    className={`PreventivoVisitaRegistrar-paso-b ${campo.resultado === 'paso' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'paso' */}}
                                                    >
                                                    Pasó
                                                    </button>
                                                    {/* Botón Falló */}
                                                    <button
                                                    className={`PreventivoVisitaRegistrar-fallo-b ${campo.resultado === 'fallo' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'fallo' */}}
                                                    >
                                                    Falló
                                                    </button>
                                                    <button
                                                    className={`PreventivoVisitaRegistrar-na-b ${campo.resultado === 'n/a' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'fallo' */}}
                                                    >
                                                    N/A
                                                    </button>
                                            </li>
                                            
                                        </ul>
                                        ))
                                    ) : (
                                        <p>No se encontraron campos cualitativos en la actividad preventiva.</p>
                                    )}
                            </div>
                          <div className="PreventivoVisitaRegistrar-separator" />
                        </div>
                      </div>
                    </div>

                    <div className="PreventivoVisitaRegistrar-mantenimiento-section">
                        <div className='PreventivoVisitaRegistrar-overlap-group'>
                            <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                                <div className="PreventivoVisitaRegistrar-text-wrapper">PRUEBAS DE MANTENIMIENTO</div>
                            </div>

                            <div className='PreventivoVisitaRegistrar-overflow-container'>
                                <div className='PreventivoVisitaRegistrar-container-list'>
                                    {camposMantenimiento.length > 0 ? (
                                        camposMantenimiento.map((campo: any, index: number) => (
                                        <ul key={index} className="PreventivoVisitaRegistrar-div">
                                            <li className="PreventivoVisitaRegistrar-div">
                                                <div className="PreventivoVisitaRegistrar-p">{campo.title || "N/A"}</div>
                                                
                                                <button
                                                    className={`PreventivoVisitaRegistrar-paso-b ${campo.resultado === 'paso' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'paso' */}}
                                                    >
                                                    Pasó
                                                    </button>
                                                    {/* Botón Falló */}
                                                    <button
                                                    className={`PreventivoVisitaRegistrar-fallo-b ${campo.resultado === 'fallo' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'fallo' */}}
                                                    >
                                                    Falló
                                                    </button>
                                                    <button
                                                    className={`PreventivoVisitaRegistrar-na-b ${campo.resultado === 'n/a' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'fallo' */}}
                                                    >
                                                    N/A
                                                    </button>
                                            </li>
                                            
                                        </ul>
                                        ))
                                    ) : (
                                        <p>No se encontraron campos de mantenimiento tipos de mantenimiento en la actividad preventiva.</p>
                                    )}
                            </div>
                          <div className="PreventivoVisitaRegistrar-separator" />      
                        </div>
                      </div>
                    </div>

                    <div className="PreventivoVisitaRegistrar-cuantitativo-section">
                        <div className='PreventivoVisitaRegistrar-overlap-group'>
                            <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                                <div className="PreventivoVisitaRegistrar-text-wrapper">PRUEBAS CUANTITATIVAS</div>
                            </div>

                            <div className='PreventivoVisitaRegistrar-overflow-container'>
                                <div className='PreventivoVisitaRegistrar-container-list-cuantitativo'>
                                    {camposCuantitativos.length > 0 ? (
                                        camposCuantitativos.map((campo: any, index: number) => (
                                        <ul key={index} className="PreventivoVisitaRegistrar-div-cuantitativo">
                                            <div className="PreventivoVisitaRegistrar-p">{campo.title || 'N/A'}</div>
                                            <div className='PreventivoVisitaRegistrar-cuantitativo-medicion'>{`En ${campo.unidad} rango ( ${campo.minimo} a ${campo.maximo} )`}</div>
                                            <div className='PreventivoVisitaRegistrar-cuantitativo-medicion-input'>Medida ingresada: {campo.medida}</div> 
                                            <li className="PreventivoVisitaRegistrar-div">
                                                
                                                <button
                                                    className={`PreventivoVisitaRegistrar-cuantitativo-paso-b ${campo.resultado === 'paso' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'paso' */}}
                                                    >
                                                    Pasó
                                                    </button>
                                                    {/* Botón Falló */}
                                                    <button
                                                    className={`PreventivoVisitaRegistrar-cuantitativo-fallo-b ${campo.resultado === 'fallo' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'fallo' */}}
                                                    >
                                                    Falló
                                                    </button>
                                            </li>
                                            
                                        </ul>
                                        ))
                                    ) : (
                                        <p>No se encontraron campos cuantitativos en la actividad preventiva.</p>
                                    )}
                            </div>
                             <div className="PreventivoVisitaRegistrar-separator" />
                        </div>
                      </div>
                    </div>

                    <div className="PreventivoVisitaRegistrar-otros-section">
                        <div className='PreventivoVisitaRegistrar-overlap-group'>
                            <div className="PreventivoVisitaRegistrar-cualitativo-titlet-wrapper">
                                <div className="PreventivoVisitaRegistrar-text-wrapper">PRUEBAS DE MANTENIMIENTO</div>
                            </div>

                            <div className='PreventivoVisitaRegistrar-overflow-container'>
                                <div className='PreventivoVisitaRegistrar-container-list'>
                                    {camposOtros.length > 0 ? (
                                        camposOtros.map((campo: any, index: number) => (
                                        <ul key={index} className="PreventivoVisitaRegistrar-div">
                                            <li className="PreventivoVisitaRegistrar-div">
                                                <div className="PreventivoVisitaRegistrar-p">{campo.title || 'N/A'}</div>
                                                
                                                <button
                                                    className={`PreventivoVisitaRegistrar-paso-b ${campo.resultado === 'paso' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'paso' */}}
                                                    >
                                                    Pasó
                                                    </button>
                                                    {/* Botón Falló */}
                                                    <button
                                                    className={`PreventivoVisitaRegistrar-fallo-b ${campo.resultado === 'fallo' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'fallo' */}}
                                                    >
                                                    Falló
                                                    </button>
                                                    <button
                                                    className={`PreventivoVisitaRegistrar-na-b ${campo.resultado === 'n/a' ? 'active' : ''}`}
                                                    onClick={() => {/* función para manejar el cambio a 'fallo' */}}
                                                    >
                                                    N/A
                                                    </button>
                                            </li>
                                            
                                        </ul>
                                        ))
                                    ) : (
                                        <p>No se encontraron campos de otros protocolos en la actividad preventiva.</p>
                                    )}
                            </div>
                          <div className="PreventivoVisitaRegistrar-separator" />      
                        </div>
                      </div>
                    </div>

                </div>
            </div>
        </div>
        <DateRangeIcon className='PreventivoVisitaRegistrar-date-icon'/>
        <p className='PreventivoVisitaRegistrar-date-value'>{actividad.date_created || 'N/A'}</p>
    </div>
  );
};

export default PreventivoVisitaVer;
