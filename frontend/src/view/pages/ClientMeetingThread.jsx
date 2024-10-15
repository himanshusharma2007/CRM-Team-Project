import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaProjectDiagram,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { getClientById } from "../../services/clientServices";
import { useParams } from "react-router-dom";
import {
  getAllMeetingsByProjectId,
  updateMeeting,
} from "../../services/meetingService";

const MeetingDetail = ({ meeting, onClose, onUpdate }) => {
  const [editedMeeting, setEditedMeeting] = useState(meeting);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMeeting((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMeeting(editedMeeting.id, editedMeeting);
      onUpdate(editedMeeting);
      onClose();
    } catch (error) {
      console.error("Failed to update meeting:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Meeting Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="meetingDateTime"
              value={editedMeeting.meetingDateTime}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="meetingStatus"
              value={editedMeeting.meetingStatus}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={editedMeeting.notes || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="3"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Meetings = ({ projectId }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const data = await getAllMeetingsByProjectId(projectId);
        console.log("Meetings:", data);
        setMeetings(data);
      } catch (err) {
        setError("Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [projectId]);

  const handleMeetingUpdate = (updatedMeeting) => {
    setMeetings(
      meetings.map((meeting) =>
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting
      )
    );
  };

  if (loading) return <div>Loading meetings...</div>;
  if (error) return <div>Error: {error}</div>;
  if (meetings.length === 0) return <div>No meetings scheduled</div>;

  return (
    <div className="ml-12 mt-2 w-[50%]">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-3 mb-2 cursor-pointer"
          onClick={() => setSelectedMeeting(meeting)}
        >
          <FaCalendarAlt className="text-purple-500 text-xl" />
          <div>
            <h4 className="text-md font-semibold">Meeting Title</h4>
            <p className="text-sm text-gray-600">
              {new Date(meeting.meetingDateTime).toLocaleString()}
            </p>
          </div>
          <div>
            <p
              className={`text-sm ml-52 p-1 rounded-xl text-gray-600 ${
                meeting.meetingStatus === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : meeting.meetingStatus === "cancelled"
                  ? "bg-red-200 text-red-800"
                  : meeting.meetingStatus === "completed"
                  ? "bg-green-200 text-green-800"
                  : "bg-orange-200 text-orange-800"
              }`}
            >
              {meeting.meetingStatus}
            </p>
          </div>
        </div>
      ))}
      {selectedMeeting && (
        <MeetingDetail
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          onUpdate={handleMeetingUpdate}
        />
      )}
    </div>
  );
};

const ClientMeetingThread = () => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        const data = await getClientById(id);
        console.log("Clients Data:", data);
        setClientData(data);
      } catch (err) {
        setError("Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clientData) return <div>No data available</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        {clientData.name}'s Project Thread
      </h1>
      <div className="flex items-start">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 mb-4">
          <FaUser className="text-blue-500 text-2xl" />
          <div>
            <h2 className="text-xl font-semibold">{clientData.name}</h2>
            <p className="text-gray-600">{clientData.company}</p>
          </div>
        </div>
      </div>
      {clientData.projectId.map((project) => (
        <div key={project.id} className="ml-8 mt-4">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 mb-4">
            <FaProjectDiagram className="text-green-500 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500">Status: {project.status}</p>
            </div>
          </div>
          <Meetings projectId={project._id} />
        </div>
      ))}
    </div>
  );
};

export default ClientMeetingThread;
