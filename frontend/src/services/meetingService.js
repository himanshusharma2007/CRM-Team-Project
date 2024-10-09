// Import the api instance from api.js
import api from "./api";

// Service to get a meeting by ID
export const getMeetingById = async (id) => {
  try {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching meeting");
  }
};

// Service to get upcoming meetings
export const getUpcomingMeetings = async () => {
  try {
    const response = await api.get("/meetings/upcoming");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching upcoming meetings"
    );
  }
};

// Service to create a new meeting
export const createMeeting = async (meetingData) => {
  try {
    const response = await api.post("/meetings/create", meetingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error creating meeting");
  }
};

// Service to update a meeting
export const updateMeeting = async (id, meetingData) => {
  try {
    const response = await api.put(`/meetings/update/${id}`, meetingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error updating meeting");
  }
};

// Service to get meetings by project ID
export const getAllMeetingsByProjectId = async (projectId) => {
  try {
    const response = await api.get(`/meetings/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching meetings by project"
    );
  }
};

// Service to get meetings by status
export const getAllMeetingsByStatus = async (status) => {
  try {
    const response = await api.get(`/meetings/status/${status}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching meetings by status"
    );
  }
};
