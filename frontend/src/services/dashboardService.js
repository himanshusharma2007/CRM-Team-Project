import api from "../services/api";

export const dashboardService = {
  getAdminDashboardData: async () => {
    try {
      const response = await api.get("/dashboard/admin");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },
};
