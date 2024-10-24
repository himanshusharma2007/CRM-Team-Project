import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leadService } from "../../services/leadServices";
import { useAuth } from "../../context/Context";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

const LeadDetails = () => {
  const { updateLead, deleteLead, getLeadById } = leadService;
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [lead, setLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const {showToast} = useToast()

  const canReadLead = user?.role === "admin" || user?.permission?.lead?.read;
  const canUpdateLead = user?.role === "admin" || user?.permission?.lead?.update;
  const canDeleteLead = user?.role === "admin" || user?.permission?.lead?.delete;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (canReadLead) {
      fetchLeadDetails();
    } else {
      setLoading(false);
      showToast("You don't have permission to view lead details.", "error");
    }
  }, [isAuthenticated, canReadLead, id, navigate]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const data = await getLeadById(id);
      setLead(data);
    } catch (err) {
      console.error("Error fetching lead details:", err);
      showToast("Failed to fetch lead details. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLead((prevLead) => ({ ...prevLead, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!canUpdateLead) {
      alert("You don't have permission to update leads.");
      return;
    }
    try {
      setError(null);
      await updateLead(id, lead);
      setIsEditing(false);
      await fetchLeadDetails();
    } catch (err) {
      console.error("Error updating lead:", err);
      showToast("Failed to update lead. Please try again.", "error");
    }
  };

  const handleDelete = async () => {
    if (!canDeleteLead) {
      alert("You don't have permission to delete leads.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        setError(null);
        await deleteLead(id);
        navigate("/lead");
      } catch (err) {
        console.error("Error deleting lead:", err);
        showToast("Failed to delete lead. Please try again.", "error");
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!lead) {
    return <div className="text-center mt-8">Lead not found.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Lead Details - {lead.title}
      </h1>

      <div className="space-y-4">
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={lead.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="companyName"
              value={lead.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="contactName"
              value={lead.contactName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              value={lead.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={lead.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
            />
            <select
              name="stage"
              value={lead.currentStage}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="New-Lead">New Lead</option>
              <option value="Need-Analysis">Need Analysis</option>
              <option value="Price">Price</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Lead-Won">Lead Won</option>
              <option value="Lead-Lost">Lead Lost</option>
            </select>
          </>
        ) : (
          <>
            <p className="text-xl text-gray-700">
              <strong>Title:</strong> {lead.title}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Company Name:</strong> {lead.companyName}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Contact Name:</strong> {lead.contactName}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Phone:</strong> {lead.phone}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Email:</strong> {lead.email}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Description:</strong> {lead.description}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Current Stage:</strong> {lead.currentStage}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Team:</strong> {lead.team}
            </p>
            {/* <p className="text-xl text-gray-700">
              <strong>Assigned To:</strong>{" "}
              {lead.assignedTo?.name || "Not Assigned"}
            </p> */}
          </>
        )}
      </div>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => navigate("/lead")}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition duration-300"
        >
          Back to Leads
        </button>

        {canUpdateLead && (
          <>
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
              >
                Edit Lead
              </button>
            )}
          </>
        )}
        {canDeleteLead && (
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300"
          >
            Delete Lead
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadDetails;
