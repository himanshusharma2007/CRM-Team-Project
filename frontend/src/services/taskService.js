import api from "./api";

export const taskSave = async (title,taskPriority) => {
    try {
      const response = await api.post("/tasks", { title,taskPriority });
      console.log('response taskSave', response)
      return response.data;
    } catch (error) {
      console.error("Error saving task:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  export const updateTask = async (id, task)=> {
    try {
      const response = await api.post(`/tasks/update/${id}`,  task );
      console.log('response updateTask', response)
      return response.data;
    } catch (error) {
      console.error("Error updateTask :", error.response ? error.response.data : error.message);
      throw error; // Rethrow to handle it where you call this function
    }
  };

  export const getAllTasks = async ()=>{
    const response = await api.get('/tasks');
    return response.data;
  };