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

  export const getAllTasks = async ()=>{
    const response = await api.get('/todo');
    return response.data;
  };
