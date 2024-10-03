import React from "react";
import { useAuth } from "../../context/Context";
const Dashboard = () => {
  const { user } = useAuth();
  console.log("User:", user);
  const role = user?.role;
  console.log(role);
  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "marAdmin" && <SubAdminDashboard />}
      {role === "devAdmin" && <SubAdminDashboard />}
      {role === "emp" && <EmployeeDashboard />}
    </>
  );
};

export default Dashboard;

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Statistics Cards */}
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold">Total Deals</h3>
              <p className="text-4xl font-bold">150</p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold">Active Tasks</h3>
              <p className="text-4xl font-bold">30</p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold">Closed Deals</h3>
              <p className="text-4xl font-bold">120</p>
            </div>
          </div>

          <div className="mt-8">
            {/* Table of Deals */}
            <h2 className="text-2xl font-bold mb-4">Recent Deals</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Deal Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">Website Redesign</td>
                    <td className="px-6 py-4">$5,000</td>
                    <td className="px-6 py-4">In Progress</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">SEO Optimization</td>
                    <td className="px-6 py-4">$3,000</td>
                    <td className="px-6 py-4">Completed</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Social Media Campaign</td>
                    <td className="px-6 py-4">$2,000</td>
                    <td className="px-6 py-4">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubAdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Top Section (Dashboard Header) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Dashboard
          </h1>
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
              Add New
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800">Total Sales</h3>
            <p className="text-2xl font-bold text-blue-500 mt-4">$24,500</p>
            <p className="text-sm text-gray-500 mt-2">Compared to last month</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Active Deals
            </h3>
            <p className="text-2xl font-bold text-red-500 mt-4">35</p>
            <p className="text-sm text-gray-500 mt-2">Current active deals</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <ul>
              <li className="flex justify-between items-center py-3 border-b">
                <span>Deal Closed by John Doe</span>
                <span className="text-gray-500">1 hour ago</span>
              </li>
              <li className="flex justify-between items-center py-3 border-b">
                <span>New User: Jane Smith</span>
                <span className="text-gray-500">2 hours ago</span>
              </li>
              <li className="flex justify-between items-center py-3">
                <span>Product Sale: CRM Pro</span>
                <span className="text-gray-500">3 hours ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Top Section (Dashboard Header) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Dashboard
          </h1>
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
              Add New
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800">Total Sales</h3>
            <p className="text-2xl font-bold text-blue-500 mt-4">$24,500</p>
            <p className="text-sm text-gray-500 mt-2">Compared to last month</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800">New Users</h3>
            <p className="text-2xl font-bold text-green-500 mt-4">1,200</p>
            <p className="text-sm text-gray-500 mt-2">Growth in users</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Active Deals
            </h3>
            <p className="text-2xl font-bold text-red-500 mt-4">35</p>
            <p className="text-sm text-gray-500 mt-2">Current active deals</p>
          </div>
        </div>
      </div>
    </div>
  );
};
