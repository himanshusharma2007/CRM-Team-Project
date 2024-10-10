// Import the API instance from api.js
import api from './api';

// Service to get all client
export const getAllClients = async () => {
  try {
    const response = await api.get('/client');
    return response.data;
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

// Service to get a client by ID
export const getClientById = async (clientId) => {
  try {
    const response = await api.get(`/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching client with ID: ${clientId}`, error);
    throw error;
  }
};

// Service to create a new client
export const createClient = async (clientData) => {
  try {
    const response = await api.post('/client/create', clientData);
    return response.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Service to update a client
export const updateClient = async (clientId, clientData) => {
  try {
    const response = await api.put(`/client/update/${clientId}`, clientData);
    return response.data;
  } catch (error) {
    console.error(`Error updating client with ID: ${clientId}`, error);
    throw error;
  }
};

// Service to delete a client (if you need it)
export const deleteClient = async (clientId) => {
  try {
    const response = await api.delete(`/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting client with ID: ${clientId}`, error);
    throw error;
  }
};
