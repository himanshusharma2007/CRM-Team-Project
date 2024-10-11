import { useEffect, useState } from "react";
import { getAllProjects } from "../../services/projectService";
import { getAllClients } from "../../services/clientServices";

const NewMeetingModal = ({ isOpen, toggleModal, onAddMeeting }) => {
  const [allProjects, setAllProjects] = useState([]); // Projects state as an array
  const [allClients, setAllClients] = useState([]); // Clients state as an array

  // Fetch all projects
  const allProjectsfun = async () => {
    try {
      const projects = await getAllProjects();
      console.log("Fetched Projects: ", projects); // Log fetched projects
      setAllProjects(projects); // Set the fetched projects to state
    } catch (error) {
      console.error("Error fetching projects:", error.message);
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

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Schedule New Meeting</h2>

        {/* Client dropdown */}
        <select className="border border-gray-300 p-2 w-full rounded-lg mb-4">
          <option>Select A Client</option>
          {allClients.map((client, index) => (
            <option key={index} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        {/* Project dropdown */}
        <select className="border border-gray-300 p-2 w-full rounded-lg mb-4">
          <option>Select Project</option>
          {allProjects.map((project, index) => (
            <option key={index} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className="border border-gray-300 p-2 w-full rounded-lg mb-4"
        />

        {/* Notify checkboxes */}
        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <label>Notify Client via email</label>
        </div>

        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <label>Notify Team Leader via email</label>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={onAddMeeting} // Trigger `onAddMeeting` when clicking Schedule
          >
            Schedule
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={toggleModal} // Close the modal
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMeetingModal;
