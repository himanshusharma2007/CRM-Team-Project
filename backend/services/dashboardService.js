import { dashboardService } from "../services/dashboardService";

export const adminDashboardController = {
  getDashboardData: async () => {
    try {
      const rawData = await dashboardService.getAdminDashboardData();
      return processRawData(rawData);
    } catch (error) {
      console.error("Error in getDashboardData:", error);
      throw error;
    }
  },
};

function processRawData(rawData) {
  // Ensure all required properties exist with default values
  const processedData = {
    projectData: { pending: 0, completed: 0, total: 0 },
    queryData: { responded: 0, pending: 0, total: 0, todayQueries: 0 },
    leadData: {
      connected: 0,
      converted: 0,
      lost: 0,
      todayLeads: 0,
      new: 0,
      monthlyData: [],
    },
    clientData: { totalIndian: 0, totalForeigner: 0 },
    userData: { active: 0, verify: 0, unverify: 0 },
    connectionData: { total: 0, lastTwo: [] },
  };

  // Merge raw data with processed data, ensuring all properties exist
  Object.keys(processedData).forEach((key) => {
    if (rawData[key]) {
      processedData[key] = { ...processedData[key], ...rawData[key] };
    }
  });

  // Generate dummy monthly data if it doesn't exist
  if (processedData.leadData.monthlyData.length === 0) {
    processedData.leadData.monthlyData = generateDummyMonthlyData();
  }

  return processedData;
}

function generateDummyMonthlyData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    month,
    value: Math.floor(Math.random() * 100),
  }));
}
