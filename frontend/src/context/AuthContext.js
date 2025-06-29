import React, { createContext, useState } from 'react';

// Create the context object
export const AuthContext = createContext(null);

// Provider component
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    user: null
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
