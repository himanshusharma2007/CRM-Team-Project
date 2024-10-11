import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../../services/authService";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaHandshake,
  FaUsers,
} from "react-icons/fa";
import { FaCalendar } from "react-icons/fa6";
import { MdQueryBuilder, MdVerifiedUser } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi'
import { useAuth } from "../../../context/Context";
import logo from "../../../assets/images/logoDevPurple.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const { saveUser, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    saveUser(null);
    navigate("/");
  };

  return (
    <>
      {user?.role === "admin" && (
        <AdminSidebar handleLogout={handleLogout} location={location} />
      )}
      {user?.role === "subAdmin" && (
        <SubAdminSidebar handleLogout={handleLogout} location={location} />
      )}
   
      {user?.role === "emp" && (
        <EmployeeSidebar handleLogout={handleLogout} location={location} />
      )}
    </>
  );
};

export default Sidebar;

const AdminSidebar = ({ handleLogout, location }) => {
  return (
    <div className="flex flex-col h-[100dvh] max-h-screen w-full bg-gray-900 text-gray-100 shadow-lg">
      {/* Sidebar Header */}
      <div className="flex-shrink-0 p-4 bg-gray-900 flex justify-center">
        <img src={logo} alt="Logo Image" className="w-[150px] object-contain" />
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow overflow-y-auto p-4">
        <ul className="space-y-2">
          <SidebarItem
            to="/dashboard"
            icon={<FaHome />}
            text="Dashboard"
            location={location}
          />
          <SidebarItem
            to="/profile"
            icon={<FaUser />}
            text="Profile"
            location={location}
          />
          <SidebarItem
            to="/todo"
            icon={<FaClipboardList />}
            text="To-Do"
            location={location}
          />
          <SidebarItem
            to="/lead"
            icon={<FaHandshake />}
            text="Leads"
            location={location}
          />
          <SidebarItem
            to="/projects"
            icon={<FaHandshake />}
            text="Projects"
            location={location}
          />

          <SidebarItem
            to="/teams"
            icon={<HiOutlineUserGroup />}
            text="Teams"
            location={location}
          />

          <SidebarItem
            to="/meetingmanagement"
            icon={<FaCalendar />}
            text="Meetings"
            location={location}
          />
          <SidebarItem
            to="/connection"
            icon={<FaUsers />}
            text="Connection"
            location={location}
          />

          <SidebarItem
            to="/userverification"
            icon={<MdVerifiedUser />}
            text="User Verification"
            location={location}
          />
          <SidebarItem
            to="/query"
            icon={<MdQueryBuilder />}
            text="Query"
            location={location}
          />
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="flex-shrink-0 p-4">
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

// SidebarItem component to handle active state
const SidebarItem = ({ to, icon, text, location }) => {
  const isActive = location.pathname === to; // Check if current path matches

  return (
    <li>
      <NavLink
        to={to}
        className={`flex items-center p-3 space-x-2 rounded ${
          isActive
            ? "bg-gray-700 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
      >
        <div>{icon}</div>
        <div>{text}</div>
      </NavLink>
    </li>
  );
};

const SubAdminSidebar = ({ handleLogout, location }) => {
  return (
    <div className="flex flex-col h-[100dvh] max-h-screen w-full bg-gray-900 text-gray-100 shadow-lg">
      {/* Sidebar Header */}
      <div className="p-5 text-center text-2xl font-semibold bg-gray-800">
        <span className="text-purple-400">CRM</span> Dashboard
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <SidebarItem
            to="/dashboard"
            icon={<FaHome />}
            text="Dashboard"
            location={location}
          />
          <SidebarItem
            to="/profile"
            icon={<FaUser />}
            text="Profile"
            location={location}
          />
          <SidebarItem
            to="/todo"
            icon={<FaClipboardList />}
            text="To-Do"
            location={location}
          />
          <SidebarItem
            to="/lead"
            icon={<FaHandshake />}
            text="Leads"
            location={location}
          />
         
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

const EmployeeSidebar = ({ handleLogout, location }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-gray-100 shadow-lg">
      {/* Sidebar Header */}
      <div className="p-5 text-center text-2xl font-semibold bg-gray-800">
        <span className="text-purple-400">CRM</span> Dashboard
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <SidebarItem
            to="/dashboard"
            icon={<FaHome />}
            text="Dashboard"
            location={location}
          />
          <SidebarItem
            to="/profile"
            icon={<FaUser />}
            text="Profile"
            location={location}
          />
          <SidebarItem
            to="/todo"
            icon={<FaClipboardList />}
            text="To-Do"
            location={location}
          />
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
