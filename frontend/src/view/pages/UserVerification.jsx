import React, { useState, useEffect } from "react";
import {
  getUnVerifiedUsers,
  verifyUser,
  getAllUsers,
  blockUser,
  updatePermissions,
  unblockUser
} from "../../services/authService";
import { getAllTeams } from "../../services/TeamService";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { FaCheck, FaTimes, FaUserShield } from 'react-icons/fa'; // Added icons

import { FaUserCheck, FaUserLock } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { MdVerified,MdBlock, MdClose, MdSecurity } from "react-icons/md";
import { FaCrown, FaUser } from "react-icons/fa";
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
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
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
  const [allUsers, setAllUsers] = useState([]);
  const [sortOption, setSortOption] = useState("name");
  const [roleFilter, setRoleFilter] = useState("");
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("verified");
  
  useEffect(()=> {

    fetchBlockedUser()
  }, [])
  const fetchBlockedUser = async () => {
    const allUsers = await getAllUsers()
    const block = allUsers.filter(user => user.isBlocked);
    setBlockedUsers(block)
  }
  useEffect(()=>{
    console.log("BLocked users", blockedUsers)
  }, [blockedUsers])
  useEffect(() => {
    console.log("selectedTeam", JSON.stringify(selectTeam, null, 2));
  }, [selectTeam]);

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
    fetchAllUsers();
  }, []);

  const openModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectTeam({});
    setRole("");
    setSelectedUserId(null);
    setMessage("");
    setPermissions(permissionSchema);
    setExpandedCategories({});
  };

  const handleVerify = async () => {
    if (!selectTeam || !selectedUserId) {
      setMessage("Please fill all fields before verifying");
      return;
    }

    try {
      await verifyUser(selectedUserId, selectTeam._id, role, permissions);
      setUsers(users.filter((u) => u._id !== selectedUserId));
      setMessage("User verified successfully");
      fetchUnverifiedUsers();
      fetchAllUsers();
      closeModal();
    } catch (error) {
      console.error("Error verifying user:", error);
      setMessage("Error verifying user");
    }
  };

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

  const openPermissionModal = (userId) => {
    const user = allUsers.find((u) => u._id === userId);
    console.log("permision modal called", user.permission);
    if (user) {
      setPermissions(user.permission); // Load current permissions
      setSelectedUserId(userId);
      setIsPermissionModalOpen(true);
    }
  };

  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSelectedUserId(null);
    setPermissions(permissionSchema);
  };

  const handleBlockUser = async (userId) => {
    console.log("handleBlockUser called");
    const confirmBlock = window.confirm("Do you want to block this user?");
    if (confirmBlock) {
      try {
        await blockUser(userId);
        setMessage("User blocked successfully");
        // Remove the blocked user from the list
        setUsers(users.filter((user) => user._id !== userId));
        fetchAllUsers(); // Refresh the user list
      } catch (error) {
        console.error("Error blocking user:", error);
        setMessage("Error blocking user");
      }
    }
  };
  const handleUnblockUser = async (userId) => {
    const confirmUnblock = window.confirm("Do you want to unblock this user?");
    if (confirmUnblock) {
      try {
        await unblockUser(userId);
        setMessage("User unblocked successfully");
        fetchBlockedUser();
      } catch (error) {
        console.error("Error unblocking user:", error);
        setMessage("Error unblocking user");
      }
    }
  };

  const handleUpdatePermissions = async () => {
    try {
      console.log("handle update permision called");
      await updatePermissions(selectedUserId, permissions);
      setMessage("User permissions updated successfully");
      closePermissionModal();
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating permissions:", error);
      setMessage("Error updating permissions");
    }
  };

  // Filter to show only unblocked verified users
  const filteredUsers = allUsers.filter(
    (user) => !user.isBlocked && user.verify
  );

  const handlePermissionChange = (category, permission) => {
    setPermissions((prevPermissions) => {
      const newPermissions = JSON.parse(JSON.stringify(prevPermissions));
      newPermissions[category][permission] =
        !newPermissions[category][permission];

      // Handle required permissions
      const requiredCategories =
        newPermissions[category].requiredPermission || [];
      const hasActivePermissions = Object.keys(newPermissions[category]).some(
        (perm) =>
          perm !== "requiredPermission" && newPermissions[category][perm]
      );

      requiredCategories.forEach((requiredCategory) => {
        newPermissions[requiredCategory].read = hasActivePermissions;
      });

      return newPermissions;
    });
  };

  const handleCategoryAllCheck = (category) => {
    setPermissions((prevPermissions) => {
      const newPermissions = JSON.parse(JSON.stringify(prevPermissions));
      const allChecked = Object.keys(newPermissions[category]).every(
        (perm) =>
          perm === "requiredPermission" || newPermissions[category][perm]
      );

      Object.keys(newPermissions[category]).forEach((perm) => {
        if (perm !== "requiredPermission") {
          newPermissions[category][perm] = !allChecked;
        }
      });

      // Handle required permissions
      const requiredCategories =
        newPermissions[category].requiredPermission || [];
      requiredCategories.forEach((requiredCategory) => {
        newPermissions[requiredCategory].read = !allChecked;
      });

      return newPermissions;
    });
  };

  const isPermissionDisabled = (category, permission) => {
    if (permission === "read") {
      for (const cat in permissions) {
        if (
          permissions[cat].requiredPermission?.includes(category) &&
          Object.keys(permissions[cat]).some(
            (perm) => perm !== "requiredPermission" && permissions[cat][perm]
          )
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const isCategoryAllChecked = (category) => {
    return Object.keys(permissions[category]).every(
      (perm) => perm === "requiredPermission" || permissions[category][perm]
    );
  };

  const renderPermissionDropdowns = () => {
    return permissionCategories.map((category) => (
      <div key={category} className="mb-4 border rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() =>
              setExpandedCategories((prev) => ({
                ...prev,
                [category]: !prev[category],
              }))
            }
            className="text-left font-semibold text-lg capitalize flex items-center focus:outline-none"
          >
            {category} Permissions
            <span className="ml-2">
              {expandedCategories[category] ? "▲" : "▼"}
            </span>
          </button>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isCategoryAllChecked(category)}
              onChange={() => handleCategoryAllCheck(category)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-sm">Select All</span>
          </label>
        </div>
        {expandedCategories[category] && (
          <div className="pl-4 grid grid-cols-2 gap-2">
            {Object.keys(permissions[category]).map((permission) => {
              if (permission !== "requiredPermission") {
                const isDisabled = isPermissionDisabled(category, permission);
                return (
                  <div
                    key={`${category}-${permission}`}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      id={`${category}-${permission}`}
                      checked={permissions[category][permission]}
                      onChange={() =>
                        handlePermissionChange(category, permission)
                      }
                      disabled={isDisabled}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label
                      htmlFor={`${category}-${permission}`}
                      className={`ml-2 capitalize ${
                        isDisabled ? "text-gray-400" : ""
                      }`}
                    >
                      {permission}
                    </label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="space-y-8">
    <div className="min-h-screen bg-gray-100 ">
      <div className="space-y-8 p-0 ">
        {/* User Verification Section */}
        <div className="bg-white shadow-lg rounded-lg w-full h-full p-8 overflow-y-auto border border-gray-200">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            User Verification
          </h2>

          {message && (
            <div
              className={`p-4 mb-4 text-white rounded-md ${
                message.includes("Error") ? "bg-red-600" : "bg-green-600"
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
                  className={`py-2 px-4 rounded-lg transition duration-200 ${
                  className={`py-2 px-4 rounded-lg flex items-center gap-2 ${
                    sortOrder === "latest"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  <BiSortAlt2 className="text-lg" />
                  Latest
                </button>
                <button
                  onClick={() => handleSort("oldest")}
                  
                  className={`py-2 px-4 rounded-lg flex items-center gap-2 ${
                    sortOrder === "oldest"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  <BiSortAlt2 className="text-lg" />
                  Oldest
                </button>
              </div>

              <ul className="space-y-4">
                {users.map((user, index) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow hover:shadow-lg transition duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-800">
                        {index + 1}.
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openModal(user._id)}
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 transition duration-200 flex items-center"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 transition duration-200 flex items-center gap-2"
                    >
                      <FaCheck className="mr-2" /> Verify
                      <MdVerified className="text-lg" />
                      Verify
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* All Users Section */}
        <div className="bg-slate-600 p-8 shadow-lg rounded-lg h-96 overflow-y-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-6">
            Verified Users
          </h2>
        {/* Users Management Section with Tabs */}
        <div className="bg-white p-8 shadow-lg rounded-lg">
          {/* Custom Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("verified")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "verified"
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaUserCheck className="text-lg" />
              Verified Users
            </button>
            <button
              onClick={() => setActiveTab("blocked")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "blocked"
                  ? "bg-red-600 text-white shadow-lg transform scale-105"
                  : "bg-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaUserLock className="text-lg" />
              Blocked Users
            </button>
          </div>

          {/* Sorting and Filtering Options */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-48">
                <BsFilter className="absolute left-3 top-3 text-gray-500" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-white text-gray-800 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="subAdmin">Leader</option>
                  <option value="emp">Member</option>
                </select>
              </div>
              <div className="relative w-full md:w-48">
                <BiSortAlt2 className="absolute left-3 top-3 text-gray-500" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-white text-gray-800 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="role">Sort by Role</option>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
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
                    <span className="text-lg font-semibold text-white">
                      {index + 1}.
                    </span>
                    <div>
                      <p className="text-lg font-bold text-white">
                        {verifiedUser.name}
                      </p>
                      <p className="text-sm text-gray-300">
                        {verifiedUser.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md ${getRoleColor(
                      verifiedUser.role
                    )}`}
                  >
                    {verifiedUser.role}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openPermissionModal(verifiedUser._id)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition duration-200 flex items-center"
                    >
                      <FaUserShield className="mr-2" /> Update Permissions
                    </button>
                    <button
                      onClick={() => handleBlockUser(verifiedUser._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500 transition duration-200 flex items-center"
                    >
                      <FaTimes className="mr-2" /> Block
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

          {/* Users List Section */}
          <div className="h-[calc(100vh-400px)] overflow-y-auto">
            <ul className="space-y-4">
              {(activeTab === "verified" ? filteredUsers : blockedUsers)
                .sort((a, b) => {
                  if (sortOption === "name") return a.name.localeCompare(b.name);
                  if (sortOption === "role") return a.role.localeCompare(b.role);
                  if (sortOption === "date")
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  return 0;
                })
                .map((user, index) => (
                  <li
                    key={user._id}
                    className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 rounded-full p-3">
                          <span className="text-xl font-semibold text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-800">
                              {user.name}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3 w-full md:w-auto justify-end">
                        {activeTab === "verified" ? (
                          <>
                            <button
                              onClick={() => openPermissionModal(user._id)}
                              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                            >
                              <MdVerified className="text-lg" />
                              Update Permissions
                            </button>
                            <button
                              onClick={() => handleBlockUser(user._id)}
                              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2"
                            >
                              <MdBlock className="text-lg" />
                              Block
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(user._id)}
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
                          >
                            <FaUserCheck className="text-lg" />
                            Unblock
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {/* Modal for Verification */}
        {isModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex top-0 items-center justify-center overflow-y-auto p-4 z-50 min-h-screen">
    <div 
      className="relative bg-white rounded-2xl shadow-2xl max-w-3xl max-h-[80vh] overflow-y-auto w-full m-4 transform transition-all duration-300 ease-in-out animate-fadeIn"
    >
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <MdVerified className="text-green-500 text-4xl mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">
            Verify User
          </h2>
        </div>
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-6">
        {/* Team Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Team
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                const selectedTeamId = e.target.value;
                const selectedTeam = teams.find(
                  (team) => team._id === selectedTeamId
                );
                setSelectTeam(selectedTeam || {});
              }}
              value={selectTeam ? selectTeam._id : ""}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">Choose a team...</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        {!selectTeam?.leaderId && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setRole("subAdmin")}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2
                  ${role === "subAdmin" 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                  }`}
              >
                <FaCrown className={`text-xl ${role === "subAdmin" ? "text-blue-500" : "text-gray-400"}`} />
                Leader
              </button>
              <button
                onClick={() => setRole("emp")}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2
                  ${role === "emp" 
                    ? "border-green-500 bg-green-50 text-green-700" 
                    : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                  }`}
              >
                <FaUser className={`text-xl ${role === "emp" ? "text-green-500" : "text-gray-400"}`} />
                Member
              </button>
            </div>
          </div>
        )}

        {/* Permissions Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Set Permissions</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MdSecurity className="text-lg" />
              Access Control
            </div>
          </div>
          <div className="max-h-[40vh] overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4 custom-scrollbar">
            {renderPermissionDropdowns()}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleVerify}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-500 
            active:bg-green-700 transition-all duration-200 transform hover:-translate-y-0.5
            flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <MdVerified className="text-xl" />
          Verify User
        </button>
        <button
          onClick={closeModal}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 
            active:bg-gray-300 transition-all duration-200 transform hover:-translate-y-0.5
            flex items-center justify-center gap-2"
        >
          <MdClose className="text-xl" />
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        {/* Modal for Updating Permissions */}
        {isPermissionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full m-4">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Update User Permissions
              </h2>

              <div className="mb-4">
                <h3 className="font-semibold text-xl mb-2">Set Permissions</h3>
                <div className="max-h-[30vh] overflow-y-auto border border-gray-300 rounded-md p-4">
                  {renderPermissionDropdowns()}
                </div>
              </div>
              <button
                onClick={handleUpdatePermissions}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition duration-200"
              >
                Update Permissions
              </button>
              <button
                onClick={closePermissionModal}
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

