import api from "./api";

export const uploadProfileImage = async (profileImg) => {
  try {
    const response = await api.patch("/profile/uploadProfileImage", profileImg);
    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};

