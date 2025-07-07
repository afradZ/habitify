import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';

import Register     from './pages/register';
import Login        from './pages/login';
import Tasks        from './pages/Tasks';
import Habits       from './pages/Habits';
import Stats        from './pages/Stats';
import Settings     from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import Landing      from './pages/Landing';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      {/* Main Routes */}

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login    />} />

        {/* Protected */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <PrivateRoute>
              <Habits />
            </PrivateRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <PrivateRoute>
              <Stats />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




