import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reset } from "../../services/authService";

const ResetPassword = () => {
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        await reset(newPassword, oldPassword);
        alert("Password has been reset successfully!");
        navigate("/login");
      } catch (error) {
        alert("Failed to reset password. Please try again.", error);
      }
    } else {
      alert("Passwords do not match.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handlePasswordReset}>
          {/* Old Password */}
          <div className="mb-4">
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
