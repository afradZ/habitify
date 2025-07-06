import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

import Register     from './pages/register';
import Login        from './pages/login';
import Tasks        from './pages/Tasks';
import Habits       from './pages/Habits';
import Stats        from './pages/Stats';
import Settings     from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      {/* ← Add your nav bar here */}
      <nav style={{
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        marginBottom: '1rem'
      }}>
        <Link to="/tasks"  style={{ marginRight: '1rem' }}>Tasks</Link>
        <Link to="/habits" style={{ marginRight: '1rem' }}>Habits</Link>
        <Link to="/stats"  style={{ marginRight: '1rem' }}>Stats</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <Routes>
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

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



