import { useContext, useEffect, useState } from 'react';
import { AuthContext }               from '../context/AuthContext';
import { fetchHabits, createHabit, checkInHabit } from '../api/habits';
import HabitForm                     from '../components/HabitForm';

export default function Habits() {
  const { auth }     = useContext(AuthContext);
  const token        = auth.token;
  const [habits, setHabits]    = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchHabits(token)
      .then(res => setHabits(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  function handleAdd(data) {
    createHabit(token, data).then(res =>
      setHabits(prev => [...prev, res.data])
    );
  }

  function handleCheckIn(id) {
    checkInHabit(token, id).then(res =>
      setHabits(prev =>
        prev.map(h => (h._id === id ? res.data : h))
      )
    );
  }

  if (loading) return <p>Loading habits…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div className="page form-page">
      <h1>Your Habits</h1>
      <HabitForm onSubmit={handleAdd} />

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Habit</th>
            <th>Frequency</th>
            <th>Streak</th>
            <th>Check In</th>
          </tr>
        </thead>
        <tbody>
          {habits.map(h => (
            <tr key={h._id}>
              <td>{h.name}</td>
              <td>{h.frequency}</td>
              <td>{h.streak}</td>
              <td>
                <button onClick={() => handleCheckIn(h._id)}>
                  {h.checkIns.some(d =>
                    new Date(d).toDateString() === new Date().toDateString()
                  )
                    ? '✓ Done'
                    : 'Check In'}
                </button>
              </td>
            </tr>
          ))}
          {habits.length === 0 && (
            <tr>
              <td colSpan="4">No habits yet. Add one above!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
