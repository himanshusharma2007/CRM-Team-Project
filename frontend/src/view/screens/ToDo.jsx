import { useState, useEffect } from "react";
import { getAllTasks, taskSave, updateTask } from "../../services/taskService";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { todoStatusService } from "../../services/taskStatusService";
import "../styles/animation.css";
import axios from "axios";
import {
  FaEdit,
  FaPlus,
  FaPencilAlt,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ToDo = () => {
  const [tasks, setTasks] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [title, setTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [editTask, setEditTask] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [recentlyDropped, setRecentlyDropped] = useState(null);
  const [taskStage, setTaskStage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [editStatusName, setEditStatusName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isManagingStatus, setIsManagingStatus] = useState(false);
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      console.log("fetchTasks called");
      const fetchedTasks = await getAllTasks();
      console.log("fetchedTasks", fetchedTasks);
      const fetchedStatuses = await todoStatusService.getTodoStatuses();
      console.log("fetchedStatuses", fetchedStatuses);
      setStatuses(fetchedStatuses);

      const groupedTasks = fetchedStatuses.reduce((acc, status) => {
        acc[status] = fetchedTasks.filter(
          (task) => task.status.name === status
        );
        return acc;
      }, {});

      console.log("groupedTasks", groupedTasks);
      setTasks(groupedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert(
        `Error fetching tasks: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setTaskPriority(e.target.value);
  };

  const handleStageChange = (e) => {
    setTaskStage(e.target.value);
  };

  const addTask = async () => {
    if (title.trim() && taskStage) {
      setIsAddingTask(true);
      try {
        const statusData = await todoStatusService.getStatusData(taskStage);
        const newTask = await taskSave({
          title: title.trim(),
          priority: taskPriority,
          status: statusData._id,
        });
        const formattedNewTask = {
          ...newTask,
          status: { name: taskStage, _id: statusData._id },
        };
        setTasks((prevTasks) => ({
          ...prevTasks,
          [taskStage]: [...(prevTasks[taskStage] || []), formattedNewTask],
        }));
        setTitle("");
        setTaskPriority("Medium");
        setTaskStage(null);
      } catch (error) {
        console.error("Failed to save task:", error);
        alert(
          `Failed to save task: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setIsAddingTask(false);
      }
    } else {
      alert("Please enter a task title and select a status");
    }
  };

  const moveTask = async (task, from, to) => {
    const fromStatusName = from.name || from;
    const toStatusName = to.name || to;

    if (fromStatusName === toStatusName) return;

    console.log("Attempting to move task:", {
      task,
      fromStatusName,
      toStatusName,
    });

    setIsUpdating(true);

    try {
      const toStatusData = await todoStatusService.getStatusData(toStatusName);
      console.log("Target status data:", toStatusData);
      console.log("task in move funcion", task);
      task.status = toStatusData;
      console.log("Sending update to server:", { taskId: task._id, task });

      const updatedTask = await updateTask(task._id, task);
      console.log("Task updated successfully on server:", updatedTask);

      setTasks((prevTasks) => {
        const fromTasks = prevTasks[fromStatusName].filter(
          (t) => t._id !== task._id
        );
        const updatedTaskForState = {
          ...task,
          status: { name: toStatusName, _id: toStatusData._id },
        };
        const toTasks = [
          ...(prevTasks[toStatusName] || []),
          updatedTaskForState,
        ];
        return {
          ...prevTasks,
          [fromStatusName]: fromTasks,
          [toStatusName]: toTasks,
        };
      });
    } catch (error) {
      console.error("Failed to move task:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
          console.error("Request method:", error.config.method);
          console.error("Request URL:", error.config.url);
          console.error("Request data:", error.config.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      } else {
        console.error("Non-Axios error:", error);
      }

      alert(
        `Failed to move task. Please try again. If the issue persists, contact support.`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    const ghostElement = e.target.cloneNode(true);
    ghostElement.style.position = "absolute";
    ghostElement.style.top = "-1000px";
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    e.target.classList.add("dragging");

    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    setDragOverSection(null);
  };

  const handleDragEnter = (e, section) => {
    e.preventDefault();
    setDragOverSection(section);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverSection(null);
  };

  const handleDrop = async (e, section) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status.name !== section) {
      await moveTask(draggedTask, draggedTask.status.name, section);
      setRecentlyDropped(draggedTask._id);
      setTimeout(() => setRecentlyDropped(null), 500);
    }
    setDraggedTask(null);
    setDragOverSection(null);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleEditChange = (e) => {
    setEditInput(e.target.value);
  };

  const handleEditPriorityChange = (e) => {
    setEditPriority(e.target.value);
  };

  const startEditing = (task, section) => {
    setEditTask({ ...task, section });
    setEditInput(task.title);
    setEditPriority(task.priority);
  };

  const saveEdit = async () => {
    if (editInput.trim()) {
      setIsUpdatingTask(true);
      const updatedTask = {
        ...editTask,
        title: editInput,
        priority: editPriority,
      };
      try {
        await updateTask(editTask._id, updatedTask);
        setTasks((prevTasks) => {
          const fromTasks = prevTasks[editTask.section].filter(
            (t) => t._id !== editTask._id
          );
          return {
            ...prevTasks,
            [editTask.section]: [...fromTasks, updatedTask],
          };
        });
        setEditTask(null);
        setEditInput("");
        setEditPriority("Medium");
      } catch (error) {
        console.error("Failed to update task:", error);
        alert(
          `Failed to update task: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setIsUpdatingTask(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditTask(null);
    setEditInput("");
    setEditPriority("Medium");
  };

  const handleStatusAdd = async (newStatus) => {
    setIsManagingStatus(true);
    try {
      await todoStatusService.addTodoStatus(newStatus);
      setStatuses([...statuses, newStatus]);
      setTasks({ ...tasks, [newStatus]: [] });
    } catch (error) {
      console.error("Failed to add status:", error);
      alert(
        `Failed to add status: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsManagingStatus(false);
    }
  };

  const handleStatusEdit = async (oldStatus, newStatus) => {
    setIsManagingStatus(true);
    try {
      await todoStatusService.updateTodoStatus(oldStatus, newStatus);
      setStatuses(statuses.map((s) => (s === oldStatus ? newStatus : s)));
      setTasks((prevTasks) => {
        const updatedTasks = {
          ...prevTasks,
          [newStatus]: prevTasks[oldStatus],
        };
        delete updatedTasks[oldStatus];
        return updatedTasks;
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(
        `Failed to update status: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsManagingStatus(false);
    }
  };

  const handleStatusDelete = async (statusToDelete) => {
    console.log("statusToDelete in handleStatusDelete", statusToDelete);
    if (statuses.length <= 1) {
      alert("Cannot delete the last remaining status.");
      return;
    }
    setIsManagingStatus(true);
    try {
      let statusObj = await todoStatusService.getStatusData(statusToDelete);
      if (!statusObj) {
        throw new Error("Status not found");
      }
      await todoStatusService.deleteTodoStatus(statusObj._id);
      setStatuses(statuses.filter((s) => s !== statusToDelete));
      setTasks((prevTasks) => {
        const { [statusToDelete]: deletedStatus, ...remainingTasks } =
          prevTasks;
        return remainingTasks;
      });
    } catch (error) {
      console.error("Failed to delete status:", error);
      alert(
        `Failed to delete status: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsManagingStatus(false);
    }
  };
  const startEditingStatus = (status) => {
    setEditingStatus(status);
    setEditStatusName(status);
  };

  const cancelEditingStatus = () => {
    setEditingStatus(null);
    setEditStatusName("");
  };

  const saveEditedStatus = async (oldStatus) => {
    if (editStatusName.trim() === "") {
      alert("Status name cannot be empty.");
      return;
    }

    if (editStatusName.trim() === oldStatus) {
      cancelEditingStatus();
      return;
    }

    if (statuses.includes(editStatusName.trim())) {
      alert("This status name already exists.");
      return;
    }

    setIsManagingStatus(true);
    try {
      await handleStatusEdit(oldStatus, editStatusName.trim());
      setStatuses((prevStatuses) =>
        prevStatuses.map((status) =>
          status === oldStatus ? editStatusName.trim() : status
        )
      );
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[editStatusName.trim()] = updatedTasks[oldStatus];
        delete updatedTasks[oldStatus];
        return updatedTasks;
      });
      cancelEditingStatus();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(
        `Failed to update status: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsManagingStatus(false);
    }
  };

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      handleStatusAdd(newStatus.trim());
      setNewStatus("");
      setIsModalOpen(false);
    }
  };
  return (
    <>
      <div className="min-h-screen overflow-auto ">
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Updating task...</p>
              <LoadingSpinner />
            </div>
          </div>
        )}
        {/* Add Task Section */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="wraper flex justify-between">
            <h3 className="text-3xl font-semibold mb-2 text-[#111827]">
              Task Manager
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 mb-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              <FaPlus /> <div>Add New Status</div>
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 className="text-xl font-bold mb-4">Add New Status</h2>
              <input
                type="text"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg mb-4"
                placeholder="New status name"
              />
              <button
                onClick={handleAddStatus}
                className="bg-blue-500 text-white p-2 mx-2 rounded-lg hover:bg-blue-600"
              >
                Create Status
              </button>
            </Modal>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={title}
              onChange={handleInputChange}
              className="flex-grow border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a new task"
            />
            <select
              value={taskPriority}
              onChange={handlePriorityChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={taskStage}
              onChange={handleStageChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">--select status---</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              onClick={addTask}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add Task
            </button>
          </div>
        </div>

        {editTask && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Edit Task
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={editInput}
                onChange={handleEditChange}
                className="flex-grow border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={editPriority}
                onChange={handleEditPriorityChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
                  disabled={isUpdatingTask}
                >
                  {isUpdatingTask ? <LoadingSpinner /> : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
                  disabled={isUpdatingTask}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row p-6 gap-6 overflow-auto mb-10">
            {statuses.map((section) => (
              <div
                key={section}
                onDrop={(e) => handleDrop(e, section)}
                onDragOver={allowDrop}
                onDragEnter={(e) => handleDragEnter(e, section)}
                onDragLeave={handleDragLeave}
                className={`flex-1 bg-white rounded-lg shadow-md transition-all duration-300 min-w-64 ${
                  dragOverSection === section ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="text-xl font-bold p-4 bg-gray-200 text-gray-800 rounded-t-lg capitalize flex justify-between items-center">
                  {editingStatus === section ? (
                    <>
                      <input
                        type="text"
                        value={editStatusName}
                        onChange={(e) => setEditStatusName(e.target.value)}
                        onBlur={() => saveEditedStatus(section)}
                        className="flex-grow mr-2 p-1 border rounded max-w-[70%]"
                      />
                      <div className="flex space-x-2 ">
                        <button
                          onClick={() => saveEditedStatus(section)}
                          className="text-green-500 p-1 hover:text-green-700 mr-2"
                          disabled={isManagingStatus}
                        >
                          {isManagingStatus ? <LoadingSpinner /> : <FaSave />}
                        </button>
                        <button
                          onClick={cancelEditingStatus}
                          className="text-red-500 p-1 hover:text-red-700"
                          disabled={isManagingStatus}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex-grow">{section}</span>
                      <div>
                        <button
                          onClick={() => startEditingStatus(section)}
                          className="text-blue-500 p-1 hover:text-blue-700 mr-2"
                          disabled={isManagingStatus}
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={() => handleStatusDelete(section)}
                          className="text-red-500 p-1 hover:text-red-700"
                          disabled={isManagingStatus}
                        >
                          {isManagingStatus ? <LoadingSpinner /> : <FaTrash />}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 space-y-4 h-96 overflow-y-auto">
                  {tasks[section] &&
                    tasks[section].map((task) => (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 ${
                          recentlyDropped === task._id ? "explode" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            {task.title}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="mt-2 space-x-2">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEditing(task, section)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <FaEdit />
                              </button>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(task.createdAt).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric" }
                              )}{" "}
                              {new Date(task.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ToDo;
