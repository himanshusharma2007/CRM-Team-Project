import { Link } from "react-router-dom";
import image from "../../assets/images/crm-home-stay-informed.svg";
import Navbar from "../components/Layout/NavBar";

const Landing = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 p-4">
        {/* Main container */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
          {/* Text Section */}
          <div className="flex-1 text-center md:text-left md:pr-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome to Our CRM Platform
            </h1>
            <p className="text-gray-700 mb-6 text-base md:text-lg">
              Explore our CRM platform designed to streamline your business
              operations. Discover tools, resources, and insights to help you
              manage relationships, boost productivity, and grow your business
              efficiently.
            </p>
            <Link
              to="/login"
              className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition duration-200 inline-block"
            >
              Get Started
            </Link>
          </div>

          {/* Image Section */}
          <div className="flex-1 mt-8 md:mt-0">
            <img
              src={image}
              alt="Stay Informed"
              className="w-full h-auto object-cover p-4 md:p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
