import axios from 'axios';

const BASE = '/api/settings';

// GET current settings
export function getSettings(token) {
  return axios.get(BASE, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// PUT updated settings
export function updateSettings(token, data) {
  return axios.put(BASE, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
