import { useState, useEffect } from "react";
import { getUnVerifiedUsers, verifyUser } from "../../services/authService";
import { getAllTeams } from "../../services/TeamService";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const UserVerificationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectTeam, setSelectTeam] = useState({});
  const [role, setRole] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    console.log("selectedTeam", JSON.stringify(selectTeam, null, 2)); // Debugging the selected team
  }, [selectTeam]);

  // Fetch unverified users on component mount
  const fetchUnverifiedUsers = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const data = await getUnVerifiedUsers();
      const allTeams = await getAllTeams();
      setTeams(allTeams);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      setMessage("Error fetching users");
    } finally {
      setLoading(false); // Set loading to false when data is fetched or if there's an error
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
      fetchUnverifiedUsers(); // Fetch users again to refresh the list
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
    <div className="flex flex-col  min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-md rounded-lg w-full h-full p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Verification</h2>

        {message && (
          <div className={`p-4 mb-4 text-white rounded-md ${message.includes("Error") ? 'bg-red-500' : 'bg-green-500'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center relative"><LoadingSpinner /></div>
        ) : (
          <>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleSort("latest")}
                className={`py-2 px-4 rounded-lg ${sortOrder === "latest" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"} transition duration-200`}
              >
                Latest
              </button>
              <button
                onClick={() => handleSort("oldest")}
                className={`py-2 px-4 rounded-lg ${sortOrder === "oldest" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"} transition duration-200`}
              >
                Oldest
              </button>
            </div>

            <ul className="space-y-4">
              {users.map((user, index) => (
                <li key={user._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow hover:shadow-lg transition duration-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-800">{index + 1}.</span>
                    <div>
                      <p className="text-gray-800 font-semibold">{user.name}</p>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(user._id)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 transition duration-200"
                  >
                    Verify
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

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
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition duration-200"
            >
              Verify
            </button>
            <button
              onClick={closeModal}
              className="w-full mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-200"
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
