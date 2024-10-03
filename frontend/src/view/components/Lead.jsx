import { useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { useAuth } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { leads } from "./LeadDetails";

const initialPipeline = {
  newLead: [],
  needAnalysis: [],
  proposal: [],
  negotiation: [],
  leadWon: [],
  leadLost: [],
};

const stages = [
  { id: "newLead", title: "New Lead" },
  { id: "needAnalysis", title: "Need Analysis" },
  { id: "proposal", title: "Price" },
  { id: "negotiation", title: "Negotiation" },
  { id: "leadWon", title: "Lead Won" },
  { id: "leadLost", title: "Lead Lost" },
];

const Lead = () => {
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    dealName: "",
    companyName: "",
    contactName: "",
    stage: "newLead",
    description: "",
    team: "",
  });
  const [listModal, setListModal] = useState(false);

  const navigate = useNavigate();

  const user = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add new lead
    const newLead = {
      id: Date.now().toString(),
      name: formData.leadName,
      company: formData.companyName,
      contact: formData.contactName,
      description: formData.description,
      currentStage: formData.stage,
      team: formData.team,
    };

    setPipeline((prevPipeline) => ({
      ...prevPipeline,
      [formData.stage]: [...prevPipeline[formData.stage], newLead],
    }));

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      dealName: "",
      companyName: "",
      contactName: "",
      stage: "newLead",
      description: "",
    });
  };

  const onColumnDrop = (dropResult, stageId) => {
    const { removedIndex, addedIndex, payload } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      const updatedPipeline = { ...pipeline };
      const itemToMove = payload;

      // Remove from source column
      Object.keys(updatedPipeline).forEach((key) => {
        const index = updatedPipeline[key].findIndex(
          (item) => item.id === itemToMove.id
        );
        if (index !== -1) {
          updatedPipeline[key].splice(index, 1);
        }
      });

      // Add to destination column
      itemToMove.currentStage = stageId;
      updatedPipeline[stageId].splice(addedIndex, 0, itemToMove);

      setPipeline(updatedPipeline);
    }
  };

  const handleAssign = () => {
    setListModal(true);
  };

  const handleViewDetails = (lead) => {
    // Navigate to the LeadDetails page and pass the lead details
    navigate("/leadDetails");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
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
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="w-64 bg-gray-50 p-4 rounded-lg shadow-md flex-shrink-0"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {stage.title}
            </h2>
            <Container
              groupName="columns"
              onDrop={(dropResult) => onColumnDrop(dropResult, stage.id)}
              getChildPayload={(index) => pipeline[stage.id][index]}
              dragClass="shadow-lg"
              dropClass="bg-blue-100"
              render={(ref) => (
                <div ref={ref} className="space-y-4 h-96 overflow-y-auto">
                  {pipeline[stage.id].map((lead) => (
                    <Draggable key={lead.id}>
                      <div className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-bold text-lg text-gray-700">
                          {lead.name}
                        </p>
                        <p className="text-gray-500">Company: {lead.company}</p>
                        <p className="text-gray-500">Contact: {lead.contact}</p>
                        <p className="text-gray-500">Team: {lead.team}</p>
                        {/* <p className="text-green-500 font-semibold">
                          Amount: ${lead.amount}
                        </p> */}
                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(lead)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                          View Details
                        </button>

                        {/* Assign to member button */}
                        {user.role === "marAdmin" ||
                        user.role === "devAdmin" ? (
                          <button
                            onClick={handleAssign}
                            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                          >
                            Assign To Member
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Draggable>
                  ))}
                </div>
              )}
            />
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Add New Lead
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="dealName"
                  value={formData.leadName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Team
                </label>
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select a team</option>
                  <option value="marketing">Marketing</option>
                  <option value="developer">Developer</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
                >
                  Add Lead
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
