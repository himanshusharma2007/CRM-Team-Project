import React, { useState, useEffect } from "react";
import { FaUser, FaProjectDiagram, FaCalendarAlt } from "react-icons/fa";
import { getClientById } from "../../services/clientServices";
import { useParams } from "react-router-dom";
import { getAllMeetingsByProjectId } from "../../services/meetingService";

const Meetings = ({ projectId }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading meetings...</div>;
  if (error) return <div>Error: {error}</div>;
  if (meetings.length === 0) return <div>No meetings scheduled</div>;

  return (
    <div className="ml-12 mt-2">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-3 mb-2"
        >
          <FaCalendarAlt className="text-purple-500 text-xl" />
          <div>
            <h4 className="text-md font-semibold">{meeting.title}</h4>
            <p className="text-sm text-gray-600">
              {new Date(meeting.date).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
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
        // This should be replaced with an actual API call
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
