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
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
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
          value:
            projectData.status.find((item) => item._id === "pending")?.count ||
            0,
        },
        {
          name: "Completed",
          value:
            projectData.status.find((item) => item._id === "completed")
              ?.count || 0,
        },
        {
          name: "Ongoing",
          value:
            projectData.status.find((item) => item._id === "ongoing")?.count ||
            0,
        },
      ]
    : [];

  const queryChartData = queryData?.status
    ? [
        {
          name: "Responded",
          value:
            queryData.status.find((item) => item._id === "responded")?.count ||
            0,
        },
        {
          name: "Pending",
          value:
            queryData.status.find((item) => item._id === "pending")?.count || 0,
        },
      ]
    : [];

  const stageLeadChartData = leadData?.stages
    ? leadData.stages.map((item) => ({ name: item._id, value: item.count }))
    : [];

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthLeadChartData = allMonths.map((month, index) => {
    // Find if data for the current month exists in leadData
    const dataForMonth = leadData?.monthlyCounts.find(
      (item) => item._id.month === index + 1
    );

    // Return the month name and its count (or 0 if no data)
    return {
      name: month,
      value: dataForMonth ? dataForMonth.count : 0,
    };
  });

  const clientDataChart = [
    { name: "Indian Clients", value: clientData.indian || 0 },
    { name: "Foreigner Clients", value: clientData.foreigner || 0 },
  ];

  // Colors for the pie chart
  const colors = ["#4CAF50", "#FFA500"]; // Green for Indian, Orange for Foreigner

  const userChartData = [
    { name: "Active", value: userData.active || 0 },
    { name: "Verify", value: userData.verify || 0 },
    { name: "Unverify", value: userData.unVerify || 0 },
  ];

  const COLORS = ["#FFA500", "#4CAF50", "#8884d8"];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Projects Section */}
        <DashboardCard
          title="Projects"
          total={`Total Projects: ${projectData.total || 0}`}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={projectChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFA500" />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        {/* User Queries Section */}
        <DashboardCard
          title="User Queries"
          total={`Total Queries: ${queryData.total || 0}`}
          additionalInfo={`Today's Queries: ${queryData.todayQueries || 0}`}
        >
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
        </DashboardCard>

        {/* Clients Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Line Chart for Monthly Clients Data */}
            <ResponsiveContainer width="100%" height={200} className="mt-8">
              <LineChart data={monthLeadChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(tick) => (Number.isInteger(tick) ? tick : "")}
                />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

            {/* Pie Chart for Client Data */}
            <DashboardCard
              total={`Total Clients: ${clientData.total || 0}`}
            >
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={clientDataChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clientDataChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </div>

          {/* Client Totals */}
          <div className="">
            <p className="text-gray-600">
              Total Indian Clients: {clientData.indian || 0}
            </p>
            <p className="text-gray-600">
              Total Foreign Clients: {clientData.foreigner || 0}
            </p>
          </div>
        </div>

        {/*Leads Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Leads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthLeadChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(tick) => (Number.isInteger(tick) ? tick : "")}
                />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stageLeadChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(tick) => (Number.isInteger(tick) ? tick : "")}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-600">Total Leads: {leadData.total || 0}</p>
        </div>

        {/* Users Section */}
        <DashboardCard title="Users">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={userChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        {/* Recent Connections Section */}
        <RecentConnections
          connections={connectionData.data || []}
          totalConnections={connectionData.total || 0}
        />
      </div>
    </div>
  );
};

// Component for displaying individual dashboard cards
const DashboardCard = ({ title, total, additionalInfo, children }) => (
  <div className="bg-white">
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">{title}</h2>
    {children}
    {total && <p className="mt-2 text-gray-600">{total}</p>}
    {additionalInfo && <p className="mt-1 text-gray-600">{additionalInfo}</p>}
  </div>
);

// Component for displaying recent connections
const RecentConnections = ({ connections, totalConnections }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
      Recent Connections
    </h2>
    <p className="text-gray-600">Total Connections: {totalConnections}</p>
    <div className="mt-2">
      <h3 className="font-semibold text-gray-700">Last Two Connections:</h3>
      {connections.map((connection, index) => (
        <div
          key={index}
          className="mt-2 p-3 border rounded shadow-sm hover:shadow-lg transition-shadow"
        >
          <p className="text-gray-800 font-medium">
            Name: {connection.contactName}
          </p>
          <p className="text-gray-600">Phone: {connection.phoneNo}</p>
          <p className="text-gray-600">Company: {connection.companyName}</p>
          <p className="text-gray-600">Email: {connection.email}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
