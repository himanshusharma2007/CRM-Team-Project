import api from "./api";

export const uploadProfileImage = async (formData) => {
  try {
    const response = await api.patch("/profile/uploadProfileImage", formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};

