import axios from 'axios';

const BASE = 'http://localhost:5000/api/tasks/';

// get all tasks
export function fetchTasks(token) {
  return axios.get(BASE, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// create a new task
export function createTask(token, data) {
  return axios.post(BASE, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// update existing task
export function updateTask(token, id, data) {
  return axios.put(BASE + id, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// delete a task
export function deleteTask(token, id) {
  return axios.delete(BASE + id, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
