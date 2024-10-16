import React, { useState, useEffect } from "react";
import { FaUser, FaProjectDiagram, FaCalendarAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getClientById } from "../../services/clientServices";
import { getAllMeetingsByProjectId } from "../../services/meetingService";

const Shape = ({ type, content, className }) => {
  const shapeClasses = {
    circle: "rounded-full",
    diamond: "transform rotate-45",
    rectangle: "rounded-lg",
  };

  return (
    <div
      className={`${shapeClasses[type]} ${className} flex items-center justify-center p-4 shadow-lg`}
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
  const [clientData, setClientData] = useState(null);
  const [meetings, setMeetings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
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
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clientData) return <div>No data available</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl text-center font-bold mb-5">
        {clientData.name}'s Project Thread
      </h1>
      <div className="flex flex-row items-center  bg-red-500">
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
          <Arrow className="flex-grow mr-2" />
        </div>

        <div className="wraper flex flex-col items-start relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
        <ul className="flex flex-col items-start space-y-20 relative">
          {clientData.projectId.map((project, index) => (
            <li
              key={project._id}
              className="flex flex-row items-center  w-full"
            >
              <div className="flex items-center w-full">
                <div className="w-fit" /> {/* Spacer for alignment */}
                <Arrow className="w-8 mx-4" />
                <Shape
                  type="diamond"
                  content={
                    <div className="text-center">
                      <FaProjectDiagram className="text-green-500 text-xl mb-2 mx-auto" />
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="text-xs text-gray-600">
                        {project.description}
                      </p>
                    </div>
                  }
                  className="bg-white w-32 h-32"
                />
                <Arrow className="flex-grow mx-4" />
              </div>
              <div className="flex items-center">
                <div className="w-fit" /> {/* Spacer for alignment */}
                <div className="w-8" /> {/* Spacer for alignment */}
                <div className="mx-4" /> {/* Spacer for alignment */}
                <div className="flex space-x-4">
                  {meetings[project._id]?.map((meeting, mIndex) => (
                    <React.Fragment key={meeting._id}>
                      {mIndex > 0 && <Arrow className="self-center" />}
                      <Shape
                        type="rectangle"
                        content={
                          <div className="text-center">
                            <FaCalendarAlt className="text-purple-500 text-xl mb-2 mx-auto" />
                            <h4 className="text-md font-semibold">
                              {meeting.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {new Date(
                                meeting.meetingDateTime
                              ).toLocaleString()}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
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
                        className="bg-white w-32 h-40"
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
    </div>
  );
};

export default ClientMeetingThread;
