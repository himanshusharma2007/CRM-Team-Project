export const leads = [
  // 0
  {
    title: "Website Redesign Project",
    companyName: "Tech Innovations Inc.",
    contactName: "John Doe",
    phone: "555-1234",
    description:
      "Redesign the corporate website to improve user experience and integrate e-commerce features.",
    stage: "New-Lead",
    team: "6510f3b645f2c70012f8bcee",
    assignedTo: "6510f3b645f2c70012f8babc",
    createdAt: "2024-09-15T09:30:00Z",
    updatedAt: "2024-09-15T09:30:00Z",
  },
  //   1
  {
    title: "Mobile App Development",
    companyName: "GreenTech Solutions",
    contactName: "Jane Smith",
    phone: "555-9876",
    description:
      "Develop a mobile application for the company’s environmental monitoring system.",
    stage: "Need-Analysis",
    team: "6510f3b645f2c70012f8cdef",
    assignedTo: "6510f3b645f2c70012f8c123",
    createdAt: "2024-09-18T12:45:00Z",
    updatedAt: "2024-09-18T12:45:00Z",
  },
  //   2
  {
    title: "SEO and Digital Marketing Campaign",
    companyName: "Global Exports Ltd.",
    contactName: "David Lee",
    phone: "555-6543",
    description:
      "Implement an SEO strategy to increase online visibility and execute digital marketing campaigns.",
    stage: "Price",
    team: "6510f3b645f2c70012f8babc",
    assignedTo: "6510f3b645f2c70012f8bcdf",
    createdAt: "2024-09-20T08:20:00Z",
    updatedAt: "2024-09-22T10:05:00Z",
  },
  //   3
  {
    title: "Custom CRM Software",
    companyName: "FinTech Solutions",
    contactName: "Emily Johnson",
    phone: "555-7890",
    description:
      "Develop a custom CRM software tailored to financial institutions.",
    stage: "Negotiation",
    team: "6510f3b645f2c70012f8bcee",
    assignedTo: "6510f3b645f2c70012f8bcba",
    createdAt: "2024-09-25T11:15:00Z",
    updatedAt: "2024-09-29T14:30:00Z",
  },
  //   4
  {
    title: "E-commerce Platform Setup",
    companyName: "Fashion Hub",
    contactName: "Sarah Williams",
    phone: "555-3210",
    description:
      "Set up a fully integrated e-commerce platform for selling fashion items online.",
    stage: "Lead-Won",
    team: "6510f3b645f2c70012f8cdef",
    assignedTo: "6510f3b645f2c70012f8caaa",
    createdAt: "2024-09-10T14:50:00Z",
    updatedAt: "2024-09-28T16:30:00Z",
  },
  //   5
  {
    title: "ERP System Implementation",
    companyName: "Industrial Machinery Co.",
    contactName: "Michael Brown",
    phone: "555-4321",
    description:
      "Implement a company-wide ERP system to manage operations more efficiently.",
    stage: "Lead-Lost",
    team: "6510f3b645f2c70012f8babc",
    assignedTo: "6510f3b645f2c70012f8baba",
    createdAt: "2024-09-12T10:00:00Z",
    updatedAt: "2024-09-20T13:15:00Z",
  },
];

import { useLocation, useNavigate } from "react-router-dom";

const LeadDetails = () => {
  //   const location = useLocation();
  const navigate = useNavigate();
  const lead = leads[0];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Lead Details - {lead.title}
      </h1>

      <div className="space-y-4">
        <p className="text-xl text-gray-700">
          <strong>Company Name:</strong> {lead.companyName}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Contact Name:</strong> {lead.contactName}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Team:</strong> {lead.team}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Description:</strong> {lead.description}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Current Stage:</strong> {lead.stage}
        </p>
      </div>

      {/* Back to Leads Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/lead")}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition duration-300"
        >
          Back to Leads
        </button>
      </div>
    </div>
  );
};

export default LeadDetails;
