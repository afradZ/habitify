import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import * as authApi from '../api/auth';

jest.mock('../api/auth');

// Mock only the useNavigate hook; keep all other react-router-dom exports as-is
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

describe('Login Page', () => {
  it('renders form and submits credentials', async () => {
    authApi.login.mockResolvedValue({
      data: { token: 'tok', user: { name: 'Alice', email: 'a@b.com' } }
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // fill in and submit
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'a@b.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret' }
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'secret'
      })
    );
  });
});
