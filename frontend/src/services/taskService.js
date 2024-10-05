import api from './api';

export const getAllTasks = async () => {
  const response = await api.get('/todo');
  return response.data;
};

export const taskSave = async (task) => {
  const response = await api.post('/todo/create', task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await api.put(`/todo/update/${id}`, task);
  return response.data;
};