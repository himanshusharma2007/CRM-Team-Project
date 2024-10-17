import React, { useState, useEffect } from "react";
import { FaUser, FaProjectDiagram, FaArrowRight } from "react-icons/fa";
import { SiGotomeeting } from "react-icons/si";

import { useParams } from "react-router-dom";
import { getClientById } from "../../services/clientServices";
import { getAllMeetingsByProjectId } from "../../services/meetingService";
import { useNavigate } from "react-router-dom";
import MeetingDetailModal from "../modal/MeetingDetailModal";

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
  const arrowClasses = {
    right: "w-8 h-1",
    down: "w-1 h-8",
  };

  return (
    <div
      className={`bg-gray-400 ${arrowClasses[direction]} ${className}`}
    ></div>
  );
};

const ClientMeetingThread = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [meetings, setMeetings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { id } = useParams();

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
      setError("Failed to fetch client data");
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clientData) return <div>No data available</div>;

  return (
    <div className="flex flex-col justify-center items-centerbg-gray-100">
      <h1 className="text-3xl text-center font-bold mb-10">
        {clientData.name}'s Project Thread
      </h1>
      <div className="flex-grow px-10 overflow-x-auto overflow-y-visible flex flex-row items-center">
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
          <Arrow className="flex-grow w-20" />
          <FaArrowRight className="size-7 ml-[-5px] text-gray-400" />
        </div>

        <div className="wraper flex flex-col items-start relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400"></div>
          <ul className="flex flex-col items-start space-y-20 relative">
            {clientData.projectId.map((project, index) => (
              <li
                key={project._id}
                className="flex flex-row items-center  w-full"
              >
                <div className="flex items-center w-full">
                  <div className="w-fit" /> {/* Spacer for alignment */}
                  <Arrow className="w-8" />
                  <FaArrowRight className="size-7 ml-[-5px] text-gray-400" />
                  <Shape
                    type="diamond"
                    content={
                      <div className="text-center">
                        <FaProjectDiagram className="text-green-500 text-xl mb-2 mx-auto" />
                        <h3 className="text-lg font-semibold">
                          {project.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {project.description}
                        </p>
                      </div>
                    }
                    className="bg-white w-32 h-32 ml-6"
                  />
                  <Arrow className="flex-grow ml-4 w-28" />
                  <FaArrowRight className="size-7 ml-[-2px] text-gray-400" />
                </div>
                <div className="flex items-center">
                  <div className="w-fit" /> {/* Spacer for alignment */}
                  <div className="flex ">
                    {meetings[project._id]?.map((meeting, mIndex) => (
                      <React.Fragment key={meeting._id}>
                        {mIndex > 0 && (
                          <>
                            <Arrow className="self-center h-[3px]" />
                            <FaArrowRight className=" self-center size-6 ml-[-4px] text-gray-400" />
                          </>
                        )}
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
                    ))}
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
