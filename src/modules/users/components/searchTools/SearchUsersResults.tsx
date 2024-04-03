import React from 'react';

interface User {
  _id: string;
  username: string;
  // Agrega otros campos si son necesarios
}

interface SearchResultsProps {
  users: User[]; // Asume que `users` es un array de objetos de tipo User
}

const SearchUsersResults: React.FC<SearchResultsProps> = ({ users }) => {
  return (
    <div>
      <h2>Resultados de la búsqueda:</h2>
      {users.length === 0 ? (
        <p>No se encontraron resultados de búsqueda.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.username}</li>
            // Renderiza otros campos si son necesarios
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsersResults;
