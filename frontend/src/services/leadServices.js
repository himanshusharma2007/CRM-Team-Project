import api from "./api";

export const getAllLeads = async () => {
  try {
    const response = await api.get("/lead");
    console.log('response in getAllleads', response)
    return response.data;
  } catch (error) {
    console.error("Error fetching all leads:", error);
    throw error;
  }
};

export const getLeadById = async (id) => {
  try {
    const response = await api.get(`/lead/lead-details/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lead with id ${id}:`, error);
    throw error;
  }
};

export const createLead = async (leadData) => {
  try {
    const response = await api.post("/lead/create", leadData);
    return response.data;
  } catch (error) {
    console.error("Error creating lead:", error);
    throw error;
  }
};

export const updateLead = async (id, leadData) => {
  try {
    const response = await api.put(`/lead/update/${id}`, leadData);
    console.log("response.data in update lead:>> ", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating lead with id ${id}:`, error);
    throw error;
  }
};
export const updateStage = async (id, leadData) => {
    try {
      const response = await api.put(`/lead/update-stage/${id}`, leadData);
      console.log("response.data in update lead:>> ", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead with id ${id}:`, error);
      throw error;
    }
  };
export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/lead/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting lead with id ${id}:`, error);
    throw error;
  }
};
