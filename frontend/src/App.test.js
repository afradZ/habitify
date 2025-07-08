import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

describe('App', () => {
  it('renders the main navigation links', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // adjust these to whatever your Navbar actually shows:
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });
});
