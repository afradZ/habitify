import React from 'react';
import { createRoot } from 'react-dom/client';       
import App from './App';
import { AuthProvider }   from './context/AuthContext';
import { ThemeProvider }  from './context/ThemeContext';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container);                   // create a root

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);


