import React from 'react';

interface Sede {
  _id: string;
  sede_nombre: string;
  // Agrega otros campos si son necesarios
}

interface SearchResultsProps {
  sedes: Sede[]; // Asume que `sedes` es un array de objetos de tipo Sede
}

const SearchSedesResults: React.FC<SearchResultsProps> = ({ sedes }) => {
  return (
    <div>
      <h2>Resultados de la búsqueda de Sedes:</h2>
      {sedes.length === 0 ? (
        <p>No se encontraron resultados de búsqueda.</p>
      ) : (
        <ul>
          {sedes.map((sede) => (
            <li key={sede._id}>{sede.sede_nombre}</li>
            // Renderiza otros campos si son necesarios
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchSedesResults;
