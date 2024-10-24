import api from "./api"

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (otp, password) => {
  try {
    // console.log("OTP : ", otp);
    // console.log("Password : ", password);
    const response = await api.post('/auth/signup', { otp, password });
    return response.data;
  } catch (error) {
    // Handle and throw error appropriately
    console.error("Error in registering user:", error.response?.data || error.message);
    throw error.response?.data || { success: false, message: "Registration failed." };
  }
}

// Service to send OTP for registration
export const sendOtpForRegister = async (name, email) => {
  try {
    // console.log("Name : ", name);
    // console.log("Email : ", email);
    const response = await api.post('/auth/signup/emailVerify', { name, email });
    return response.data;
  } catch (error) {
    throw error.response.data; // Handle error appropriately
  }
};


export const logout = async () => {
  try {
    const response = await api.get("/auth/logout");
    return response.data;
    // console.log("logout response", response)
  } catch (error) {
    console.error(
      "Error during logout:",
      error.response?.data || error.message
    );
    throw error;
    // console.log("error in logout", error)
  }
};

export const reset = async ( newPassword, oldPassword) => {
  try {
    const response = await api.put("/auth/reset", {
      newPassword,
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
    console.log("get user called")
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    console.log("get all user called");
    const response = await api.get("/profile/allUsers");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users : ", error.response ? error.response.data : error.message);
    throw error;
  }
}

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
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in OTP verification:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const verifyUser = async (userId, teamId, role, permissions) => {
  try {
    const response = await api.post('/profile/verifyuser', {
      userId,
      teamId,
      role,
      permissions
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};
export const getUnVerifiedUsers = async () => {
  try {
    console.log("un verified called")
    const response = await api.get('/profile/unverified');
    console.log("unverified res", response)
    return response.data;
  } catch (error) {
    console.error("Error fetching unverified users:", error.response?.data || error.message);
    throw error;
  }
};

export const updatePermissions = async (userId, permissions) => {
  try {
    console.log("user id",userId)
    console.log("permissions",permissions)
    const response = await api.put(`/profile/updateUserPermission/${userId}`, { permission: permissions });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user permissions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const blockUser = async (userId) => {
  try {
    const response = await api.put(`/profile/block/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error blocking user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const unblockUser = async (userId) => {
  try {
    console.log('userId in unBlockuser', userId)
    const response = await api.put(`/profile/unblock/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error unblocking user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

