import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex overflow-hidden max-h-screen">
      {/* Sidebar Section */}
      <div className=" w-[20vw] h-[100dvh] text-white overflow-hidden max-h-screen hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <div className="w-full md:w-[80vw] bg-gray-100 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
