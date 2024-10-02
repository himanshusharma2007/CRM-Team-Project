import Sidebar from "../Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Section */}
      <div className="w-1/4 bg-gray-800 text-white min-h-screen hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 bg-gray-100 p-4">{children}</div>
    </div>
  );
};

export default Layout;
