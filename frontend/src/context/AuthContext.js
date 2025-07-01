// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(() => {
    const token = localStorage.getItem('token');
    const user  = JSON.parse(localStorage.getItem('user'));
    return token && user ? { token, user } : { token: null, user: null };
  });

  const setAuth = ({ token, user }) => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setAuthState({ token, user });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

