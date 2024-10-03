import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaHandshake,
  FaUsers,
  FaLock,
} from "react-icons/fa";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { MdQueryBuilder } from "react-icons/md";
// import { dummyUser } from "../../services/dummy";
import { useAuth } from "../../context/Context";

const Sidebar = () => {
  // const role = dummyUser[0].role;
  const navigate = useNavigate();
  const { saveUser, user } = useAuth();
  console.log("user in sidebar:", user);

  const handleLogout = () => {
    logout();
    saveUser(null);
    navigate("/");
  };

  return (
    <>
      {user?.data.role === "admin" && (
        <AdminSidebar handleLogout={handleLogout} />
      )}
      {user?.data.role === "marAdmin" && (
        <SubAdminSidebar handleLogout={handleLogout} />
      )}
      {user?.data.role === "devAdmin" && (
        <SubAdminSidebar handleLogout={handleLogout} />
      )}
      {user?.data.role === "emp" && (
        <EmployeeSidebar handleLogout={handleLogout} />
      )}
    </>
  );
};

export default Sidebar;

const AdminSidebar = ({ handleLogout }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-gray-100 shadow-lg">
      {/* Sidebar Header */}
      <div className="p-5 text-center text-2xl font-semibold bg-gray-800">
        <span className="text-purple-400">CRM</span> Dashboard
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaUser className="mr-3" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/todo"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaClipboardList className="mr-3" />
              To-Do
            </Link>
          </li>
          <li>
            <Link
              to="/lead"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaHandshake className="mr-3" />
              Deal Form
            </Link>
          </li>
          <li className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700">
            <FaUsers className="mr-3" />
            <Link to="/contact">Contact</Link>
          </li>
          <li className=" flex items-center p-3 text-gray-300 rounded hover:bg-gray-700">
            <FaPersonCircleCheck className="mr-3" />
            <Link to="/userverification">User Verification</Link>
          </li>
          <li>
            <Link
              to="/resetpassword"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaLock className="mr-3" />
              Reset Password
            </Link>
          </li>
          <li>
            <Link
              to="/query"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <MdQueryBuilder className="mr-3" />
              Query
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const SubAdminSidebar = ({ handleLogout }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-gray-100 shadow-lg">
      {/* Sidebar Header */}
      <div className="p-5 text-center text-2xl font-semibold bg-gray-800">
        <span className="text-purple-400">CRM</span> Dashboard
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaUser className="mr-3" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/todo"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaClipboardList className="mr-3" />
              To-Do
            </Link>
          </li>
          <li>
            <Link
              to="/lead"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaHandshake className="mr-3" />
              Deal Form
            </Link>
          </li>
          <li className=" flex items-center p-3 text-gray-300 rounded hover:bg-gray-700">
            <FaPersonCircleCheck className="mr-3" />
            <Link to="/userverification">User Verification</Link>
          </li>
          <li>
            <Link
              to="/resetpassword"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaLock className="mr-3" />
              Reset Password
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const EmployeeSidebar = ({ handleLogout }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-gray-100 shadow-lg">
      {/* Sidebar Header */}
      <div className="p-5 text-center text-2xl font-semibold bg-gray-800">
        <span className="text-purple-400">CRM</span> Dashboard
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaUser className="mr-3" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/todo"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaClipboardList className="mr-3" />
              To-Do
            </Link>
          </li>
          <li>
            <Link
              to="/resetpassword"
              className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
            >
              <FaLock className="mr-3" />
              Reset Password
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
