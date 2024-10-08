import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const teamsData = [
  { id: 1, name: 'Team A', department: 'Marketing' },
  { id: 2, name: 'Team B', department: 'Engineering' },
  { id: 3, name: 'Team C', department: 'Sales' },
];

const Teams = () => {
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDepartment, setNewTeamDepartment] = useState('');

  const handleSort = (order) => {
    console.log(`Sorting by ${order}`);
  };

  const handleViewTeam = (teamId) => {
    console.log(`Viewing team ${teamId}`);
  };

  const handleCreateTeam = () => {
    // Handle team creation logic here
    console.log('Team Name:', newTeamName);
    console.log('Team Department:', newTeamDepartment);
    // Close modal after team creation
    setShowModal(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Create New Team
        </button>
      </div>

      {/* Sort Options */}
      <div className="flex items-center mb-6">
        <span className="mr-4 text-gray-700">Sort by:</span>
        <button
          className="mr-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
          onClick={() => handleSort('latest')}
        >
          Latest
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
          onClick={() => handleSort('oldest')}
        >
          Oldest
        </button>
      </div>

      {/* Team List */}
      <div className="space-y-4">
        {teamsData.map((team) => (
          <div
            key={team.id}
            className="flex justify-between items-center p-4 border border-gray-300 rounded hover:shadow-lg"
          >
            <div className="flex space-x-4">
              <div className="text-[20px]">{team.id}</div>
              <div>
                <h2 className="text-lg font-semibold">{team.name}</h2>
                <p className="text-gray-600">{team.department}</p>
              </div>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => handleViewTeam(team.id)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg w-[400px] relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            {/* Modal Content */}
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
    </div>
  );
};

export default Teams;
