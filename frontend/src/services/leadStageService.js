import api from "./api";

export const leadStageService = {
  getStages: async () => {
    try {
      const response = await api.get("/stage");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  addStage: async (stageName) => {
    try {
      const response = await api.post("/stage/add-stage", { stageName });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updateStage: async (stageName, newStageName) => {
    try {
      const response = await api.put("/stage/update-stage", {
        stageName,
        newStageName,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  deleteStage: async (stageName) => {
    try {
      const response = await api.delete("/stage/delete-stage", {
        data: { stageName },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default leadStageService;
