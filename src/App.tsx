import React, { useEffect } from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';

// React Router DOM Imports

import { BrowserRouter as Router} from 'react-router-dom';
import { AppRoutes } from './routes/Routes';






function App() {
  return (
    <div>
        
      <div className="App-container">
      <div className="App-blob-c">
            <div className="App-shape-blob"></div>
            <div className="App-shape-blob one"></div>
            <div className="App-shape-blob two"></div>
            <div className="App-shape-blob three"></div>
            <div className="App-shape-blob four"></div>
            <div className="App-shape-blob five"></div>
            <div className="App-shape-blob six"></div>
          </div>
          <Router>
            <AppRoutes />
            
          </Router>

      </div>
          
     </div>
    
  );
}

export default App;
