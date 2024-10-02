import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Context'; // Import the useAuth hook

const Profile = () => {
  const { user, loading } = useAuth(); // Get user data from context
  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate('/resetpassword'); // Navigate to the change password page
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
        <div className="text-red-500 text-xl font-semibold">No user data found. Please log in.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Profile</h1>
        <div className="space-y-6">
          {[
            { label: 'Name', value: user.userdata.name || "N/A" },
            { label: 'Email', value: user.userdata.email || "N/A" },
            { label: 'Role', value: user.userdata.role || "N/A" },
            { label: 'Team', value: user.userdata.team || 'N/A' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-600">{item.label}:</span>
              <span className="text-lg text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
