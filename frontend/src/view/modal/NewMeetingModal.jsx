import React, { useEffect, useState } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";
import {
  getAllProjects,
  getProjectByClientId,
} from "../../services/projectService";
import { getAllClients } from "../../services/clientServices";

const NewMeetingModal = ({ isOpen, onClose, onAddMeeting }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [meetingDateTime, setMeetingDateTime] = useState("");
  const [notifyClient, setNotifyClient] = useState(false);
  const [notifyTeamLeader, setNotifyTeamLeader] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [conclusions, setConclusions] = useState([]);
  const [newConclusion, setNewConclusion] = useState("");
  const [isNewConclusionCompleted, setIsNewConclusionCompleted] =
    useState(false);
  const [showConclusionInput, setShowConclusionInput] = useState(true);

  const allProjectsFun = async () => {
    try {
      const projects = await getAllProjects();
      setAllProjects(projects);
    } catch (error) {
      console.error("Error fetching all projects:", error.message);
    }
  };

  const allClientsFun = async () => {
    try {
      const clients = await getAllClients();
      setAllClients(clients);
    } catch (error) {
      console.error("Error fetching clients:", error.message);
    }
  };

  const fetchProjectsByClient = async (clientId) => {
    if (!clientId) {
      setFilteredProjects([]);
      return;
    }
    try {
      const projects = await getProjectByClientId(clientId);
      setFilteredProjects(projects);
    } catch (error) {
      console.error("Error fetching projects for client:", error.message);
      setFilteredProjects([]);
    }
  };

  useEffect(() => {
    allProjectsFun();
    allClientsFun();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchProjectsByClient(selectedClient);
    } else {
      setFilteredProjects([]);
    }
  }, [selectedClient]);

  const handleAddConclusion = () => {
    if (newConclusion.trim()) {
      setConclusions([
        ...conclusions,
        { note: newConclusion.trim(), isCompleted: isNewConclusionCompleted },
      ]);
      setNewConclusion("");
      setIsNewConclusionCompleted(false);
      setShowConclusionInput(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const meetingData = {
      clientId: selectedClient,
      projectId: selectedProject,
      dateTime: meetingDateTime,
      notifyClient,
      notifyTeamLeader,
      title: meetingTitle,
      meetingConclusion: conclusions,
    };
    console.log("meetingData", meetingData);
    onAddMeeting(meetingData);

    // Reset modal fields
    setSelectedClient("");
    setSelectedProject("");
    setMeetingDateTime("");
    setNotifyClient(false);
    setNotifyTeamLeader(false);
    setMeetingTitle("");
    setConclusions([]);
    setNewConclusion("");
    setIsNewConclusionCompleted(false);
    setShowConclusionInput(true);

    onClose();
  };

  const handleOnClose = (e) =>{
    e.preventDefault();
    setSelectedClient("");
    setSelectedProject("");
    setMeetingDateTime("");
    setNotifyClient(false);
    setNotifyTeamLeader(false);
    setMeetingTitle("");
    setConclusions([]);
    setNewConclusion("");
    setIsNewConclusionCompleted(false);
    setShowConclusionInput(true);
    
    onClose();
  }

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    setSelectedProject("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Meeting</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded-lg"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Meeting Title"
            required
          />

          <select
            className="border border-gray-300 p-2 w-full rounded-lg"
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
            className="border border-gray-300 p-2 w-full rounded-lg"
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
            className="border border-gray-300 p-2 w-full rounded-lg"
            value={meetingDateTime}
            onChange={(e) => setMeetingDateTime(e.target.value)}
            required
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={notifyClient}
              onChange={(e) => setNotifyClient(e.target.checked)}
            />
            <label>Notify Client via email</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={notifyTeamLeader}
              onChange={(e) => setNotifyTeamLeader(e.target.checked)}
            />
            <label>Notify Team Leader via email</label>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Meeting Conclusions</h3>
            {conclusions.map((conclusion, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FaCheck
                  className={
                    conclusion.isCompleted ? "text-green-500" : "text-gray-300"
                  }
                />
                <span>{conclusion.note}</span>
              </div>
            ))}
            {showConclusionInput ? (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isNewConclusionCompleted}
                  onChange={(e) =>
                    setIsNewConclusionCompleted(e.target.checked)
                  }
                  className="mr-2"
                />
                <input
                  type="text"
                  value={newConclusion}
                  onChange={(e) => setNewConclusion(e.target.value)}
                  placeholder="Add a conclusion note"
                  className="flex-grow border border-gray-300 p-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddConclusion}
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConclusionInput(true)}
                className="flex items-center space-x-2 text-blue-500"
              >
                <FaPlus />{" "}
                <span>
                  {conclusions.length > 0
                    ? "Add another conclusion"
                    : "Add a conclusion"}
                </span>
              </button>
            )}
          </div>

          <div className="flex justify-center space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Create
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              onClick={handleOnClose}
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
