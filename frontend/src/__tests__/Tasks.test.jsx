import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tasks from '../pages/Tasks';
import { AuthProvider } from '../context/AuthContext';
import * as api from '../api/tasks';
import { MemoryRouter } from 'react-router-dom';

// mock the entire tasks API module
jest.mock('../api/tasks');

describe('Tasks Page', () => {
  const fakeToken = 'fake-token';
  const wrapper = ({ children }) => (
    <MemoryRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </MemoryRouter>
  );

  beforeEach(() => {
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify({ id: 'user1', name: 'Tester' }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('fetches and displays tasks on load', async () => {
    api.fetchTasks.mockResolvedValue({
      data: [
        { _id: '1', title: 'First', dueDate: '2025-07-15', recurrence: 'none', completed: false },
        { _id: '2', title: 'Second', dueDate: '2025-07-16', recurrence: 'daily', completed: true }
      ]
    });

    render(<Tasks />, { wrapper });

    // loading indicator shows...
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();

    // ...then we wait for fetched items to appear
    await waitFor(() => {
      expect(api.fetchTasks).toHaveBeenCalledWith(fakeToken);
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  it('adds a new task via the form', async () => {
    api.fetchTasks.mockResolvedValue({ data: [] });
    api.createTask.mockResolvedValue({
      data: { _id: 'new1', title: 'New Task', dueDate: '2025-07-20', recurrence: 'none', completed: false }
    });

    render(<Tasks />, { wrapper });

    // wait for form to be ready (avoids act() warnings)
    await screen.findByPlaceholderText(/title/i);

    // fill out form fields
    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'New Task' }
    });
    fireEvent.change(screen.getByPlaceholderText(/due date/i), {
      target: { value: '2025-07-20' }
    });
    // grab the <select> by role instead of a placeholder
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'none' }
    });

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    // assert createTask was called and UI updated
    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith(
        fakeToken,
        expect.objectContaining({
          title: 'New Task',
          description: '',
          recurrence: 'none',
          dueDate: expect.stringMatching(/2025-07-20T00:00:00/),
        })        
      );
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  it('toggles completion on checkbox click', async () => {
    api.fetchTasks.mockResolvedValue({
      data: [{ _id: 't1', title: 'Toggle me', dueDate: '2025-07-21', recurrence: 'none', completed: false }]
    });
    api.updateTask.mockImplementation((token, id, data) =>
      Promise.resolve({ data: { ...data, _id: id, title: 'Toggle me', dueDate: '2025-07-21', recurrence: 'none' } })
    );

    render(<Tasks />, { wrapper });

    // wait for the task to show up
    await screen.findByText('Toggle me');

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith(fakeToken, 't1', { completed: true });
      expect(screen.getByText('Toggle me')).toHaveStyle('text-decoration: line-through');
    });
  });

  it('deletes a task when Delete button is clicked', async () => {
    api.fetchTasks.mockResolvedValue({
      data: [{ _id: 'd1', title: 'Delete me', dueDate: '2025-07-22', recurrence: 'none', completed: false }]
    });
    api.deleteTask.mockResolvedValue({});

    render(<Tasks />, { wrapper });

    await screen.findByText('Delete me');

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith(fakeToken, 'd1');
      expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
    });
  });
});
