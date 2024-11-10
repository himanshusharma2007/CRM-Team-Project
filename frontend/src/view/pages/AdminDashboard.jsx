import { useState } from "react";
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

// Dummy data
const dummyData = {
  projectData: {
    total: 156,
    status: [
      { _id: "pending", count: 45 },
      { _id: "completed", count: 89 },
      { _id: "ongoing", count: 22 },
    ],
  },
  queryData: {
    total: 234,
    status: [
      { _id: "responded", count: 198 },
      { _id: "pending", count: 36 },
    ],
  },
  clientData: {
    total: 312,
    indian: 189,
    foreigner: 123,
    monthlyCounts: [
      { _id: { month: 1 }, count: 18 },
      { _id: { month: 2 }, count: 25 },
      { _id: { month: 3 }, count: 22 },
      { _id: { month: 4 }, count: 30 },
      { _id: { month: 5 }, count: 28 },
      { _id: { month: 6 }, count: 35 },
      { _id: { month: 7 }, count: 32 },
      { _id: { month: 8 }, count: 40 },
      { _id: { month: 9 }, count: 38 },
      { _id: { month: 10 }, count: 45 },
      { _id: { month: 11 }, count: 42 },
      { _id: { month: 12 }, count: 48 },
    ],
  },
  leadData: {
    total: 567,
    stages: [
      { _id: "Initial Contact", count: 145 },
      { _id: "Meeting Scheduled", count: 98 },
      { _id: "Proposal Sent", count: 156 },
      { _id: "Negotiation", count: 89 },
      { _id: "Closed Won", count: 79 },
    ],
    monthlyCounts: [
      { _id: { month: 1 }, count: 35 },
      { _id: { month: 2 }, count: 42 },
      { _id: { month: 3 }, count: 38 },
      { _id: { month: 4 }, count: 45 },
      { _id: { month: 5 }, count: 52 },
      { _id: { month: 6 }, count: 48 },
      { _id: { month: 7 }, count: 55 },
      { _id: { month: 8 }, count: 58 },
      { _id: { month: 9 }, count: 62 },
      { _id: { month: 10 }, count: 65 },
      { _id: { month: 11 }, count: 68 },
      { _id: { month: 12 }, count: 72 },
    ],
  },
  userData: {
    active: 178,
    verify: 145,
    unVerify: 34,
  },
  connectionData: {
    total: 890,
    data: [
      {
        contactName: "John Smith",
        phoneNo: "+1 (555) 123-4567",
        companyName: "Tech Solutions Inc.",
        email: "john.smith@techsolutions.com",
      },
      {
        contactName: "Sarah Johnson",
        phoneNo: "+1 (555) 987-6543",
        companyName: "Digital Innovations Ltd.",
        email: "sarah.j@digitalinnovations.com",
      },
    ],
  },
  teamData: {
    total: 42,
    department: [
      { _id: "Development", count: 12 },
      { _id: "Design", count: 8 },
      { _id: "Marketing", count: 6 },
      { _id: "Sales", count: 10 },
      { _id: "Support", count: 6 },
    ],
  },
};

const AdminDashboard = () => {
  const [dashboardData] = useState(dummyData);

  const {
    projectData,
    queryData,
    clientData,
    leadData,
    userData,
    connectionData,
    teamData,
  } = dashboardData;

  const projectChartData = [
    { name: "Pending", value: projectData.status[0].count },
    { name: "Completed", value: projectData.status[1].count },
    { name: "Ongoing", value: projectData.status[2].count },
  ];

  const queryChartData = [
    { name: "Responded", value: queryData.status[0].count },
    { name: "Pending", value: queryData.status[1].count },
  ];

  const stageLeadChartData = leadData.stages;

  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthLeadChartData = allMonths.map((month, index) => ({
    name: month,
    value: leadData.monthlyCounts[index].count,
  }));

  const clientDataChart = [
    { name: "Indian Clients", value: clientData.indian },
    { name: "Foreign Clients", value: clientData.foreigner },
  ];

  const monthClientChartData = allMonths.map((month, index) => ({
    name: month,
    value: clientData.monthlyCounts[index].count,
  }));

  const userChartData = [
    { name: "Active", value: userData.active },
    { name: "Verify", value: userData.verify },
    { name: "Unverify", value: userData.unVerify },
  ];

  // Modern color schemes
  const projectColors = ["#FF6B6B", "#4ECDC4", "#45B7D1"];
  const queryColors = ["#6C5CE7", "#FF8C00"];
  const clientColors = ["#00B894", "#0984E3"];
  const leadColors = ["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#FF8B94"];
  const userColors = ["#26DE81", "#4834D4", "#EB3B5A"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your business metrics</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Projects Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Projects</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value">
                  {projectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={projectColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-4 text-gray-600">Total Projects: {projectData.total}</p>
          </div>

          {/* Queries Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Queries</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={queryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {queryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={queryColors[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-4 text-gray-600">Total Queries: {queryData.total}</p>
          </div>

          {/* Leads Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Lead Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700">Monthly Leads</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthLeadChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6C5CE7"
                      strokeWidth={2}
                      dot={{ fill: '#6C5CE7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700">Lead Stages</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageLeadChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="count">
                      {stageLeadChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={leadColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="mt-4 text-gray-600">Total Leads: {leadData.total}</p>
          </div>

          {/* Clients Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Client Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700">Client Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={clientDataChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {clientDataChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={clientColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700">Monthly Client Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthClientChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0984E3"
                      strokeWidth={2}
                      dot={{ fill: '#0984E3' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-800">{clientData.total}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-semibold text-gray-800">{clientData.indian}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Foreign Clients</p>
                <p className="text-2xl font-semibold text-gray-800">{clientData.foreigner}</p>
              </div>
            </div>
          </div>

          {/* Teams Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Department Teams</h2>
            <div className="space-y-4">
              {teamData.department.map((dept, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: leadColors[index] }}></div>
                      <span className="font-medium text-gray-700 capitalize">
                        {dept._id}
                      </span>
                    </div>
                    <span className="bg-white text-gray-700 px-4 py-1 rounded-full text-sm shadow-sm">
                      {dept.count} {dept.count === 1 ? "team" : "teams"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Total Teams</p>
              <p className="text-2xl font-semibold text-gray-800">{teamData.total}</p>
            </div>
          </div>

          {/* Recent Connections Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Connections</h2>
            <div className="space-y-4">
              {connectionData.data.map((connection, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {connection.contactName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">{connection.contactName}</h3>
                      <p className="text-sm text-gray-600">{connection.companyName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {connection.phoneNo}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {connection.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Total Connections</p>
              <p className="text-2xl font-semibold text-gray-800">{connectionData.total}</p>
            </div>
          </div>

          {/* Users Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={userChartData} margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="value">
                  {userChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={userColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-800">{userData.active}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Verified Users</p>
                <p className="text-2xl font-semibold text-gray-800">{userData.verify}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Unverified Users</p>
                <p className="text-2xl font-semibold text-gray-800">{userData.unVerify}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;