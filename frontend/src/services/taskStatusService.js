import api from "./api";
export const todoStatusService = {
  
    addTodoStatus: async (status) => {
      try {
        const response = await api.post('/todoStatus/addTodoStatus', { status });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error.response.data;
      }
    },
    
    // Delete a status from a user's todos
    deleteTodoStatus: async (status) => {
      try {
        const response = await api.delete('/todoStatus/deleteTodoStatus', { data: { status } });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error.response.data;
      }
    },
    
    // Update a todo status
    updateTodoStatus: async (status, newStatusName) => {
      try {
        const response = await api.put('/todoStatus/updateTodoStatus', { status, newStatusName });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error.response.data;
      }
    },
    
    // Get all statuses of the user
    getTodoStatuses: async () => {
      try {
        const response = await api.get('/todoStatus');
        return response.data;
      } catch (error) {
        console.error(error);
        throw error.response.data;
      }
    }
  };
  