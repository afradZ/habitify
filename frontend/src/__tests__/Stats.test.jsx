import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Stats from '../pages/Stats';
import { AuthProvider }  from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

// mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
});

function setupMocks() {
  // 1st call: tasks?range=7
  fetch
    .mockResolvedValueOnce({
      json: () => Promise.resolve([{ _id: '2025-07-01', count: 2 }])
    })
    // 2nd call: habits?range=7
    .mockResolvedValueOnce({
      json: () => Promise.resolve([{ _id: '2025-07-01', count: 1 }])
    })
    // 3rd call: analytics/goals
    .mockResolvedValueOnce({
      json: () => Promise.resolve({
        tasksCompleted:   2,
        taskGoal:         5,
        habitsCheckedIn:  1,
        habitGoal:        7
      })
    });
}

const wrapper = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </ThemeProvider>
);

test('loads and displays analytics, then refetches on range change', async () => {
  // put a token in localStorage for AuthProvider
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('user', JSON.stringify({ id: 'u1', name: 'Tester' }));

  setupMocks();

  render(<Stats />, { wrapper });

  // initial loading state
  expect(screen.getByText(/Loading analytics…/i)).toBeInTheDocument();

  // wait for all three initial fetches (tasks, habits, goals)
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  // after load, range selector should show up
  const select = screen.getByLabelText(/Show last/i);
  expect(select.value).toBe('7');

  // verify Goals summary rendered
  expect(screen.getByText(/This Month’s Progress/i)).toBeInTheDocument();
  expect(screen.getByText(/Tasks: 2\/5/i)).toBeInTheDocument();
  expect(screen.getByText(/Habits: 1\/7/i)).toBeInTheDocument();

  // now change to 30 days
  // prepare two new mocks for tasks?range=30 and habits?range=30
  fetch
    .mockResolvedValueOnce({
      json: () => Promise.resolve([{ _id: '2025-06-30', count: 3 }])
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve([{ _id: '2025-06-30', count: 2 }])
    });

  fireEvent.change(select, { target: { value: '30' } });
  expect(select.value).toBe('30');

  // wait for the two new fetch calls
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(5);
    // the last two calls should include ?range=30
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('analytics/tasks?range=30'),
      expect.any(Object)
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('analytics/habits?range=30'),
      expect.any(Object)
    );
  });
});
