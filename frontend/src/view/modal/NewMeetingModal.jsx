import { useEffect, useState } from "react";
import { getAllProjects, getProjectByClientId } from "../../services/projectService";
import { getAllClients } from "../../services/clientServices";

const NewMeetingModal = ({ isOpen, onClose, onAddMeeting }) => {
  const [allProjects, setAllProjects] = useState([]); // Projects state as an array
  const [allClients, setAllClients] = useState([]); // Clients state as an array

  // New state variables for meeting data
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [meetingDateTime, setMeetingDateTime] = useState("");
  const [notifyClient, setNotifyClient] = useState(false);
  const [notifyTeamLeader, setNotifyTeamLeader] = useState(false);

  const [filteredProjects, setFilteredProjects] = useState([]);

  // New state for meeting title
  const [meetingTitle, setMeetingTitle] = useState("");

  // Fetch all projects
  const allProjectsfun = async () => {
    try {
      const projects = await getAllProjects();
      console.log("Fetched All Projects: ", projects);
      setAllProjects(projects);
    } catch (error) {
      console.error("Error fetching all projects:", error.message);
    }
  };

  // Fetch all clients
  const allClientsfun = async () => {
    try {
      const clients = await getAllClients();
      console.log("Fetched Clients: ", clients); // Log fetched clients
      setAllClients(clients); // Set the fetched clients to state
    } catch (error) {
      console.error("Error fetching clients:", error.message);
    }
  };

  // New function to fetch projects by client ID
  const fetchProjectsByClient = async (clientId) => {
    if (!clientId) {
      setFilteredProjects([]);
      return;
    }
    try {
      const projects = await getProjectByClientId(clientId);
      console.log("Fetched Projects for Client: ", projects);
      setFilteredProjects(projects);
    } catch (error) {
      console.error("Error fetching projects for client:", error.message);
      setFilteredProjects([]);
    }
  };

  // Fetch projects and clients on component mount
  useEffect(() => {
    allProjectsfun();
    allClientsfun();
  }, []);

  // Log whenever allProjects or allClients is updated
  useEffect(() => {
    console.log("Updated All Projects: ", allProjects);
    console.log("Updated All Clients: ", allClients);
  }, [allProjects, allClients]);

  // New useEffect to fetch projects when a client is selected
  useEffect(() => {
    if (selectedClient) {
      fetchProjectsByClient(selectedClient);
    } else {
      setFilteredProjects([]);
    }
  }, [selectedClient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const meetingData = {
      clientId: selectedClient,
      projectId: selectedProject,
      dateTime: meetingDateTime,
      notifyClient,
      notifyTeamLeader,
      title: meetingTitle, // Add the title to the meeting data
    };
    onAddMeeting(meetingData);
    onClose();
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    setSelectedProject(""); // Reset selected project when client changes
  };

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Schedule New Meeting</h2>

        <form onSubmit={handleSubmit}>
          {/* Add the new input field for meeting title */}
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded-lg mb-4"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Meeting Title"
            required
          />

          <select
            className="border border-gray-300 p-2 w-full rounded-lg mb-4"
            value={selectedClient}
            onChange={handleClientChange}
            required
          >
            <option value="">Select A Client</option>
            {allClients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 p-2 w-full rounded-lg mb-4"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            required
            disabled={!selectedClient}
          >
            <option value="">Select Project</option>
            {filteredProjects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="border border-gray-300 p-2 w-full rounded-lg mb-4"
            value={meetingDateTime}
            onChange={(e) => setMeetingDateTime(e.target.value)}
            required
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={notifyClient}
              onChange={(e) => setNotifyClient(e.target.checked)}
            />
            <label>Notify Client via email</label>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={notifyTeamLeader}
              onChange={(e) => setNotifyTeamLeader(e.target.checked)}
            />
            <label>Notify Team Leader via email</label>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Schedule
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMeetingModal;
