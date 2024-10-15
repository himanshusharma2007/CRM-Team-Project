// Import the api instance from api.js
import api from "./api";

// Service to get a meeting by ID
export const getMeetingById = async (id) => {
  try {
    const response = await api.get(`/meeting/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching meeting");
  }
};

// Service to get upcoming meeting
export const getUpcomingMeetings = async (id) => {
  try {
    const response = await api.get(`/meeting/upcoming/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching upcoming meeting"
    );
  }
};

// Service to create a new meeting
export const createMeeting = async (meetingData) => {
  try {
    const response = await api.post("/meeting/create", meetingData);
    console.log("response in meeting service", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error creating meeting");
  }
};

// Service to update a meeting
export const updateMeeting = async (id, meetingData) => {
  try {
    const response = await api.put(`/meeting/update/${id}`, meetingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error updating meeting");
  }
};

// Service to get meeting by project ID
export const getAllMeetingsByProjectId = async (projectId) => {
  try {
    const response = await api.get(`/meeting/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching meeting by project"
    );
  }
};

// Service to get meeting by status
export const getAllMeetingsByStatus = async (status) => {
  try {
    const response = await api.get(`/meeting/status/${status}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching meeting by status"
    );
  }
};
