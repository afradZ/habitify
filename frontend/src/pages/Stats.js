// src/pages/Stats.js
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext }  from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Line }         from 'react-chartjs-2';
import Goals            from '../components/Goals';
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
  const { auth }    = useContext(AuthContext);
  const { theme }   = useContext(ThemeContext);
  const token       = auth.token;

  const [rangeDays, setRangeDays] = useState(7);
  const [taskData,  setTaskData]  = useState({ labels: [], counts: [] });
  const [habitData, setHabitData] = useState({ labels: [], counts: [] });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Dark-mode colors
  const rootStyles   = getComputedStyle(document.documentElement);
  const textColor    = rootStyles.getPropertyValue('--color-text').trim();
  const primaryColor = rootStyles.getPropertyValue('--color-primary').trim();
  const gridColor    = theme === 'dark'
    ? 'rgba(255, 255, 255, 0.44)'
    : 'rgba(0,0,0,0.1)';

  // wrap in useCallback so it can be a dependency
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [tRes, hRes] = await Promise.all([
        fetch(`/api/analytics/tasks?range=${rangeDays}`, { headers }).then(r => r.json()),
        fetch(`/api/analytics/habits?range=${rangeDays}`, { headers }).then(r => r.json())
      ]);
      setTaskData(makeSeries(tRes, rangeDays));
      setHabitData(makeSeries(hRes, rangeDays));
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [token, rangeDays]);

  // fetch analytics on mount and when rangeDays changes
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <p>Loading analytics…</p>;
  if (error)   return <p>{error}</p>;

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor }
      }
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid:  { color: gridColor }
      },
      y: {
        ticks: { color: textColor },
        grid:  { color: gridColor }
      }
    }
  };

  return (
    <div className="page">
      <h1 style={{ color: textColor }}>Statistics</h1>

      {/* This Month’s Progress */}
      <Goals />

      {/* range selector */}
      <label style={{ marginBottom: '1rem', display: 'block', color: textColor }}>
        Show last{' '}
        <select
          value={rangeDays}
          onChange={e => setRangeDays(+e.target.value)}
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
        </select>
      </label>

      {/* Tasks Completed Chart */}
      <div style={{ maxWidth: 700, margin: '2rem auto' }}>
        <Line
          data={{
            labels: taskData.labels,
            datasets: [{
              label:           'Tasks Completed',
              data:            taskData.counts,
              borderColor:     primaryColor,
              backgroundColor: 'transparent',
              tension:         0.3
            }]
          }}
          options={{
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text:    `Tasks (Last ${rangeDays} Days)`,
                color:   textColor
              }
            }
          }}
        />
      </div>

      {/* Habit Check-ins Chart */}
      <div style={{ maxWidth: 700, margin: '2rem auto' }}>
        <Line
          data={{
            labels: habitData.labels,
            datasets: [{
              label:           'Habit Check-ins',
              data:            habitData.counts,
              borderColor:     primaryColor,
              backgroundColor: 'transparent',
              tension:         0.3
            }]
          }}
          options={{
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text:    `Habits (Last ${rangeDays} Days)`,
                color:   textColor
              }
            }
          }}
        />
      </div>
    </div>
  );
}
