import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Context"; // Import the useAuth hook
import { FaPencilAlt } from "react-icons/fa"; // Import the pencil icon from React Icons
import { uploadProfileImage } from "../../services/userService";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { getTeamById } from "../../services/TeamService";

const Profile = () => {
  const [team, setTeam] = useState({});
  const { user, loading } = useAuth(); // Get user data from context
  console.log("User:", user);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(""); // State for profile picture
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePic = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile); // Ensure the key matches the one in the backend
    setIsLoading(true); // Set loading state
    try {
      const result = await uploadProfileImage(formData); // Send formData instead of selectedFile
      if (result.success) {
        alert("Profile picture updated successfully");
        setProfileImage(result.imageUrl); // Ensure this is the correct URL
      } else {
        alert("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("An error occurred while uploading the profile picture.");
    }
    setIsLoading(false); // Reset loading state
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      const teamData = await getTeamById(user?.teamId);
      setTeam(teamData);
      // console.log("Team:", teamData);
    };
    fetchTeamData();
    if (user) {
      setProfileImage(user.profileImage || ""); // Set the initial profile image if user is defined
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
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
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full ">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Profile
        </h1>
        <div className="flex flex-col items-center mb-8 relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold mb-4 shadow-lg">
              {getInitials(user.name)}
            </div>
          )}

          {/* Static Pencil Icon for Update */}
          <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg">
            <FaPencilAlt className="text-xl" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <button
          onClick={handleUploadProfilePic}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-md mb-4"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Uploading..." : "Update Picture"}
        </button>
        <div className="space-y-6">
          {[
            { label: "Name", value: user.name || "N/A" },
            { label: "Email", value: user.email || "N/A" },
            { label: "Role", value: user.role || "N/A" },
            { label: "Team", value: team.teamName || "N/A" },
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
            className={`bg-gray-800 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Optionally disable the button while loading
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
