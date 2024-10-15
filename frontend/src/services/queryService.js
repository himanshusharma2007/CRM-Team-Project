import api from "./api";

// Function to submit a contactUs
export const submitContactUs = async (name, email, message, subject) => {
  try {
    const response = await api.post("/contactUs", {
      name,
      email,
      message,
      subject,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error submitting contactUs");
  }
};

// Function to send a confirmation email after contactUs submission
export const sendConfirmationEmail = async (email, name) => {
  try {
    const response = await api.post("/contactUs/send-confirmation", {
      email,
      name,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error sending confirmation email");
  }
};

// Function to fetch all  for the admin dashboard
export const fetchContactUs = async () => {
  try {
    const response = await api.get("/contactUs/all-contactUs");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching ");
  }
};

export const respondToContactUs = async (id, responseText) => {
  try {
    console.log("respond to contactUs called", id);
    const response = await api.put(
      `/contactUs/responed-contactUs/${id}`,
      {
        response: responseText,
      }
    );
    console.log("response in respondToContactUs:>> ", response);

    return response.data;
  } catch (error) {
    throw new Error("Error responding to contactUs");
  }
};
