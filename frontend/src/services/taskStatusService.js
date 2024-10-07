import api from "./api";

export const todoStatusService = {
  _getTodoStatuses: async () => {
    const response = await api.get("/todoStatus");
    return response.data.map((status) => status.name);
  },
  get getTodoStatuses() {
    return this._getTodoStatuses;
  },
  set getTodoStatuses(value) {
    this._getTodoStatuses = value;
  },
  getStatusData: async (status) => {
    console.log("get status called in services", status);
    const response = await api.post("/todoStatus/getStatusData", { status });
    return response.data;
  },
  addTodoStatus: async (status) => {
    const response = await api.post("/todoStatus/addTodoStatus", { status });
    return response.data;
  },

  updateTodoStatus: async (oldStatus, newStatusName) => {
    const response = await api.put("/todoStatus/updateTodoStatus", {
      status: oldStatus,
      newStatusName,
    });
    return response.data;
  },

  deleteTodoStatus: async (statusId) => {
    console.log('delete status called in services', statusId)
    const response = await api.delete(
      `/todoStatus/deleteTodoStatus/${statusId}`
    );
    return response.data;
  },
};
