import api from "./api";

export const leadService = {
  createLead: async (leadData) => {
    console.log("leadData in leadService:", leadData);
    try {
      const response = await api.post("/lead/create", leadData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getAllLeads: async () => {
    try {
      const response = await api.get("/lead");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getLeadById: async (id) => {
    try {
      const response = await api.get(`/lead/lead-details/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updateLead: async (id, leadData) => {
    try {
      const response = await api.put(`/lead/update/${id}`, leadData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  deleteLead: async (id) => {
    try {
      const response = await api.delete(`/lead/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updateStage: async (id, stageName) => {
    try {
      console.log("update stage called stageName", stageName);
      const response = await api.put(`/lead/update-stage/${id}`, {
        stageName,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default leadService;
