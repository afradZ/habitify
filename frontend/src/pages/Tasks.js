import { useContext, useEffect, useState } from 'react';
import { AuthContext }     from '../context/AuthContext';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '../api/tasks';
import TaskForm from '../components/TaskForm';

export default function Tasks() {
  const { auth } = useContext(AuthContext);
  const token    = auth.token;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [editing, setEditing] = useState(null);

  // load tasks on mount
  useEffect(() => {
    setLoading(true);
    fetchTasks(token)
      .then(res => setTasks(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  function handleAdd(data) {
    createTask(token, data).then(res =>
      setTasks(prev => [...prev, res.data])
    );
  }

  function handleUpdate(data) {
    updateTask(token, editing._id, data).then(res => {
      setTasks(prev =>
        prev.map(t => (t._id === editing._id ? res.data : t))
      );
      setEditing(null);
    });
  }

  function handleDelete(id) {
    deleteTask(token, id).then(() =>
      setTasks(prev => prev.filter(t => t._id !== id))
    );
  }
  function handleToggle(task) {
  updateTask(token, task._id, { completed: !task.completed })
    .then(res => {
      setTasks(prev =>
        prev.map(t => (t._id === task._id ? res.data : t))
      );
    })
    .catch(err => {
      console.error('Toggle error', err);
      alert(err.response?.data?.msg || 'Could not toggle task');
    });
}

  if (loading) return <p>Loading tasks…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Your Tasks</h1>

      {/* Create or Edit form */}
      <TaskForm
        initial={editing || undefined}
        onSubmit={editing ? handleUpdate : handleAdd}
        submitLabel={editing ? 'Save Changes' : 'Add Task'}
      />

      {/* Task list */}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Done</th>
            <th>Title</th>
            <th>Due</th>
            <th>Recurrence</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>handleToggle(task)
                  }
                />
              </td>
              <td style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </td>
              <td>{new Date(task.dueDate).toLocaleDateString()}</td>
              <td>{task.recurrence}</td>
              <td>
                <button onClick={() => setEditing(task)}>Edit</button>{' '}
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="5">No tasks yet. Add one above!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
