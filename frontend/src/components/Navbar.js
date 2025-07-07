import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear auth (also removes from localStorage)
    setAuth({ token: null, user: null });
    // redirect to landing page
    navigate('/', { replace: true });
  };

  return (
    <nav className="app-nav">
      <Link to="/tasks">Tasks</Link>
      <Link to="/habits">Habits</Link>
      <Link to="/stats">Stats</Link>
      <Link to="/settings">Settings</Link>

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
