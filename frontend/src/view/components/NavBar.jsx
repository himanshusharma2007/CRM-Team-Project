import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { useAuth } from "../../context/Context";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, saveUser } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    saveUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            <Link to="/">CRM</Link>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-200 hover:text-blue-500 transition duration-300"
            >
              Home
            </Link>
            {/* <Link to="/dealform" className="text-gray-600 dark:text-gray-200 hover:text-blue-500 transition duration-300">
              Pipeline
            </Link>
            <Link to="/todo" className="text-gray-600 dark:text-gray-200 hover:text-blue-500 transition duration-300">
              Todo
            </Link> */}
            <Link
              to="/contactus"
              className="text-gray-600 dark:text-gray-200 hover:text-blue-500 transition duration-300"
            >
              Contact Us
            </Link>
            <Link
              to="/aboutus"
              className="text-gray-600 dark:text-gray-200 hover:text-blue-500 transition duration-300"
            >
              About Us
            </Link>
            {/* <Link to="/profile" className="text-gray-600 dark:text-gray-200 hover:text-blue-500 transition duration-300">
              Profile
            </Link> */}

            {user ? (
              <button
                onClick={handleLogout}
                className="block bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-200 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <Link
              to="/"
              className="block text-gray-600 dark:text-gray-200 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Home
            </Link>
            {/* <Link to="/dealform" className="block text-gray-600 dark:text-gray-200 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Pipeline
            </Link>
            <Link to="/todo" className="block text-gray-600 dark:text-gray-200 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Todo
            </Link> */}
            <Link
              to="/contactus"
              className="block text-gray-600 dark:text-gray-200 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Contact
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="block bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
