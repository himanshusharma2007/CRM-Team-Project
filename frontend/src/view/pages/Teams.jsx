import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  createTeam,
  getAllTeams,
  getTeamById,
} from "../../services/TeamService";
import { useAuth } from "../../context/Context";

const Teams = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDepartment, setNewTeamDepartment] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const { user } = useAuth();

  const canCreateTeam = user?.role === "admin" || user?.permission?.team?.create;
  const canUpdateTeam = user?.role === "admin" || user?.permission?.team?.update;
  const canRemoveParticipant = user?.role === "admin" || user?.permission?.team?.removeParticipant;
  const canReadTeam = user?.role === "admin" || user?.permission?.team?.read;

  const fetchTeams = async () => {
    if (canReadTeam) {
      try {
        const teams = await getAllTeams();
        console.log("teams", teams);
        setTeamsData(teams);
      } catch (error) {
        console.log("Failed to fetch teams: ", error);
      }
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [canReadTeam]);

  const handleSort = (order) => {
    const sortedTeams = [...teamsData].sort((a, b) =>
      order === "latest"
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt)
    );
    setTeamsData(sortedTeams);
  };

  const handleViewTeam = async (teamId) => {
    if (canReadTeam) {
      try {
        console.log("teamId", teamId);
        const team = await getTeamById(teamId);
        console.log("team", team);
        setSelectedTeamMembers(team.participants || []);
        setShowMembersModal(true);
      } catch (error) {
        console.error(`Error viewing team ${teamId}:`, error);
      }
    }
  };

  const handleCreateTeam = async () => {
    if (canCreateTeam) {
      try {
        const newTeam = await createTeam(newTeamName, newTeamDepartment);
        setTeamsData((prevTeams) => [...prevTeams, newTeam]);
        setNewTeamName("");
        setNewTeamDepartment("");
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error creating team:", error);
      }
    }
  };

  const sortMembers = (members) => {
    const rolePriority = ["admin", "subAdmin"];
    return [...members].sort((a, b) => {
      const aIndex = rolePriority.indexOf(a.role);
      const bIndex = rolePriority.indexOf(b.role);
      return bIndex - aIndex;
    });
  };

  if (!canReadTeam) {
    return <div>You don't have permission to view teams.</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Teams</h1>
        {canCreateTeam && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowCreateModal(true)}
          >
            Create New Team
          </button>
        )}
      </div>

      <div className="flex items-center mb-6">
        <span className="mr-4 text-gray-700">Sort by:</span>
        <button
          className="mr-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
          onClick={() => handleSort("latest")}
        >
          Latest
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
          onClick={() => handleSort("oldest")}
        >
          Oldest
        </button>
      </div>

      <div className="space-y-4">
        {teamsData.map((team, index) => (
          <div
            key={team._id}
            className="flex justify-between items-center p-4 border border-gray-300 rounded hover:shadow-lg"
          >
            <div className="flex space-x-4">
              <div className="text-[20px]">{index + 1}</div>
              <div>
                <h2 className="text-lg font-semibold">{team.teamName}</h2>
                <p className="text-gray-600">{team.department}</p>
              </div>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => handleViewTeam(team._id)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {canCreateTeam && showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowCreateModal(false)}
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold mb-4">Create New Team</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Team Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Department</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={newTeamDepartment}
                onChange={(e) => setNewTeamDepartment(e.target.value)}
                placeholder="Enter department"
              />
            </div>

            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleCreateTeam}
            >
              Create Team
            </button>
          </div>
        </div>
      )}

      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200"
              onClick={() => setShowMembersModal(false)}
            >
              <FaTimes className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Team Members
            </h2>

            <ul className="space-y-4">
              {selectedTeamMembers && selectedTeamMembers.length > 0 ? (
                sortMembers(selectedTeamMembers).map((member) => (
                  <li
                    key={member._id}
                    className={`flex justify-between p-2 rounded-md transition duration-200 ${
                      member.role === "admin" || member.role === "subAdmin"
                        ? "bg-purple-200"
                        : "bg-gray-100"
                    } hover:bg-gray-200`}
                  >
                    <span className="text-gray-800 font-semibold">
                      {member.name}
                    </span>
                    <span className="text-gray-600">{member.role}</span>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-600">No members found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
