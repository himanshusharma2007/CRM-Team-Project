import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { getAllTasks, taskSave, updateTask } from "../../services/taskService";
import "../styles/animation.css";
import axios from "axios";
import {
  FaEdit,
  FaPlus,
  FaPencilAlt,
  FaTrash,
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

const StatusManager = ({
  statuses,
  onStatusAdd,
  onStatusEdit,
  onStatusDelete,
}) => {
  const [newStatus, setNewStatus] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      onStatusAdd(newStatus.trim());
      setNewStatus("");
      setIsModalOpen(false);
    }
  };

  const handleEditStatus = (oldStatus, newStatus) => {
    if (newStatus.trim() && oldStatus !== newStatus.trim()) {
      onStatusEdit(oldStatus, newStatus.trim());
      setEditingStatus(null);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
      <div className="wraper flex justify-between">
      <h3 className="text-2xl font-semibold mb-2">Manage Statuses</h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 mb-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      >
        <FaPlus /> <div >Add New Status</div>
      </button>
      </div>
      
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
      <div className="space-y-2">
        {statuses.map((status) => (
          <div key={status} className="flex items-center">
            {editingStatus === status ? (
              <input
                type="text"
                defaultValue={status}
                onBlur={(e) => handleEditStatus(status, e.target.value)}
                className="flex-grow border border-gray-300 p-1 rounded-lg mr-2"
              />
            ) : (
              <span className="flex-grow">{status}</span>
            )}
            <button
              onClick={() => setEditingStatus(status)}
              className="text-blue-500 p-1 hover:text-blue-700 mr-2"
            >
              <FaPencilAlt />
            </button>
            <button
              onClick={() => onStatusDelete(status)}
              className="text-red-500 p-1 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ToDo = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: [],
  });

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


  const fetchTasks = async () => {
    try {
      console.log('fetchTasks called');
      const fetchedTasks = await getAllTasks();
      console.log('fetchedTasks', fetchedTasks);
      const fetchedStatuses = await todoStatusService.getTodoStatuses();
      console.log('fetchedStatuses', fetchedStatuses);
      setStatuses(fetchedStatuses);
  
      const groupedTasks = fetchedStatuses.reduce((acc, status) => {
        acc[status] = fetchedTasks.filter((task) => task.status.name === status);
        return acc;
      }, {});
  
      console.log('groupedTasks', groupedTasks);
      setTasks(groupedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert(
        `Error fetching tasks: ${
          error.response?.data?.message || error.message
        }`
      );
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

  const addTask = async () => {
    if (title.trim()) {
      try {
        const statusData = await todoStatusService.getStatusData(taskStage);
        const newTask = await taskSave({
          title: title.trim(),
          priority: taskPriority,
          status: statusData._id,
        });
        // Ensure the new task has the correct structure
        const formattedNewTask = {
          ...newTask,
          status: { name: taskStage, _id: statusData._id }
        };
        setTasks((prevTasks) => ({
          ...prevTasks,
          [taskStage]: [...(prevTasks[taskStage] || []), formattedNewTask],
        }));
        setTitle("");
        setTaskPriority("Medium");
      } catch (error) {
        console.error("Failed to save task:", error);
        alert(`Failed to save task: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const moveTask = async (task, from, to) => {
    const fromStatusName = from.name || from;
    const toStatusName = to.name || to;

    if (fromStatusName === toStatusName) return;

    console.log('Attempting to move task:', { task, fromStatusName, toStatusName });

    setIsUpdating(true);

    try {
      const toStatusData = await todoStatusService.getStatusData(toStatusName);
      console.log('Target status data:', toStatusData);
    console.log('task in move funcion', task )
      // Prepare the update data
      task.status=toStatusData;
      // const updateData = { status: toStatusData._id };
      console.log('Sending update to server:', { taskId: task._id, task });

      // Update on the server first
      const updatedTask = await updateTask(task._id, task);
      console.log('Task updated successfully on server:', updatedTask);

      // If server update is successful, update local state
      setTasks((prevTasks) => {
        const fromTasks = prevTasks[fromStatusName].filter((t) => t._id !== task._id);
        const updatedTaskForState = { 
          ...task, 
          status: { name: toStatusName, _id: toStatusData._id }
        };
        const toTasks = [...(prevTasks[toStatusName] || []), updatedTaskForState];
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

      // Show error message to the user
      alert(`Failed to move task. Please try again. If the issue persists, contact support.`);
    } finally {
      setIsUpdating(false);
    }
  };

  // const refreshTasks = async () => {
  //   try {
  //     const fetchedTasks = await getAllTasks();
  //     const fetchedStatuses = await todoStatusService.getTodoStatuses();
      
  //     const groupedTasks = fetchedStatuses.reduce((acc, status) => {
  //       acc[status] = fetchedTasks.filter((task) => task.status.name === status);
  //       return acc;
  //     }, {});

  //     setTasks(groupedTasks);
  //   } catch (error) {
  //     console.error("Error refreshing tasks:", error);
  //     alert("Failed to refresh tasks. Please try again later.");
  //   }
  // };


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
      const updatedTask = {
        ...editTask,
        title: editInput,
        priority: editPriority,
      };
      setTasks((prevTasks) => {
        const fromTasks = prevTasks[editTask.section].filter(
          (t) => t._id !== editTask._id
        );
        return {
          ...prevTasks,
          [editTask.section]: [...fromTasks, updatedTask],
        };
      });
      await updateTask(editTask._id, updatedTask);
      setEditTask(null);
      setEditInput("");
      setEditPriority("Medium");
    }
  };

  const cancelEdit = () => {
    setEditTask(null);
    setEditInput("");
    setEditPriority("Medium");
  };

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getAllTasks();
      setTasks({
        todo: fetchedTasks.filter(
          (task) => task.status.toLowerCase() === "todo"
        ),
        doing: fetchedTasks.filter(
          (task) => task.status.toLowerCase() === "doing"
        ),
        done: fetchedTasks.filter(
          (task) => task.status.toLowerCase() === "done"
        ),
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>

    <div className="min-h-screen overflow-auto ">
    {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Updating task...</p>
          </div>
        </div>
      )}
      {/* Add Task Section */}
      <div className="p-6 bg-white border-b border-gray-200">
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

      <StatusManager
        statuses={statuses}
        onStatusAdd={handleStatusAdd}
        onStatusEdit={handleStatusEdit}
        onStatusDelete={handleStatusDelete}
      />

        {/* Edit Task Section */}
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
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Sections */}
        <div className="flex flex-col lg:flex-row p-6 gap-6">
          {["todo", "doing", "done"].map((section) => (
            <div
              key={section}
              onDrop={(e) => handleDrop(e, section)}
              onDragOver={allowDrop}
              onDragEnter={(e) => handleDragEnter(e, section)}
              onDragLeave={handleDragLeave}
              className={`flex-1 bg-white rounded-lg shadow-md transition-all duration-300 ${
                dragOverSection === section ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <h2 className="text-xl font-bold p-4 bg-gray-200 text-gray-800 rounded-t-lg capitalize">
                {section}
              </h2>
              <div className="p-4 space-y-4 h-96 overflow-y-auto">
                {tasks[section].map((task) => (
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
                        className={`text-xs px-1 py-1 rounded-full ${
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
                    {/* Display createdAt timestamp */}
                    <div className="mt-2 space-x-2">
                      <div className="flex items-center justify-between gap-4">
                        {section !== "done" && (
                          <div className="flex spaxe-x-1">
                            {/* Task Action Button */}

                            <button
                              onClick={() =>
                                moveTask(
                                  task,
                                  section,
                                  section === "todo" ? "doing" : "done"
                                )
                              }
                              className=""
                            >
                              {section === "todo" ? (
                                <span className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition duration-300 ">Start</span>
                              ) : (
                                <FaCheckCircle className="text-green-500 bg-transparent !important" />
                              )}
                            </button>

                            {/* Edit Button */}
                            {section === "doing" && (
                              <button
                                onClick={() => startEditing(task, section)}
                                className="px-3 py-1 text-blue-500 rounded-md transition duration-300"
                              >
                                <FaEdit />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Timestamp Section */}
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
    </div>
    </>
  );
};

export default ToDo;
