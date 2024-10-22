import React, { useState, useEffect } from "react";
import { getUser } from "../../services/authService";
import { getTeamById } from "../../services/TeamService";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsFillPersonCheckFill } from "react-icons/bs";

// Custom Card Components
const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

// Custom Avatar Components
const Avatar = ({ children, className = "" }) => {
  return <div className={`relative inline-block ${className}`}>{children}</div>;
};

const AvatarFallback = ({ children, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-medium ${className}`}
    >
      {children}
    </div>
  );
};

function SubAdminDashboard() {
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        const team = await getTeamById(userData.teamId);
        setUser(userData);
        setTeamData(team);
        setParticipants(team.participants || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <MdAdminPanelSettings className="text-purple-500" />;
      case "leader":
        return <BsFillPersonCheckFill className="text-blue-500" />;
      default:
        return <FaUser className="text-green-500" />;
    }
  };

  if (!teamData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Team Overview Card */}
      <Card className="mb-6 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{teamData.teamName}</CardTitle>
            <div className="flex items-center space-x-2 text-gray-500 mt-2">
              <FaBriefcase className="h-4 w-4" />
              <span className="text-sm">{teamData.department}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 mt-1">
              <FaCalendarAlt className="h-4 w-4" />
              <span className="text-sm">
                Created: {new Date(teamData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <FaUsers className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-blue-700 font-medium">
              {participants.length} Members
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Team Members Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
      <div className="space-y-2">
        <h1 className="text-2xl text-center">Team Members</h1>
        {participants.map((participant) => (
          <Card key={participant._id} className=" ">
            <CardContent className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {participant.name}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 mt-1">
                  <FaEnvelope className="h-3 w-3" />
                  <p className="text-sm truncate">{participant.email}</p>
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {participant?.role || "Member"}
                  </span>
                  {participant.isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SubAdminDashboard;
