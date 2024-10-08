import { useState, useEffect } from "react";
import { getUnVerifiedUsers, verifyUser } from "../../services/authService";
import { getAllTeams } from "../../services/TeamService";

const UserVerificationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectTeam, setSelectTeam] = useState({});
  const [role, setRole] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    console.log("selectedTeam", JSON.stringify(selectTeam, null, 2)); // This gives a pretty printed JSON
  }, [selectTeam]);

  // Fetch unverified users on component mount
  const fetchUnverifiedUsers = async () => {
    try {
      const data = await getUnVerifiedUsers();
      const allTeams = await getAllTeams();
      setTeams(allTeams);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      setMessage("Error fetching users");
    }
  };
  
  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

  // Handle Verify button click (opens the modal and sets the selected user ID)
  const openModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Close the modal and clear fields
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectTeam({});
    setRole("");
    setSelectedUserId(null);
    setMessage(""); // Clear message when closing modal
  };

  // Handle user verification
  const handleVerify = async () => {
    if (!selectTeam || !selectedUserId || !role) {
      setMessage("Please fill all fields before verifying");
      return;
    }

    try {
      await verifyUser(selectedUserId, selectTeam._id, role); // Verify the user
      setUsers(users.filter((u) => u._id !== selectedUserId)); // Remove the verified user from the list
      setMessage("User verified successfully");
      fetchUnverifiedUsers();
      closeModal(); // Close modal and reset fields
    } catch (error) {
      console.error("Error verifying user:", error);
      setMessage("Error verifying user");
    }
  };

  // Handle sorting functionality
  const handleSort = (order) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (order === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setSortOrder(order);
    setUsers(sortedUsers);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Verification Panel</h2>

        {/* Alert Message */}
        {message && (
          <div className={`p-4 mb-4 text-white rounded-md ${message.includes("Error") ? 'bg-red-500' : 'bg-green-500'}`}>
            {message}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <label className="text-gray-700 font-semibold mr-2">Sort by:</label>
            <button
              onClick={() => handleSort("latest")}
              className={`px-4 py-2 rounded-l-md ${
                sortOrder === "latest"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              } hover:bg-blue-500`}
            >
              Latest
            </button>
            <button
              onClick={() => handleSort("oldest")}
              className={`px-4 py-2 rounded-r-md ${
                sortOrder === "oldest"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              } hover:bg-blue-500`}
            >
              Oldest
            </button>
          </div>
          {/* <div>
            <span className="text-gray-500">Filter: Not verified</span>
          </div> */}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold">{index + 1}</span>
                <div>
                  <p className="text-gray-800 font-semibold">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => openModal(user._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
              >
                Verify
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Verify User</h2>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Select Team:</label>
              <select 
                onChange={(e) => {
                  const selectedTeamId = e.target.value;
                  const selectedTeam = teams.find(team => team._id === selectedTeamId);
                  setSelectTeam(selectedTeam || {});
                }}
                value={selectTeam ? selectTeam._id : ""}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>

            {!selectTeam.leaderId && (
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Select Role:</label>
                <select onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">Select Role</option>
                  <option value="subAdmin">Leader</option>
                  <option value="emp">Member</option>
                </select>
              </div>
            )}

            <button
              onClick={handleVerify}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
            >
              Verify
            </button>
            <button
              onClick={closeModal}
              className="w-full mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerificationList;
