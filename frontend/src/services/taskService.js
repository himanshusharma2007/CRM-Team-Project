import api from "./api";

export const taskSave = async (title,taskPriority) => {
    try {
      const response = await api.post("/todo/create", { title,taskPriority });
      console.log('response taskSave', response)
      return response.data;
    } catch (error) {
      console.error("Error saving task:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  export const updateTask = async (id, task)=> {
    try {
      console.log("task in updateTask", task)
      const response = await api.put(`/todo/update/${id}`,  task );
      console.log('response updateTask', response)
      return response.data;
    } catch (error) {
      console.error("Error updateTask :", error.response ? error.response.data : error.message);
      throw error; // Rethrow to handle it where you call this function
    }
  };

export const updateTask = async (id, task) => {
  console.log("upadting")
  try {
    console.log(`Attempting to update task ${id} with data:`, task);
    const response = await api.put(`/todo/update/${id}`, task);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    console.error('Error config:', error.config);
    
    throw error; // Re-throw the error so it can be caught by the calling function
  }
};