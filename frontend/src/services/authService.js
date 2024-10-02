import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error during registration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error(
      "Error during logout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const reset = async (email, password, oldPassword) => {
  try {
    const response = await api.post("/auth/reset", {
      email,
      password,
      oldPassword,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error during password reset:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/auth/getuser");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error(
      "Error in forgot password:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const verifyOTP = async (email, otp, password) => {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp, password });
    return response.data;
  } catch (error) {
    console.error(
      "Error in OTP verification:",
      error.response?.data || error.message
    );
    throw error;
  }
};