import { useState } from "react";
import AddClientModal from "../modal/AddClientModal";
import NewMeetingModal from "../modal/NewMeetingModal";
import AddProjectModal from "../modal/AddProjectModal";
import {
  FaPlus,
  FaPencilAlt,
  FaTrash,
  FaSave,
} from "react-icons/fa";

import {
  createMeeting,
  getMeetingById,
  getUpcomingMeetings,
  getAllMeetingsByProjectId,
  getAllMeetingsByStatus,
  updateMeeting,
} from "../../services/meetingService";

const MeetingManagement = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Client A",
      services: [
        {
          id: 1,
          serviceName: "Web App",
          date: "12-03-2024",
          category: "E-Com",
        },
        {
          id: 2,
          serviceName: "Mobile App",
          date: "10-04-2024",
          category: "Retail",
        },
      ],
    },
    {
      id: 1,
      name: "Client A",
      services: [
        {
          id: 1,
          serviceName: "Web App",
          date: "12-03-2024",
          category: "E-Com",
        },
        {
          id: 2,
          serviceName: "Mobile App",
          date: "10-04-2024",
          category: "Retail",
        },
      ],
    },
  ]);

  const teams = ["Team A", "Team B", "Team C"];
const [meetingData,setMeetingData]=useState({
  clientId: "",
  projectId: "",
  meetingDateTime: "",
  clientNotification:false,
  leaderNotification:false
})
  const toggleClientModal = () => setIsClientModalOpen(!isClientModalOpen);
  const toggleMeetingModal = () => setIsMeetingModalOpen(!isMeetingModalOpen);
  const toggleProjectModal = () => setIsProjectModalOpen(!isProjectModalOpen);

  const handleNameChange = (id, newName, type) => {
    if (type === "client") {
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === id ? { ...client, name: newName } : client
        )
      );
    }
  };

  const handleDelete = (id, type) => {
    if (type === "client") {
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );
    }
  };

  const EditableClientName = ({ client }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(client.name);

    const toggleEdit = () => {
      setIsEditing(!isEditing);
      if (isEditing && newName !== client.name) {
        handleNameChange(client.id, newName, "client");
      }
    };

    return (
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg shadow">
        {isEditing ? (
          <input
            type="text"
            className="text-lg font-semibold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Edit Client Name"
          />
        ) : (
          <span className="text-lg font-semibold">{client.name}</span>
        )}

        <div className="flex items-center">
          <button
            className="text-blue-500 hover:text-blue-700 ml-4"
            onClick={toggleEdit}
          >
            {isEditing ? <FaSave /> : <FaPencilAlt />}
          </button>

          <button
            className="text-red-500 hover:text-red-700 ml-4"
            onClick={() => handleDelete(client.id, "client")}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  };

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
          placeholder="Search..."
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
        />
        <div className="flex gap-3">
          <button className="w-36 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300">
            Filter
          </button>
          {/* Add Client Button */}
          <button
            onClick={toggleClientModal}
            className="bg-blue-600 text-nowrap text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <FaPlus /> Add A Client
          </button>
        </div>
      </div>

      {/* Sort Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <p className="mr-2 text-gray-700">Sort by:</p>
          <button className="mr-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300">
            Latest
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300">
            Oldest
          </button>
        </div>
      </div>

      {/* Client and Service Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow-md">
            {/* Editable Client Name */}
            <EditableClientName client={client} />

            {/* Button to Add Service */}
            <button
              onClick={toggleProjectModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-4 w-full flex items-center justify-center gap-2"
            >
              <FaPlus /> Add New Project
            </button>

            {/* Services */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {client.services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg mb-2 hover:shadow-md transition duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      {service.serviceName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {service.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Category: {service.category}
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
      />
      <NewMeetingModal
        isOpen={isMeetingModalOpen}
        toggleModal={toggleMeetingModal}
        setMeetingData={setMeetingData}
        meetingData={meetingData}
      />
      <AddProjectModal
        isOpen={isProjectModalOpen}
        toggleModal={toggleProjectModal}
        teams={teams}
      />
    </div>
  );
};

export default MeetingManagement;
