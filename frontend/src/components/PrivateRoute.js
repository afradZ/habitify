import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { auth } = useContext(AuthContext);
  if (!auth.token) {
    // not logged in - redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
}
