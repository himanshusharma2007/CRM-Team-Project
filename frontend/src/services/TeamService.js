import api from "./api";

// Get all teams
export const getAllTeams = async () => {
  try {
    const response = await api.get("/team");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching teams:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create a new team
export const createTeam = async (teamName, department) => {
  try {
    const response = await api.post("/team/create", { teamName, department });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating team:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a team by ID
export const getTeamById = async (teamId) => {
  try {
    const response = await api.get(`/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching team by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update a team
export const updateTeam = async (teamId, teamName, department) => {
  try {
    const response = await api.put(`/team/update/${teamId}`, {
      teamName,
      department,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating team:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a team
export const deleteTeam = async (teamId) => {
  try {
    const response = await api.delete(`/team/delete/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting team:",
      error.response?.data || error.message
    );
    throw error;
  }
};
