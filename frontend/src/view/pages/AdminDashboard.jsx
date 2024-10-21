import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { dashboardService } from "../../services/dashboardService";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projectData: {},
    queryData: {},
    clientData: {},
    leadData: {},
    userData: {},
    connectionData: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getAdminDashboardData();
        console.log("Data:", data);
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  const {
    projectData,
    queryData,
    clientData,
    leadData,
    userData,
    connectionData,
  } = dashboardData;

  const projectChartData = projectData?.status
    ? [
        {
          name: "Pending",
          value: projectData.status.find((item) => item._id === "pending")?.count || 0,
        },
        {
          name: "Completed",
          value: projectData.status.find((item) => item._id === "completed")?.count || 0,
        },
        {
          name: "Ongoing",
          value: projectData.status.find((item) => item._id === "ongoing")?.count || 0,
        },
      ]
    : [];

  const queryChartData = queryData?.status
    ? [
        {
          name: "Responded",
          value: queryData.status.find((item) => item._id === "responded")?.count || 0,
        },
        {
          name: "Pending",
          value: queryData.status.find((item) => item._id === "pending")?.count || 0,
        },
      ]
    : [];

  const leadChartData = leadData?.stages
    ? leadData.stages.map((item) => ({
        name: item._id,
        value: item.count,
      }))
    : [];

  const userChartData = [
    { name: "Active", value: userData.active || 0 },
    { name: "Verify", value: userData.verify || 0 },
    { name: "Unverify", value: userData.unVerify || 0 },
  ];

  const COLORS = ["#FFA500", "#4CAF50", "#8884d8"];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={projectChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFA500" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2">Total Projects: {projectData.total || 0}</p>
        </div>

        {/* User Queries section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Queries</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={queryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {queryChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2">Total Queries: {queryData.total || 0}</p>
          <p>Today's Queries: {queryData.todayQueries || 0}</p>
        </div>

        {/* Clients Leads section */}
        <div className="bg-white p-4 rounded-lg shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4">Clients Leads</h2>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={leadChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leadChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2">Today's Leads: {leadData.todayLeads || 0}</p>
          <p>Total Indian Clients: {clientData.indian || 0}</p>
          <p>Total Foreign Clients: {clientData.foreigner || 0}</p>
          {/* <p>Converted Leads: {leadData.converted || 0}</p> */}
          <p>Lost Leads: {leadData.lost || 0}</p>
          <p>New Leads: {leadData.new || 0}</p>
          <p>Total Leads: {leadData.total || 0}</p>
        </div>

        {/* Users section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={userChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Connections section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Connections</h2>
          <p>Total Connections: {connectionData.total || 0}</p>
          <div className="mt-2">
            <h3 className="font-semibold">Last Two Connections:</h3>
            {(connectionData.data || []).map((connection, index) => (
              <div key={index} className="mt-1 p-2 border rounded">
                <p>Name: {connection.contactName}</p>
                <p>Phone: {connection.phoneNo}</p>
                <p>Company: {connection.companyName}</p>
                <p>Email: {connection.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
