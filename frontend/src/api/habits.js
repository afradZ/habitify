import axios from 'axios';
const BASE = 'http://localhost:5000/api/habits/';

export function fetchHabits(token) {
  return axios.get(BASE, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function createHabit(token, data) {
  return axios.post(BASE, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function checkInHabit(token, id) {
  return axios.post(`${BASE}${id}/checkin`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
