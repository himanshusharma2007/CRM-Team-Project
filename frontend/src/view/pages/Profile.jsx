import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Context"; // Import the useAuth hook
import { FaPencilAlt } from "react-icons/fa"; // Import the pencil icon from React Icons

const Profile = () => {
  const { user, loading } = useAuth(); // Get user data from context
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(user?.profilePic || ""); // State for profile picture
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChangePassword = () => {
    navigate("/resetpassword"); // Navigate to the change password page
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePic = async () => {
    if (selectedFile) {
      // Upload the file to your backend or cloud storage service
      // After successful upload, update the user's profile picture in your database and refresh the profile
      console.log("Profile picture updated:", selectedFile);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-xl font-semibold">
          No user data found. Please log in.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Profile
        </h1>
        <div className="flex flex-col items-center mb-8 relative group">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-500 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold mb-4 shadow-md">
              {getInitials(user.name)}
            </div>
          )}

          {/* Pencil Icon for Update */}
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
            <FaPencilAlt />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {/* <button
          onClick={handleUploadProfilePic}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-md mb-4"
        >
          Update Picture
        </button> */}
        <div className="space-y-6">
          {[
            { label: "Name", value: user.name || "N/A" },
            { label: "Email", value: user.email || "N/A" },
            { label: "Role", value: user.role || "N/A" },
            { label: "Team", value: user.team || "N/A" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2"
            >
              <span className="text-lg font-semibold text-gray-600">
                {item.label}:
              </span>
              <span className="text-lg text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleChangePassword}
            className="bg-gray-800 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-md"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
