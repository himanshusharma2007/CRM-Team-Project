import api from './api';

const ConnectionService = {
  // Get all contact
  getcontact: async () => {
    try {
      const response = await api.get('/contact');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Create a new contact
  createContact: async (contactData) => {
    try {
      const response = await api.post('/contact/create', contactData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Delete a contact
  deleteContact: async (id) => {
    try {
      const response = await api.delete(`/contact/delete/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Update a contact
  updateContact: async (id, contactData) => {
    try {
      const response = await api.put(`/contact/update/${id}`, contactData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};

// Error handling function
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data.error || 'An error occurred',
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 503,
      message: 'Network error. Please try again later.',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
};

export default ConnectionService;