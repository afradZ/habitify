import { useState, useEffect, useMemo } from 'react';

const DEFAULT_FORM = {
  title: '',
  description: '',
  dueDate: '',
  recurrence: 'none'
};

export default function TaskForm({
  initial,      // may be undefined or a task object
  onSubmit,
  submitLabel
}) {
  // Pick either the passed-in initial or our static default
  const initialForm = useMemo(
    () => initial ?? DEFAULT_FORM,
    [initial]
  );

  // Only initialize from initialForm once, then update when it actually changes
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
    if (submitLabel === 'Add Task') {
      setForm(DEFAULT_FORM);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
        required
        style={{ marginRight: '.5rem' }}
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        style={{ marginRight: '.5rem' }}
      />
      <input
        name="dueDate"
        type="date"
        value={form.dueDate ? form.dueDate.slice(0, 10) : ''}
        onChange={handleChange}
        style={{ marginRight: '.5rem' }}
      />
      <select
        name="recurrence"
        value={form.recurrence}
        onChange={handleChange}
        style={{ marginRight: '.5rem' }}
      >
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
