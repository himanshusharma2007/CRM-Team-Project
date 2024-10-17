import React, { useState, useEffect } from "react";
import { getUnVerifiedUsers, verifyUser } from "../../services/authService";
import { getAllTeams } from "../../services/TeamService";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { getAllUsers } from "../../services/authService";

const permissionCategories = [
  "lead",
  "leadStage",
  "project",
  "team",
  "user",
  "client",
  "meeting",
  "connection",
  "query",
];

const permissionSchema = {
  lead: {
    create: false,
    update: false,
    delete: false,
    updateStage: false,
    read: false,
    requiredPermission: ["leadStage", "team"],
  },
  leadStage: {
    create: false,
    update: false,
    delete: false,
    read: false,
    requiredPermission: ["lead"],
  },
  project: {
    create: false,
    update: false,
    read: false,
    requiredPermission: ["client", "team"],
  },
  team: {
    create: false,
    update: false,
    removeParticipant: false,
    read: false,
    requiredPermission: ["user"],
  },
  user: {
    read: false,
    verifyAndAssignRoleAndTeam: false,
    requiredPermission: ["team"],
  },
  client: {
    create: false,
    update: false,
    delete: false,
    read: false,
    requiredPermission: ["lead", "project", "meeting"],
  },
  meeting: {
    create: false,
    update: false,
    read: false,
    requiredPermission: ["client", "project"],
  },
  connection: {
    create: false,
    update: false,
    delete: false,
    read: false,
  },
  query: {
    respond: false,
    read: false,
  },
};

const UserVerificationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectTeam, setSelectTeam] = useState({});
  const [role, setRole] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(permissionSchema);
  const [expandedCategories, setExpandedCategories] = useState({});

 useEffect(() => {
   console.log("selectedTeam", JSON.stringify(selectTeam, null, 2));
 }, [selectTeam]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [sortOption, setSortOption] = useState("name");
  const [roleFilter, setRoleFilter] = useState(""); // State for role filter

 const fetchUnverifiedUsers = async () => {
   setLoading(true);
   try {
     const data = await getUnVerifiedUsers();
     const allTeams = await getAllTeams();
     setTeams(allTeams);
     setUsers(data);
   } catch (error) {
     console.error("Error fetching unverified users:", error);
     setMessage("Error fetching users");
   } finally {
     setLoading(false);
   }
 };
  // Fetch unverified users and all teams on component mount
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

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const allUserData = await getAllUsers();
      setAllUsers(allUserData);
    } catch (error) {
      console.error("Error fetching all users:", error);
      setMessage("Error fetching all users");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
   fetchUnverifiedUsers();
 }, []);
  useEffect(() => {
    fetchUnverifiedUsers();
    fetchAllUsers();
  }, []);

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
    setMessage("");
  };

  // Handle user verification
  const handleVerify = async () => {
    if (!selectTeam || !selectedUserId ) {
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

  // Function to assign colors based on role
  const getRoleColor = (role) => {
    switch (role) {
      case "emp":
        return "bg-blue-500 text-white";
      case "subAdmin":
        return "bg-yellow-500 text-white";
      case "admin":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Filter users based on selected role
  const filteredUsers = allUsers.filter((user) => {
    if (roleFilter) {
      return user.role === roleFilter && user.verify; // Show only verified users matching the selected role
    }
    return user.verify; // Show all verified users if no filter is selected
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="space-y-8">
        {/* User Verification Section */}
        <div className="bg-white shadow-md rounded-lg w-full h-full p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          User Verification
        </h2>

        {message && (
          <div
            className={`p-4 mb-4 text-white rounded-md ${
              message.includes("Error") ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center relative">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleSort("latest")}
                className={`py-2 px-4 rounded-lg ${
                  sortOrder === "latest"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800"
                } transition duration-200`}
              >
                Latest
              </button>
              <button
                onClick={() => handleSort("oldest")}
                className={`py-2 px-4 rounded-lg ${
                  sortOrder === "oldest"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800"
                } transition duration-200`}
              >
                Oldest
              </button>
            </div>

            <ul className="space-y-4">
              {users.map((user, index) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow hover:shadow-lg transition duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-800">
                      {index + 1}.
                    </span>
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full m-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Verify User</h2>
        {/* All Users Section */}
        <div className="bg-slate-600 p-8 shadow-md rounded-lg h-96 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Verified Users
          </h2>

          {/* Sorting and Filtering Options */}
          <div className="flex justify-between mb-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-700 text-white py-2 px-3 rounded-md"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="subAdmin">Leader</option>
              <option value="emp">Member</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-700 text-white py-2 px-3 rounded-md"
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          {/* List of Verified Users */}
          <ul className="space-y-4">
            {filteredUsers
              .sort((a, b) => {
                if (sortOption === "name") {
                  return a.name.localeCompare(b.name);
                } else if (sortOption === "role") {
                  return a.role.localeCompare(b.role);
                } else if (sortOption === "date") {
                  return new Date(a.createdAt) - new Date(b.createdAt);
                }
                return 0;
              })
              .map((verifiedUser, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center bg-slate-700 p-4 rounded-md shadow-md hover:bg-slate-800 transition duration-200`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-white">{index + 1}.</span>
                    <div>
                      <p className="text-lg font-bold text-white">
                        {verifiedUser.name}
                      </p>
                      <p className="text-sm text-gray-300">{verifiedUser.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md ${getRoleColor(verifiedUser.role)}`}
                  >
                    {verifiedUser.role}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* Modal for Verification */}
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Verify User</h2>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Select Team:</label>
            <select
              onChange={(e) => {
                const selectedTeamId = e.target.value;
                const selectedTeam = teams.find(
                  (team) => team._id === selectedTeamId
                );
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

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Select Role:</label>
            <select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Role</option>
              <option value="subAdmin">Leader</option>
              <option value="emp">Member</option>
            </select>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-xl mb-2">Set Permissions</h3>
            <div className="max-h-[60vh] overflow-y-auto border border-gray-300 rounded-md p-4">
              {renderPermissionDropdowns()}
            </div>
          </div>

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
    </div>
  );
};

export default UserVerificationList;
