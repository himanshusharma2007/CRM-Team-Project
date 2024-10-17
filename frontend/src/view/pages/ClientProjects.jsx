import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  FaSort,
  FaSearch,
  FaArrowLeft,
  FaCalendar,
  FaClock,
} from "react-icons/fa";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { getClientById } from "../../services/clientServices";
import { getProjectByClientId } from "../../services/projectService";
import { getAllMeetingsByProjectId } from "../../services/meetingService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ClientProjects = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientData, projectsData] = await Promise.all([
          getClientById(clientId),
          getProjectByClientId(clientId),
        ]);

        console.log("Projects:", projectsData);
        console.log("PRoject last: ", projectsData[0].lastMeetingId);

        setClient(clientData);
        setProjects(projectsData);
        setMeetings(projectsData);
      } catch (err) {
        setError("Error fetching data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const filteredAndSortedProjects = () => {
    let result = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      switch (sortOption) {
        case "dateAsc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "dateDesc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  };

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

  // Add this function to filter meetings with valid lastMeetingId
  const validMeetings = meetings.filter(meeting => meeting.lastMeetingId != null);

  if (loading)
    return (
      <div className="text-center mt-8">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate("/meetingmanagement")}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <FaArrowLeft className="mr-2" /> Back to Meeting Management
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {client?.name}'s Projects
      </h1>

      {/* Meetings Carousel */}
      <div className="mb-8">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          centerMode={true}
          centerSlidePercentage={50}
          className=""
          renderArrowPrev={(onClickHandler, hasPrev) => (
            <button
              onClick={onClickHandler}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition z-10"
            >
              <FaChevronLeft />
            </button>
          )}
          renderArrowNext={(onClickHandler, hasNext) => (
            <button
              onClick={onClickHandler}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition z-10"
            >
              <FaChevronRight />
            </button>
          )}
        >
          {validMeetings.map((meeting, index) => (
            <div key={index} className="p-4 text-left">
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-md mx-2 relative">
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  {meeting.name}
                </span>
                <h3 className="text-2xl font-bold mb-2 text-blue-600">{meeting.lastMeetingId.title || 'Untitled Meeting'}</h3>
                <p className="text-gray-700 flex items-center mb-2">
                  <FaCalendar className="mr-2 text-blue-500" />
                  {new Date(meeting.lastMeetingId.meetingDateTime).toLocaleDateString()}
                </p>
                <p className="text-gray-700 flex items-center mb-2">
                  <FaClock className="mr-2 text-blue-500" />
                  {new Date(meeting.lastMeetingId.meetingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="mt-2 text-gray-600">{meeting.description || 'No description available'}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <FaSort className="text-gray-400 mr-2" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="dateDesc">Date (Newest)</option>
            <option value="dateAsc">Date (Oldest)</option>
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProjects().map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {project.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    project.projectStatus
                  )}`}
                >
                  {project.projectStatus}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="text-sm text-gray-500">
                <p>Service Type: {project.serviceType}</p>
                <p>
                  Start Date: {new Date(project.startFrom).toLocaleDateString()}
                </p>
                <p>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientProjects;
