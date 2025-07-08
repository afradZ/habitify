import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  it('calls onSubmit with form data', () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'New Task' }
    });
    fireEvent.change(screen.getByPlaceholderText(/due date/i), {
      target: { value: '2025-07-10' }
    });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Task', dueDate: expect.any(String) })
    );
  });
});
