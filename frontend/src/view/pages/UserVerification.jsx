import { useState, useEffect } from "react";
import { useAuth } from "../../context/Context"; // Import the useAuth hook

const UserVerificationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  // console.log(user);

  // Ensure user object has an id and is in an array format.
  const [users, setUsers] = useState([]);

  // Use useEffect to initialize the users state with the user object if available
  useEffect(() => {
    if (user) {
      // Adding a default `id` if the user object doesn't have one (for demo purposes)
      const initializedUser = {
        ...user,
        id: user.id || 1,
        role: user.role || "Employee",
      };
      setUsers([initializedUser]);
    }
  }, [user]);

  const handleRoleChange = (id, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === id ? { ...u, role: newRole } : u))
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Verification Panel</h2>

        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="text-gray-700 font-semibold mr-2">Sort by:</label>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-l-md hover:bg-blue-600">
              Latest
            </button>
            <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400">
              Oldest
            </button>
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Filter:</label>
            <span className="ml-2 text-gray-500">not verified</span>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {/* Single Request */}
          {[1, 2, 3].map((request) => (
            <div
              key={request}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold">{request}</span>
                <div>
                  <p className="text-gray-800 font-semibold">Himanshu Sharma</p>
                  <p className="text-gray-600 text-sm">himanshu@gmail.com</p>
                </div>
              </div>
              <button
                onClick={openModal}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
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
            <h2 className="text-xl font-bold mb-4">Verify User</h2>

            <div className="mb-4">
              <label htmlFor="team" className="block text-gray-700">
                Select Team
              </label>
              <div className="flex items-center">
                <input
                  id="team"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select team"
                />
                <button className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                  +
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-700">
                Select Role
              </label>
              <input
                id="role"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Select role"
              />
            </div>

            <button
              onClick={closeModal}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Verify
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerificationList;
