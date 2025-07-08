import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../pages/Settings';
import * as api from '../api/settings';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api/settings', () => ({
  __esModule: true,
  getSettings: jest.fn(),
  updateSettings: jest.fn()
}));

// Stub out alert so JSDOM doesn’t crash
window.alert = jest.fn();

describe('Settings loads and saves', () => {
  beforeEach(() => {
    // make sure our AuthProvider sees a token
    localStorage.setItem('token', 'fake-token');

    api.getSettings.mockResolvedValue({ data: {
      taskReminderTime: '07:30',
      habitReminderTime: '08:45',
      monthlyTaskGoal:  10,
      monthlyHabitGoal: 7
    }});
    api.updateSettings.mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('loads and displays settings and saves updated values', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Settings />
        </AuthProvider>
      </MemoryRouter>
    );

    // … your existing assertions about form fields …

    // submit with changed values
    fireEvent.change(screen.getByLabelText(/monthly task goal/i), {
      target: { value: '12' }
    });
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    // now our stubbed alert won’t throw, and updateSettings(token, …) should have been called:
    await waitFor(() => {
      expect(api.updateSettings).toHaveBeenCalledWith(
        'fake-token',
        expect.objectContaining({ monthlyTaskGoal: 12 })
      );
      expect(window.alert).toHaveBeenCalledWith('Settings saved');
    });
  });
});
