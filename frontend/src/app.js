import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register     from './pages/register';
import Login        from './pages/login';
import Tasks        from './pages/Tasks';
import Habits       from './pages/Habits';
import PrivateRoute from './components/PrivateRoute';
import Stats        from './pages/Stats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />

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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


