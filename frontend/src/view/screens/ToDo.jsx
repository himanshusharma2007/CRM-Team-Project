import { useState, useEffect } from "react";
import { getAllTasks, taskSave, updateTask } from "../../services/taskService";
import "../styles/animation.css";
import { FaEdit, FaPlayCircle, FaCheckCircle } from "react-icons/fa";

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

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setTaskPriority(e.target.value);
  };

  const addTask = async () => {
    if (title.trim()) {
      try {
        const newTask = await taskSave(title, taskPriority);
        setTasks((prevTasks) => ({
          ...prevTasks,
          todo: [...prevTasks.todo, newTask],
        }));
        setTitle("");
        setTaskPriority("Medium");
      } catch (error) {
        console.error("Failed to save task:", error);
      }
    }
  };

  const moveTask = async (task, from, to) => {
    if (from === to) return;

    setTasks((prevTasks) => {
      const fromTasks = prevTasks[from].filter((t) => t._id !== task._id);
      const toTasks = [...prevTasks[to], { ...task, status: to }];
      return {
        ...prevTasks,
        [from]: fromTasks,
        [to]: toTasks,
      };
    });

    await updateTask(task._id, { ...task, status: to });
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
    if (draggedTask && draggedTask.status !== section) {
      await moveTask(draggedTask, draggedTask.status, section);
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-800 p-6">
          <h1 className="text-4xl font-extrabold text-center text-white">
            Task Master
          </h1>
        </div>

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
            <button
              onClick={addTask}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add Task
            </button>
          </div>
        </div>

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
    </div>
  );
};

export default ToDo;
