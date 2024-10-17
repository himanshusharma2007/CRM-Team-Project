import { useState, useEffect } from "react";
import AddClientModal from "../modal/AddClientModal";
import NewMeetingModal from "../modal/NewMeetingModal";
import AddProjectModal from "../modal/AddProjectModal";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import {
  FaPencilAlt,
  FaPlus,
  FaTrash,
  FaSave,
  FaSearch,
  FaSort,
} from "react-icons/fa";
import { PiGraphBold } from "react-icons/pi";

import {
  getAllProjects,
  createProject,
  updateProject,
} from "../../services/projectService";
import { createMeeting, updateMeeting } from "../../services/meetingService";
import {
  getAllClients,
  deleteClient,
  updateClient,
} from "../../services/clientServices";
import { useNavigate } from "react-router-dom";

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
  const [addProjectToClient, setAddProjectToClient] = useState(null);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editedClientName, setEditedClientName] = useState("");
  const [clientSearchTerms, setClientSearchTerms] = useState({});
  const [clientSortOptions, setClientSortOptions] = useState({});
  const [showSearchFields, setShowSearchFields] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("clients in useEffect", clients);
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
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.log("error in fetchData", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleClientModal = () => setIsClientModalOpen(!isClientModalOpen);
  const toggleMeetingModal = () => setIsMeetingModalOpen(!isMeetingModalOpen);

  const toggleProjectModal = (clientId = null) => {
    setAddProjectToClient(clientId);
    setIsProjectModalOpen(!isProjectModalOpen);
  };

  const handleAddProject = async (projectData) => {
    try {
      console.log("handle add project called");
      console.log("projectData in frontend ", projectData);
      const newProject = await createProject(projectData);
      setProjects((prevProjects) => [...prevProjects, newProject]);

      // Update the client's projects list
      if (projectData.clientId) {
        setClients((prevClients) =>
          prevClients.map((client) =>
            client._id === projectData.clientId
              ? {
                  ...client,
                  projectId: [...(client.projectId || []), newProject],
                }
              : client
          )
        );
      }

      toggleProjectModal(); // Close the modal after adding the project
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
      console.log("error in handleUpdateProject", error);
    }
  };

  const handleAddMeeting = async (meetingData) => {
    try {
      console.log("meetingData in frontend ", meetingData);
      const newMeeting = await createMeeting(meetingData);
      setMeetings((prevMeetings) => [...prevMeetings, newMeeting]);
      alert("Meeting created successfully");
      toggleMeetingModal(); // Close the modal after adding the meeting
    } catch (error) {
      setError("Error creating meeting. Please try again.");
      console.error("Error creating meeting:", error);
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
      console.log("error in handleAddClient", error);
    }
  };
  const handleEditClient = (clientId, clientName) => {
    setEditingClientId(clientId);
    setEditedClientName(clientName);
  };

  const handleSaveClientName = async (clientId) => {
    try {
      const updatedClient = await updateClient(clientId, {
        name: editedClientName,
      });
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId
            ? { ...client, name: updatedClient.name }
            : client
        )
      );
      setEditingClientId(null);
      setEditedClientName("");
    } catch (error) {
      setError("Error updating client name. Please try again.");
      console.log("error in handleSaveClientName", error);
    }
  };

  const toggleSearchField = (clientId) => {
    setShowSearchFields((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  const handleClientSearch = (clientId, searchTerm) => {
    setClientSearchTerms((prev) => ({
      ...prev,
      [clientId]: searchTerm,
    }));
  };

  const handleSortChange = (clientId, sortOption) => {
    setClientSortOptions((prev) => ({
      ...prev,
      [clientId]: sortOption,
    }));
  };

  const sortAndFilterProjects = (projects, clientId) => {
    let filteredProjects = projects;
    const searchTerm = clientSearchTerms[clientId] || "";
    const sortOption = clientSortOptions[clientId] || "dateDesc";

    // Filter projects based on search term
    if (searchTerm) {
      filteredProjects = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort projects
    return filteredProjects.sort((a, b) => {
      switch (sortOption) {
        case "dateAsc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "dateDesc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "pending":
        case "ongoing":
        case "completed":
        case "cancelled":
          if (a.projectStatus === b.projectStatus) {
            return new Date(b.createdAt) - new Date(a.createdAt); // If same status, sort by date desc
          }
          return a.projectStatus === sortOption ? -1 : 1; // Chosen status first
        default:
          return 0;
      }
    });
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "ongoing":
        return "bg-blue-200 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="text-center top-1/2 relative">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 ">
      {/* Meeting Management Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Meeting Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
          onClick={toggleMeetingModal}
        >
          <FaPlus /> Create Meeting
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
            disabled={!searchTerm}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
        {searchTerm && filteredProjects.length > 0
          ? filteredProjects.map((project, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                {/* Card Header */}
                <div className="flex justify-between items-center mb-4 gap-3 min-w-52">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                      project.projectStatus
                    )}`}
                  >
                    {project.projectStatus}
                  </span>
                </div>

                {/* Card Content */}
                <p className="text-sm text-gray-600 mb-4">
                  {project.description}
                </p>

                <div className="text-sm space-y-2">
                  <p className="text-gray-500">
                    <span className="font-medium text-gray-700">
                      Start From:{" "}
                    </span>
                    {project.startFrom}
                  </p>
                </div>
              </div>
            ))
          : searchTerm && (
              <div className="text-center text-gray-500">
                No projects found.
              </div>
            )}
      </div>

      <div className="flex w-full gap-6 px-6 py-8 min-h-screen bg-gray-100 overflow-x-auto">
        {clients &&
          clients.map((client, index) => (
            <div
              key={index}
              className="p-6 shadow-lg rounded-lg border border-gray-300 bg-white w-96 hover:shadow-xl  transition-shadow duration-300 ease-in-out"
            >
              {/* Client Header */}
              <div className="flex justify-between items-center mb-6">
                {editingClientId === client._id ? (
                  <input
                    type="text"
                    value={editedClientName}
                    onChange={(e) => setEditedClientName(e.target.value)}
                    className="text-xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">
                    {client.name}
                  </h2>
                )}
                <div className="flex gap-3">
                  <button
                    className="text-xl text-gray-600 hover:text-blue-600"
                    onClick={() => {
                      navigate(`/thread/${client._id}`);
                    }}
                  >
                    <PiGraphBold />
                  </button>
                  {editingClientId === client._id ? (
                    <button
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleSaveClientName(client._id)}
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      className="text-gray-600 hover:text-blue-600"
                      onClick={() => handleEditClient(client._id, client.name)}
                    >
                      <FaPencilAlt />
                    </button>
                  )}
                  <button
                    className="text-gray-600 hover:text-red-600"
                    onClick={() => handleDeleteClient(client._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Search and Sort Controls */}
              <div className="flex justify-between items-center w-full  mb-4 gap-3">
                <select
                  className="text-sm border w-full border-gray-300 rounded-md p-1"
                  onChange={(e) => handleSortChange(client._id, e.target.value)}
                  value={clientSortOptions[client._id] || "dateDesc"}
                >
                  <option value="dateDesc">Date (Newest)</option>
                  <option value="dateAsc">Date (Oldest)</option>
                  <option value="pending">Status: Pending</option>
                  <option value="ongoing">Status: Ongoing</option>
                  <option value="completed">Status: Completed</option>
                  <option value="cancelled">Status: Cancelled</option>
                </select>
                <button
                  className="text-gray-600  hover:text-blue-600 focus:outline-none"
                  onClick={() => toggleSearchField(client._id)}
                >
                  <FaSearch />
                </button>
              </div>

              {/* Search Input */}
              {showSearchFields[client._id] && (
                <input
                  type="text"
                  placeholder="Search projects"
                  className="border border-gray-300 p-2 w-full rounded-md text-sm text-gray-700 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  onChange={(e) =>
                    handleClientSearch(client._id, e.target.value)
                  }
                  value={clientSearchTerms[client._id] || ""}
                />
              )}

              {/* Add/View Buttons */}
              <div className="flex justify-between items-center mb-6">
                <button
                  className="text-blue-600 hover:underline focus:outline-none"
                  onClick={() => toggleProjectModal(client._id)}
                >
                  + Add New Project
                </button>
                <button
                  className="text-blue-600 hover:underline focus:outline-none"
                  onClick={() => navigate(`/client/${client._id}/projects`)}
                >
                  View Projects
                </button>
              </div>

              {/* Services List */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {client && Array.isArray(client.projectId) ? (
                  sortAndFilterProjects(client.projectId, client._id).map(
                    (service, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
                        onClick={() =>
                          navigate(`/client/${client._id}/projects`)
                        }
                      >
                        {/* Service Header */}
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-md font-semibold text-gray-800">
                            {service.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                              service.projectStatus
                            )}`}
                          >
                            {service.projectStatus}
                          </span>
                        </div>

                        {/* Service Details */}
                        <p className="text-sm text-gray-700">
                          {service.description}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          Service Type: {service.serviceType}
                        </p>
                        <p className="text-xs text-gray-600">
                          Company Name: {client.company}
                        </p>
                        <p className="text-xs text-gray-600">
                          Created On:{" "}
                          {new Date(service.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-600">
                    No services available.
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Modals */}
      <AddClientModal
        isOpen={isClientModalOpen}
        onClose={toggleClientModal}
        onAddClient={handleAddClient}
      />
      <NewMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={toggleMeetingModal}
        onAddMeeting={handleAddMeeting}
      />
      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => toggleProjectModal()}
        onAddProject={handleAddProject}
        clientId={addProjectToClient}
      />
    </div>
  );
};

export default MeetingManagement;
