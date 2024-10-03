import { useState, useEffect } from 'react';
import { Container } from 'react-smooth-dnd';
import { getAllTasks, taskSave, updateTask } from '../../services/taskService';

const ToDo = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: []
  });

  const [title, setTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [editTask, setEditTask] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

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
          todo: [...prevTasks.todo, newTask]
        }));
        setTitle('');
        setTaskPriority('Medium');
      } catch (error) {
        console.error("Failed to save task:", error);
      }
    }
  };

  const moveTask = async (task, from, to) => {
    console.log("Moving task:", task);
    setTasks((prevTasks) => {
      const fromTasks = prevTasks[from].filter((t) => t._id !== task._id);
      const toTasks = [...prevTasks[to], {...task, status: to}];
      return {
        ...prevTasks,
        [from]: fromTasks,
        [to]: toTasks
      };
    });
    await updateTask(task._id, {...task, status: to});
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
      const updatedTask = { ...editTask, title: editInput, priority: editPriority };
      setTasks((prevTasks) => {
        const fromTasks = prevTasks[editTask.section].filter(
          (t) => t._id !== editTask._id
        );
        
        return {
          ...prevTasks,
          [editTask.section]: [...fromTasks, updatedTask]
        };
      });
      await updateTask(editTask._id, updatedTask);
      setEditTask(null);
      setEditInput('');
      setEditPriority('Medium');
    }
  };

  const cancelEdit = () => {
    setEditTask(null);
    setEditInput('');
    setEditPriority('Medium');
  };

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getAllTasks();
      console.log("fetchedTasks", fetchedTasks);
      setTasks({
        todo: fetchedTasks.filter((task) => task.status.toLowerCase() === 'todo'),
        doing: fetchedTasks.filter((task) => task.status.toLowerCase() === 'doing'),
        done: fetchedTasks.filter((task) => task.status.toLowerCase() === 'done')
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">To-Do List</h1>
      
      {/* Add Task Section */}
      <div className="flex mb-6 justify-center space-x-4">
        <input
          type="text"
          value={title}
          onChange={handleInputChange}
          className="border border-gray-300 p-3 w-96 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task"
        />
        <select
          value={taskPriority}
          onChange={handlePriorityChange}
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={addTask}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Edit Task Section */}
      {editTask && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Edit Task</h2>
          <input
            type="text"
            value={editInput}
            onChange={handleEditChange}
            className="border border-gray-300 p-3 w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={editPriority}
            onChange={handleEditPriorityChange}
            className="border border-gray-300 p-3 mb-4 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="space-x-4">
            <button
              onClick={saveEdit}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task Sections */}
      <div className="flex space-x-6">
        {['todo', 'doing', 'done'].map((section) => (
          <div key={section} className="w-1/3 bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 capitalize">{section}</h2>
            <Container
              onDrop={(dropResult) => {
                const { removedIndex, addedIndex, payload } = dropResult;
                if (removedIndex !== null || addedIndex !== null) {
                  moveTask(payload, section, section);
                }
              }}
              dragClass="shadow-lg"
              dropClass="bg-blue-100"
              getChildPayload={index => tasks[section][index]}
            >
              <div className="space-y-4 h-96 overflow-y-auto">
                {tasks[section].map((task) => (
                  <div key={task._id}>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium text-gray-700">
                        {task.title}{' '}
                        <span
                          className={`ml-2 text-sm ${
                            task.priority === 'High'
                              ? 'text-red-500'
                              : task.priority === 'Medium'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                          }`}
                        >
                          ({task.priority})
                        </span>
                      </span>
                      <div className="space-x-2">
                        {section !== 'done' && (
                          <button
                            onClick={() =>
                              moveTask(
                                task,
                                section,
                                section === 'todo' ? 'doing' : 'done'
                              )
                            }
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            {section === 'todo' ? 'Start' : 'Complete'}
                          </button>
                        )}
                        {section === 'doing' && (
                          <button
                            onClick={() => startEditing(task, section)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>  
                ))}
              </div>
            </Container>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDo;