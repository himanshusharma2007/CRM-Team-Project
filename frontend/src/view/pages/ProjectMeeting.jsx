import { useParams } from 'react-router-dom';
import { getAllMeetingsByProjectId } from '../../services/meetingService';
import { useEffect, useState } from 'react';
import { FaCalendar, FaClock, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const ProjectMeeting = () => {
  const { id } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [sortOption, setSortOption] = useState("asc"); // Default to ascending

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const fetchedMeetings = await getAllMeetingsByProjectId(id);
        console.log('fetchedMeetings', fetchedMeetings)
        setMeetings(fetchedMeetings); 
        setFilteredMeetings(fetchedMeetings); 
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, [id]);

  useEffect(() => {
    const filtered = meetings.filter((meeting) =>
      meeting?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting?.meetingConclusion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOption === "asc") {
      filtered.sort((a, b) => new Date(a.meetingDateTime) - new Date(b.meetingDateTime));
    } else if (sortOption === "desc") {
      filtered.sort((a, b) => new Date(b.meetingDateTime) - new Date(a.meetingDateTime));
    }

    setFilteredMeetings(filtered);
  }, [meetings, searchTerm, sortOption]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className='text-center text-2xl font-bold mb-6'>Project Meeting Page</h1>

      {/* Search Input */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search meetings..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-2/3"
        />

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="asc">Sort by Date (Ascending)</option>
          <option value="desc">Sort by Date (Descending)</option>
        </select>
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredMeetings.map((meeting, index) => (
          <div 
            key={index} 
            className="p-4 bg-gradient-to-r from-blue-100 to-white rounded-xl border border-gray-200 shadow-xl relative overflow-hidden hover:shadow-2xl transition cursor-pointer"
          >
            <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {meeting?.meetingStatus}
            </span>
            <h3 className="text-2xl font-semibold mb-3 text-blue-700">
              {meeting?.title || "Untitled Meeting"}
            </h3>
            <p className="text-gray-600 flex items-center mb-2">
              <FaCalendar className="mr-2 text-blue-600" />
              {new Date(meeting?.meetingDateTime).toLocaleDateString()}
            </p>
            <p className="text-gray-600 flex items-center mb-2">
              <FaClock className="mr-2 text-blue-600" />
              {new Date(meeting?.meetingDateTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div className="mt-4 text-gray-700 font-light">
              {meeting?.meetingConclusion?.map((conclusion, index) => (
                <div key={index} className="flex items-center">
                  {conclusion.isCompleted ? (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  ) : (
                    <FaRegCircle className="text-red-500 mr-2" />
                  )}
                  <p>{conclusion.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMeeting;
