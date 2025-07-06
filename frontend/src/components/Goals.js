import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Goals() {
  const { auth } = useContext(AuthContext);
  const token = auth.token;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/analytics/goals', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setData);
  }, [token]);

  if (!data) return null;

  const taskPct  = Math.round((data.tasksCompleted  / data.taskGoal)  * 100);
  const habitPct = Math.round((data.habitsCheckedIn / data.habitGoal) * 100);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', maxWidth: 400 }}>
      <h2>This Month’s Progress</h2>
      <p>Tasks: {data.tasksCompleted}/{data.taskGoal} ({taskPct}%)</p>
      <p>Habits: {data.habitsCheckedIn}/{data.habitGoal} ({habitPct}%)</p>
    </div>
  );
}
