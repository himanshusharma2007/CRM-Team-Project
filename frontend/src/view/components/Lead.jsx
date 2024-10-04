import React, { useState, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Context";
import LeadFormModal from "./LeadFormModal";
import {
  AiFillEdit,
  AiFillCheckCircle,
  AiFillCloseCircle,
} from "react-icons/ai";
import { FaTrashCan } from "react-icons/fa6";
import {
  getAllLeads,
  createLead,
  updateStage,
} from "../../services/leadServices";

const initialStages = [
  { id: "New-Lead", title: "New Lead" },
  { id: "Need-Analysis", title: "Need Analysis" },
  { id: "Price", title: "Price" },
  { id: "Negotiation", title: "Negotiation" },
  { id: "Lead-Won", title: "Lead Won" },
  { id: "Lead-Lost", title: "Lead Lost" },
];

const Lead = () => {
  const [pipeline, setPipeline] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    contactName: "",
    phone: "",
    stage: "New-Lead",
    description: "",
    team: "",
  });
  const [stages, setStages] = useState(initialStages); // Editable stages array
  const [editingStage, setEditingStage] = useState(null); // For renaming stage
  const [tempTitle, setTempTitle] = useState(""); // Temporary storage for stage title during edit

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const leads = await getAllLeads();
      const groupedLeads = groupLeadsByStage(leads);
      setPipeline(groupedLeads);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to fetch leads. Please try again later.");
      setLoading(false);
    }
  };

  const groupLeadsByStage = (leads) => {
    return stages.reduce((acc, stage) => {
      acc[stage.id] = leads.filter((lead) => lead.stage === stage.id);
      return acc;
    }, {});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLead = await createLead(formData);
      setPipeline((prev) => ({
        ...prev,
        [formData.stage]: [...(prev[formData.stage] || []), newLead],
      }));
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error creating lead:", err);
      setError("Failed to create lead. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      companyName: "",
      contactName: "",
      phone: "",
      stage: "New-Lead",
      description: "",
      team: "",
    });
  };

  const onColumnDrop = async (dropResult, newStage) => {
    const { removedIndex, addedIndex, payload } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      const updatedPipeline = { ...pipeline };
      const lead = payload;

      // Remove from source column
      Object.keys(updatedPipeline).forEach((stage) => {
        updatedPipeline[stage] = updatedPipeline[stage].filter(
          (item) => item._id !== lead._id
        );
      });

      // Add to destination column
      updatedPipeline[newStage] = [
        ...updatedPipeline[newStage].slice(0, addedIndex),
        { ...lead, stage: newStage },
        ...updatedPipeline[newStage].slice(addedIndex),
      ];

      // Optimistically update the UI
      setPipeline(updatedPipeline);

      try {
        await updateStage(lead._id, { stage: newStage });
      } catch (err) {
        console.error("Error updating lead stage:", err);
        setError("Failed to update lead stage. Please try again.");
        fetchLeads(); // Revert change in case of error
      }
    }
  };

  const handleViewDetails = (lead) => {
    navigate(`/lead-details/${lead._id}`);
  };

  // Handle deleting a stage
  const handleDeleteStage = (stageId) => {
    alert("Sure! You want to delete Stage");
    setStages(stages.filter((stage) => stage.id !== stageId));
    const updatedPipeline = { ...pipeline };
    delete updatedPipeline[stageId];
    setPipeline(updatedPipeline);
  };

  // Handle adding a new stage
  const handleAddStage = () => {
    const newStage = { id: `Stage-${Date.now()}`, title: "New Stage" };
    setStages([...stages, newStage]);
    setPipeline({ ...pipeline, [newStage.id]: [] });
  };

  // Handle renaming a stage (Save functionality)
  const handleSaveStageName = (stageId) => {
    const updatedStages = stages.map((stage) =>
      stage.id === stageId ? { ...stage, title: tempTitle } : stage
    );
    setStages(updatedStages);
    setEditingStage(null);
  };

  // Handle canceling renaming a stage
  const handleCancelEdit = () => {
    setEditingStage(null);
  };

  const handleStartEditingStage = (stage) => {
    setEditingStage(stage.id);
    setTempTitle(stage.title); // Store the current title in tempTitle
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        CRM Pipeline
      </h1>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
        >
          Add New Lead
        </button>
        <button
          onClick={handleAddStage}
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300 ml-4"
        >
          Add Stage
        </button>
      </div>

      <div
        className="flex space-x-4 overflow-x-auto pb-4"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="w-64 bg-gray-50 p-4 rounded-lg shadow-md flex-shrink-0 flex flex-col"
            style={{ maxHeight: "100%" }}
          >
            {editingStage === stage.id ? (
              <div className="flex items-center justify-center space-x-1">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="text-lg font-semibold text-gray-800 w-40 h-10 outline-none p-2 border border-gray-300 rounded flex-1"
                />
                <span
                  className="text-green-600 cursor-pointer flex items-center justify-center "
                  onClick={() => handleSaveStageName(stage.id)}
                >
                  <AiFillCheckCircle size={20} />
                </span>
                <span
                  className="text-red-500 cursor-pointer flex items-center justify-center "
                  onClick={handleCancelEdit}
                >
                  <AiFillCloseCircle size={20} />
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {stage.title}
                </h2>
                <div className="flex space-x-2">
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => handleStartEditingStage(stage)}
                  >
                    <AiFillEdit size={20} />
                  </span>
                  <span
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteStage(stage.id)}
                  >
                    <FaTrashCan />
                  </span>
                </div>
              </div>
            )}

            <Container
              groupName="columns"
              onDrop={(dropResult) => onColumnDrop(dropResult, stage.id)}
              getChildPayload={(index) => pipeline[stage.id][index]}
              dragClass="shadow-lg"
              dropClass="bg-blue-100"
              style={{ flex: 1, overflowY: "auto" }}
            >
              {pipeline[stage.id]?.map((lead) => (
                <Draggable key={lead._id}>
                  <div className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg mb-2">
                    <p className="font-bold text-lg text-gray-700">
                      {lead.title}
                    </p>
                    <p className="text-gray-500">Company: {lead.companyName}</p>
                    <p className="text-gray-500">Contact: {lead.contactName}</p>
                    <p className="text-gray-500">Team: {lead.team}</p>
                    <button
                      onClick={() => handleViewDetails(lead)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      View Details
                    </button>
                    {(user.role === "marAdmin" || user.role === "devAdmin") && (
                      <button
                        onClick={() => {
                          /* Implement assign functionality */
                        }}
                        className="mt-2 ml-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                      >
                        Assign To Member
                      </button>
                    )}
                  </div>
                </Draggable>
              ))}
            </Container>
          </div>
        ))}
      </div>

      <LeadFormModal
        showModal={showModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setShowModal={setShowModal}
        resetForm={resetForm}
        stages={stages}
      />
    </div>
  );
};

export default Lead;
