import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaProjectDiagram,
  FaArrowRight,
  FaCalendarPlus,
} from "react-icons/fa";
import { SiGotomeeting } from "react-icons/si";

import { useParams } from "react-router-dom";
import { getClientById } from "../../services/clientServices";
import { getAllMeetingsByProjectId } from "../../services/meetingService";
import { useNavigate } from "react-router-dom";
import MeetingDetailModal from "../modal/MeetingDetailModal";
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useToast } from "../../context/ToastContext";

const Shape = ({ type, content, className, onClick }) => {
  const shapeClasses = {
    circle: "rounded-full",
    diamond: "transform rotate-45",
    rectangle: "rounded-lg",
  };

  return (
    <div
      className={`${shapeClasses[type]} ${className} flex items-center justify-center p-4 shadow-lg`}
      onClick={onClick}
    >
      <div className={type === "diamond" ? "transform -rotate-45" : ""}>
        {content}
      </div>
    </div>
  );
};

const Arrow = ({ direction = "right", className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-gray-400 w-32 h-1"></div>
      <FaArrowRight className="size-6 ml-[-4px] text-gray-400" />
    </div>
  );
};

const NoMeetingsCard = () => (
  <div className="bg-white w-60 h-36 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
    <FaCalendarPlus className="text-gray-400 text-3xl mb-2" />
    <h4 className="text-lg font-semibold text-gray-700">No meetings yet</h4>
    <p className="text-sm text-gray-500 text-center mt-1">
      Click to schedule a meeting
    </p>
  </div>
);

const ClientMeetingThread = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [meetings, setMeetings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { id } = useParams();

  const {showToast} = useToast()

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getClientById(id);
      setClientData(data);

      const meetingsData = {};
      for (const project of data.projectId) {
        const projectMeetings = await getAllMeetingsByProjectId(project._id);
        meetingsData[project._id] = projectMeetings;
      }
      setMeetings(meetingsData);
    } catch (err) {
      showToast("Failed to fetch client data", "error");
      console.error("Error fetching client data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleCloseModal = () => {
    setSelectedMeeting(null);
  };

  const handleMeetingUpdate = (updatedMeeting) => {
    setMeetings((prevMeetings) => {
      const updatedMeetings = { ...prevMeetings };
      for (const projectId in updatedMeetings) {
        updatedMeetings[projectId] = updatedMeetings[projectId].map((meeting) =>
          meeting._id === updatedMeeting._id ? updatedMeeting : meeting
        );
      }
      return updatedMeetings;
    });
  };

  if (loading) return <div><LoadingSpinner /></div>;
  if (error) return <div>Error: {error}</div>;
  if (!clientData) return <div>No data available</div>;

  return (
    <div className="flex flex-col justify-start items-center  min-h-screen w-full">
      <div className="w-full flex justify-center items-center ">
        <h1 className="text-3xl text-center font-bold ">
          {clientData.name}'s Project Thread
        </h1>
      </div>
      <div className="chart-container w-full px-10 overflow-x-auto overflow-y-hidden flex flex-row items-center  h-auto py-10 ">
        <div className="flex items-center w-80">
          <Shape
            type="circle"
            content={
              <div className="text-center">
                <FaUser className="text-blue-500 text-2xl mb-2 mx-auto" />
                <h2 className="text-xl font-semibold">{clientData.name}</h2>
                <p className="text-sm text-gray-600">{clientData.company}</p>
              </div>
            }
            className="bg-white w-40 h-40"
          />
          <Arrow className="ml-4" />
        </div>

        <div className="wrapper flex flex-col items-start relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400"></div>
          <ul className="flex flex-col items-start space-y-20 relative">
            {clientData.projectId.map((project, index) => (
              <li key={project._id} className="flex flex-row items-center">
                <div className="flex items-center justify-start">
                  <Arrow className="mr-6" />
                  <Shape
                    type="diamond"
                    content={
                      <div className="text-center">
                        <FaProjectDiagram className="text-green-500 text-xl mb-2 mx-auto" />
                        <h3 className="text-lg font-semibold">
                          {project.name}
                        </h3>
                       
                      </div>
                    }
                    className="bg-white w-32 h-32"
                  />
                  <Arrow className="ml-4" />
                </div>
                <div className="flex items-center">
                  <div className="flex ">
                    {meetings[project._id]?.length > 0 ? (
                      meetings[project._id].map((meeting, mIndex) => (
                        <React.Fragment key={meeting._id}>
                          {mIndex > 0 && <Arrow />}
                          <Shape
                            type="rectangle"
                            content={
                              <div className="flex flex-row justify-between">
                                <div className="flex flex-col space-y-2">
                                  <SiGotomeeting className="text-blue-500 text-lg mb-2" />
                                  <h4 className="text-sm font-semibold">
                                    {meeting.title}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    {new Date(
                                      meeting.meetingDateTime
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs px-2 h-5 flex items-center justify-center rounded-full ${
                                    meeting.meetingStatus === "pending"
                                      ? "bg-yellow-200 text-yellow-800"
                                      : meeting.meetingStatus === "cancelled"
                                      ? "bg-red-200 text-red-800"
                                      : "bg-green-200 text-green-800"
                                  }`}
                                >
                                  {meeting.meetingStatus}
                                </span>
                              </div>
                            }
                            className="bg-white w-60 h-36 cursor-pointer"
                            onClick={() => handleMeetingClick(meeting)}
                          />
                        </React.Fragment>
                      ))
                    ) : (
                      <NoMeetingsCard />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          onClose={handleCloseModal}
          onUpdate={handleMeetingUpdate}
        />
      )}
    </div>
  );
};

export default ClientMeetingThread;
