import React, { useState, useEffect, useRef } from "react";
// import { Container, Draggable } from "react-smooth-dnd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Context";
import LeadFormModal from "./LeadFormModal";
import {
  AiFillEdit,
  AiFillCheckCircle,
  AiFillCloseCircle,
} from "react-icons/ai";
import { FaTrashCan, FaPlus } from "react-icons/fa6";
import leadService from "../../services/leadServices";
import leadStageService from "../../services/leadStageService";
import LoadingSpinner from "../components/UI/LoadingSpinner";

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
    stageName: "",
    description: "",
    team: "",
  });
  const [stages, setStages] = useState([]);
  const [editingStage, setEditingStage] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const pipelineRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchStagesAndLeads();
  }, []);

  const fetchStagesAndLeads = async () => {
    try {
      setLoading(true);
      const [stagesData, leadsData] = await Promise.all([
        leadStageService.getStages(),
        leadService.getAllLeads(),
      ]);
      setStages(stagesData);
      const groupedLeads = groupLeadsByStage(leadsData, stagesData);
      setPipeline(groupedLeads);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  const groupLeadsByStage = (leads, stages) => {
    return stages.reduce((acc, stage) => {
      acc[stage.stageName] = leads.filter(
        (lead) => lead.currentStage === stage.stageName
      );
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
      const newLead = await leadService.createLead(formData);
      setPipeline((prev) => ({
        ...prev,
        [formData.stageName]: [...(prev[formData.stageName] || []), newLead],
      }));
      setShowModal(false);
      fetchStagesAndLeads();
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
      stageName: "",
      description: "",
      team: "",
    });
  };

  const onColumnDrop = async (dropResult, newStage) => {
    const { removedIndex, addedIndex, payload } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      const updatedPipeline = { ...pipeline };
      const lead = payload;

      const currentStage = Object.keys(updatedPipeline).find((stage) =>
        updatedPipeline[stage].some((item) => item._id === lead._id)
      );

      if (currentStage !== newStage) {
        Object.keys(updatedPipeline).forEach((stage) => {
          updatedPipeline[stage] = updatedPipeline[stage].filter(
            (item) => item._id !== lead._id
          );
        });

        updatedPipeline[newStage] = [
          ...updatedPipeline[newStage].slice(0, addedIndex),
          { ...lead, currentStage: newStage },
          ...updatedPipeline[newStage].slice(addedIndex),
        ];

        setPipeline(updatedPipeline);

        try {
          await leadService.updateStage(lead._id, newStage);
        } catch (err) {
          console.error("Error updating lead stage:", err);
          setError("Failed to update lead stage. Please try again.");
          fetchStagesAndLeads();
        }
      }
    }
  };

  const handleViewDetails = (lead) => {
    navigate(`/lead-details/${lead._id}`);
  };

  const handleDeleteStage = async (stageName) => {
    if (window.confirm("Are you sure you want to delete this stage?")) {
      try {
        await leadStageService.deleteStage(stageName);
        setStages(stages.filter((stage) => stage.stageName !== stageName));
        const updatedPipeline = { ...pipeline };
        delete updatedPipeline[stageName];
        setPipeline(updatedPipeline);
      } catch (err) {
        console.error("Error deleting stage:", err);
        setError("Failed to delete stage. Please try again.");
      }
    }
  };

  const handleAddStage = async () => {
    setShowAddStageModal(true);
  };

  const handleAddStageSubmit = async (e) => {
    e.preventDefault();
    try {
      const newStage = await leadStageService.addStage(newStageName);
      setStages([...stages, newStage]);
      setPipeline({ ...pipeline, [newStage.stageName]: [] });
      setShowAddStageModal(false);
      setNewStageName("");

      setTimeout(() => {
        if (pipelineRef.current) {
          pipelineRef.current.scrollLeft = pipelineRef.current.scrollWidth;
        }
      }, 100);
    } catch (err) {
      console.error("Error adding stage:", err);
      setError("Failed to add stage. Please try again.");
    }
  };

  const handleSaveStageName = async (oldStageName) => {
    try {
      await leadStageService.updateStage(oldStageName, tempTitle);
      const updatedStages = stages.map((stage) =>
        stage.stageName === oldStageName
          ? { ...stage, stageName: tempTitle }
          : stage
      );
      setStages(updatedStages);
      setEditingStage(null);

      const updatedPipeline = { ...pipeline };
      updatedPipeline[tempTitle] = updatedPipeline[oldStageName];
      delete updatedPipeline[oldStageName];
      setPipeline(updatedPipeline);
    } catch (err) {
      console.error("Error updating stage name:", err);
      setError("Failed to update stage name. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingStage(null);
  };

  const handleStartEditingStage = (stage) => {
    setEditingStage(stage.stageName);
    setTempTitle(stage.stageName);
  };

  return (
    <div className="relative p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        CRM Pipeline
      </h1>
      {user?.role === "admin" && (
        <div className="text-center mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 mr-4"
          >
            <FaPlus className="inline mr-2" /> Add New Lead
          </button>
          <button
            onClick={handleAddStage}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" /> Add Stage
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          ref={pipelineRef}
          className="flex space-x-4 overflow-x-auto pb-4"
          style={{ height: "calc(100vh - 200px)" }}
        >
          {stages.map((stage) => (
            <div
              key={stage.stageName}
              className="w-64 bg-gray-50 p-4 rounded-lg shadow-md flex-shrink-0 flex flex-col"
              style={{ maxHeight: "100%" }}
            >
              {editingStage === stage.stageName && user?.role === "admin" ? (
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="text-lg font-semibold text-gray-800 w-40 h-10 outline-none p-2 border border-gray-300 rounded flex-1"
                  />
                  <span
                    className="text-green-600 cursor-pointer flex items-center justify-center"
                    onClick={() => handleSaveStageName(stage.stageName)}
                  >
                    <AiFillCheckCircle size={20} />
                  </span>
                  <span
                    className="text-red-500 cursor-pointer flex items-center justify-center"
                    onClick={handleCancelEdit}
                  >
                    <AiFillCloseCircle size={20} />
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {stage.stageName}
                  </h2>
                  {user?.role === "admin" && (
                    <div className="flex space-x-2">
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => handleStartEditingStage(stage)}
                      >
                        <AiFillEdit size={20} />
                      </span>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteStage(stage.stageName)}
                      >
                        <FaTrashCan />
                      </span>
                    </div>
                  )}
                </div>
              )}

              <Container
                groupName="columns"
                onDrop={(dropResult) => onColumnDrop(dropResult, stage.stageName)}
                getChildPayload={(index) => pipeline[stage.stageName][index]}
                dragClass="shadow-lg"
                dropClass="bg-blue-100"
                style={{ flex: 1, overflowY: "auto" }}
              >
                {pipeline[stage.stageName]?.map((lead) => (
                  <Draggable key={lead._id}>
                    <div className="p-4 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 mb-2">
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
                    </div>
                  </Draggable>
                ))}
              </Container>
            </div>
          ))}
        </div>
      )}

      <LeadFormModal
        showModal={showModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setShowModal={setShowModal}
        resetForm={resetForm}
        stages={stages}
      />

      {showAddStageModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Add New Stage
            </h3>
            <form onSubmit={handleAddStageSubmit}>
              <input
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="Enter stage name"
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddStageModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Add Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lead;