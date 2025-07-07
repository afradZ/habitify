import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext  } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { auth, setAuth } = useContext(AuthContext);
  const { theme, toggle } = useContext(ThemeContext);
  const navigate          = useNavigate();

  const handleLogout = () => {
    setAuth({ token: null, user: null });
    navigate('/', { replace: true });
  };

  return (
    <nav className="app-nav">
      <Link to="/tasks">Tasks</Link>
      <Link to="/habits">Habits</Link>
      <Link to="/stats">Stats</Link>
      <Link to="/settings">Settings</Link>

      {/* Theme toggle first, takes auto‐margin */}
      <button
        onClick={toggle}
        className="nav-theme-toggle"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Logout sits immediately to the right of the toggle */}
      {auth.token && (
        <button 
          onClick={handleLogout} 
          className="nav-logout"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
