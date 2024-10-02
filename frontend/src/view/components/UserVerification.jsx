import { useState, useEffect } from "react";
import { useAuth } from '../../context/Context'; // Import the useAuth hook
import { dummyUser } from "../../services/dummy";

const UserVerificationList = () => {
  const { user } = useAuth();
  // console.log(user);

  // Ensure user object has an id and is in an array format.
  const [users, setUsers] = useState([]);

  // Use useEffect to initialize the users state with the user object if available
  useEffect(() => {
    if (user) {
      // Adding a default `id` if the user object doesn't have one (for demo purposes)
      const initializedUser = { ...user, id: user.id || 1, role: user.role || "Employee" };
      setUsers([initializedUser]);
    }
  }, [user]);

  const handleRoleChange = (id, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === id ? { ...u, role: newRole } : u
      )
    );
  };

  const handleVerify = (id) => {
    console.log(`User with ID ${id} has been verified.`);
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleCancel = (id) => {
    console.log(`Verification for user with ID ${id} has been cancelled.`);
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">User Verification Requests</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 shadow-lg rounded-md border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>

                {/* Dropdown for Role Selection */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Assign Role</label>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Developer Admin">Developer Admin</option>
                    <option value="Marketing Admin">Marketing Admin</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                {/* Dropdown for Team Selection */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Assign Team</label>
                  <select
                    value={user.team}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                  >
                    <option value="Developer Admin">Developer Team</option>
                    <option value="Marketing Admin">Marketing Team</option>
                  </select>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleVerify(user.id)}
                  className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleCancel(user.id)}
                  className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserVerificationList;
