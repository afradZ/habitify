import React from 'react';

export const Link = ({ to, children }) => <a href={to}>{children}</a>;
export const BrowserRouter = ({ children }) => <>{children}</>;
export const MemoryRouter  = ({ children }) => <>{children}</>;
export const useNavigate   = () => () => {};
export const Navigate      = () => null;
export const Routes        = ({ children }) => <>{children}</>;
export const Route         = () => null;
