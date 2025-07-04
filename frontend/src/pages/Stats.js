import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Line }        from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function makeSeries(arr, days) {
  const labels = [];
  const counts = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    labels.push(day);
    const entry = arr.find(e => e._id === day);
    counts.push(entry ? entry.count : 0);
  }
  return { labels, counts };
}

export default function Stats() {
  const { auth } = useContext(AuthContext);
  const token    = auth.token;

  // ← NEW: range state (7 or 30 days)
  const [rangeDays, setRangeDays] = useState(7);

  const [taskData, setTaskData]   = useState({ labels: [], counts: [] });
  const [habitData, setHabitData] = useState({ labels: [], counts: [] });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  async function fetchAnalytics() {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [tRes, hRes] = await Promise.all([
        fetch(`http://localhost:5000/api/analytics/tasks?range=${rangeDays}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5000/api/analytics/habits?range=${rangeDays}`, { headers }).then(r => r.json())
      ]);
      setTaskData(makeSeries(tRes, rangeDays));
      setHabitData(makeSeries(hRes, rangeDays));
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }

  // ← REFRESH on mount & whenever token or rangeDays changes
  useEffect(() => {
    fetchAnalytics();
  }, [token, rangeDays]);

  if (loading) return <p>Loading analytics…</p>;
  if (error)   return <p>{error}</p>;

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Statistics</h1>

      {/* ← NEW: toggle dropdown */}
      <label style={{ marginBottom: '1rem', display: 'block' }}>
        Show last{' '}
        <select
          value={rangeDays}
          onChange={e => setRangeDays(+e.target.value)}
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
        </select>
      </label>

      <div style={{ maxWidth: 700, margin: '2rem auto' }}>
        <Line
          data={{
            labels: taskData.labels,
            datasets: [
              {
                label: 'Tasks Completed',
                data: taskData.counts,
                fill: false,
                tension: 0.3
              }
            ]
          }}
          options={{
            ...commonOptions,
            title: { display: true, text: `Tasks (Last ${rangeDays} Days)` }
          }}
        />
      </div>

      <div style={{ maxWidth: 700, margin: '2rem auto' }}>
        <Line
          data={{
            labels: habitData.labels,
            datasets: [
              {
                label: 'Habit Check-ins',
                data: habitData.counts,
                fill: false,
                tension: 0.3
              }
            ]
          }}
          options={{
            ...commonOptions,
            title: { display: true, text: `Habits (Last ${rangeDays} Days)` }
          }}
        />
      </div>
    </div>
  );
}
