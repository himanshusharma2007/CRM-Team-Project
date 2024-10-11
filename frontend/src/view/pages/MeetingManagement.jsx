import { useState, useEffect } from "react";
import AddClientModal from "../modal/AddClientModal";
import NewMeetingModal from "../modal/NewMeetingModal";
import AddProjectModal from "../modal/AddProjectModal";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import {
  getAllProjects,
  createProject,
  updateProject,
} from "../../services/projectService";
import {

  createMeeting,
  updateMeeting,
} from "../../services/meetingService";
import { getAllClients, createClient, deleteClient } from "../../services/clientServices";

const MeetingManagement = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  // const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectsData = await getAllProjects();
      // const meetingsData = await getUpcomingMeetings();
      const clientsData = await getAllClients();
      setProjects(projectsData);
      // setMeetings(meetingsData);
      setClients(clientsData);

      setTeams(allTeams);
      // Extract unique teams from projects
      const uniqueTeams = [
        ...new Set(projectsData.flatMap((project) => project.teamIds)),
      ];
      setTeams(uniqueTeams);
    } catch (error) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleClientModal = () => setIsClientModalOpen(!isClientModalOpen);
  const toggleMeetingModal = () => setIsMeetingModalOpen(!isMeetingModalOpen);
  const toggleProjectModal = () => setIsProjectModalOpen(!isProjectModalOpen);

  const handleAddProject = async (projectData) => {
    try {
      console.log('projectDatain handle add project ', projectData)
      const newProject = await createProject(projectData);
      setProjects((prevProjects) => [...prevProjects, newProject]);
    } catch (error) {
      setError("Error creating project. Please try again.");
    }
  };

  const handleUpdateProject = async (id, projectData) => {
    try {
      const updatedProject = await updateProject(id, projectData);
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === id ? updatedProject : p))
      );
    } catch (error) {
      setError("Error updating project. Please try again.");
    }
  };

  const handleAddMeeting = async (meetingData) => {
    try {
      const newMeeting = await createMeeting(meetingData);
      setMeetings((prevMeetings) => [...prevMeetings, newMeeting]);
      alert("Meeting created successfully");
    } catch (error) {
      setError("Error creating meeting. Please try again.");
    }
  };

  const handleUpdateMeeting = async (id, meetingData) => {
    try {
      const updatedMeeting = await updateMeeting(id, meetingData);
      setMeetings((prevMeetings) =>
        prevMeetings.map((m) => (m.id === id ? updatedMeeting : m))
      );
    } catch (error) {
      setError("Error updating meeting. Please try again.");
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(clientId);
        setClients((prevClients) =>
          prevClients.filter((client) => client._id !== clientId)
        );
        alert("Client deleted successfully.");
      } catch (error) {
        setError("Error deleting client. Please try again.");
      }
    }
  };

  const handleAddClient = async (newClient) => {
    try {
      setClients((prevClients) => [...prevClients, newClient]);
    } catch (error) {
      setError("Error creating client. Please try again.");
    }
  };

  const filteredProjects = projects
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) =>
      filterStatus === "all" ? true : project.projectStatus === filterStatus
    );

  if (loading)
    return (
      <div className="text-center top-1/2 relative">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Meeting Management Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Meeting Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
          onClick={toggleMeetingModal}
        >
          <FaPlus /> Schedule Meeting
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
        />
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-36 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
          <button
            onClick={toggleClientModal}
            className="bg-blue-600 text-nowrap text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <FaPlus /> Add A Client
          </button>
        </div>
      </div>

      {/* Projects and Meetings Section */}
      <div className="flex gap-6 px-6 py-4">
        {searchTerm && filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {project.name}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    project.projectStatus === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {project.projectStatus}
                </span>
              </div>

              {/* Card Content */}
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>

              <div className="text-sm space-y-2">
                <p className="text-gray-500">
                  <span className="font-medium text-gray-700">Start From: </span>
                  {project.startFrom}
                </p>
              </div>
            </div>
          ))
        ) : (
          searchTerm && <div className="text-center text-gray-500">No projects found.</div>
        )}
      </div>

      <div className="flex justify-between gap-6 bg-gray-50 w-full overflow-x-auto">
        {clients &&
          clients.map((client, index) => (
            <div
              key={index}
              className="w-96 p-4 bg-white shadow-md rounded-lg border border-gray-200 flex-shrink-0"
            >
              {/* Client Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">{client.name}</h2>
                <div className="flex gap-2">
                  <button>
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteClient(client._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Filter Input */}
              <input
                type="text"
                placeholder="Filter"
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
              {/* Add More Client Details as needed */}
            </div>
          ))}
      </div>

      {/* Modals */}
      <AddClientModal
        isOpen={isClientModalOpen}
        onClose={toggleClientModal}
        onAddClient={handleAddClient}
        teams={teams}
      />
      <NewMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={toggleMeetingModal}
        onAddMeeting={handleAddMeeting}
        projects={projects}
      />
      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={toggleProjectModal}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export default MeetingManagement;
