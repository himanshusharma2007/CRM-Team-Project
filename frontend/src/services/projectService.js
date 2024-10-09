// Import the api instance from api.js
import api from './api';

// Service to get all projects
export const getAllProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching projects');
  }
};

// Service to get project by ID
export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching project');
  }
};

// Service to create a new project
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects/create', projectData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error creating project');
  }
};

// Service to update a project
export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/update/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating project');
  }
};

// Service to delete a project
export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error deleting project');
  }
};
