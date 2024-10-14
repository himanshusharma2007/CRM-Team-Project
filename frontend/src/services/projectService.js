// Import the api instance from api.js
import api from './api';

// Service to get all project
export const getAllProjects = async () => {
  try {
    const response = await api.get('/project');
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching project');
  }
};

// Service to get project by ID
export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/project/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching project');
  }
};

// Service to create a new project
export const createProject = async (projectData) => {
  try {
    console.log("Sending project data to API:", projectData);
    const response = await api.post('/project/create', projectData);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in createProject service:", error);
    const errorMessage = error.response?.data?.message || 'Error creating project';
    throw new Error(errorMessage);
  }
};


// Service to update a project
export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/project/update/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating project');
  }
};

// Service to delete a project
export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/project/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error deleting project');
  }
};
