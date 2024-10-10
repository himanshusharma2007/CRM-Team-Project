import { useState, useEffect } from "react";
import AddClientModal from "../modal/AddClientModal";
import NewMeetingModal from "../modal/NewMeetingModal";
import AddProjectModal from "../modal/AddProjectModal";
import { FaPlus, FaPencilAlt, FaTrash, FaSave } from "react-icons/fa";
import {
  getAllProjects,
  createProject,
  updateProject,
} from "../../services/projectService";
import {
  getUpcomingMeetings,
  createMeeting,
  updateMeeting,
} from "../../services/meetingService";
import { getAllClients, createClient } from "../../services/clientServices";

const MeetingManagement = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const teams = ["Team A", "Team B", "Team C"]; // This should ideally come from the backend

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, meetingsData, clientsData] = await Promise.all([
        getAllProjects(),
        // getUpcomingMeetings(),
        getAllClients(),
      ]);
      setProjects(projectsData);
      setMeetings(meetingsData);
      setClients(clientsData);
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
      const newProject = await createProject(projectData);
      setProjects([...projects, newProject]);
    } catch (error) {
      setError("Error creating project. Please try again.");
    }
  };

  const handleUpdateProject = async (id, projectData) => {
    try {
      const updatedProject = await updateProject(id, projectData);
      setProjects(projects.map((p) => (p.id === id ? updatedProject : p)));
    } catch (error) {
      setError("Error updating project. Please try again.");
    }
  };

  const handleAddMeeting = async (meetingData) => {
    try {
      const newMeeting = await createMeeting(meetingData);
      setMeetings([...meetings, newMeeting]);
    } catch (error) {
      setError("Error creating meeting. Please try again.");
    }
  };

  const handleUpdateMeeting = async (id, meetingData) => {
    try {
      const updatedMeeting = await updateMeeting(id, meetingData);
      setMeetings(meetings.map((m) => (m.id === id ? updatedMeeting : m)));
    } catch (error) {
      setError("Error updating meeting. Please try again.");
    }
  };

  const handleAddClient = async (clientData) => {
    try {
      const newClient = await createClient(clientData);
      setClients([...clients, newClient]);
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

  if (loading) return <div className="text-center mt-8">Loading...</div>;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Type: {project.serviceType}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Status: {project.projectStatus}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Client:{" "}
              {clients?.find((c) => c.id === project.clientId)?.name || "N/A"}
            </p>

            <button
              onClick={toggleMeetingModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-4 w-full flex items-center justify-center gap-2"
            >
              <FaPlus /> Add New Meeting
            </button>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {meetings
                .filter((meeting) => meeting.projectId === project.id)
                .map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 border rounded-lg mb-2 hover:shadow-md transition duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">Meeting</span>
                      <span className="text-sm text-gray-500">
                        {new Date(meeting.meetingDateTime).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Status: {meeting.meetingStatus}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddClientModal
        isOpen={isClientModalOpen}
        toggleModal={toggleClientModal}
        onAddClient={handleAddClient}
      />
      <NewMeetingModal
        isOpen={isMeetingModalOpen}
        toggleModal={toggleMeetingModal}
        projects={projects}
        clients={clients}
        onAddMeeting={handleAddMeeting}
      />
      <AddProjectModal
        isOpen={isProjectModalOpen}
        toggleModal={toggleProjectModal}
        teams={teams}
        clients={clients}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export default MeetingManagement;
