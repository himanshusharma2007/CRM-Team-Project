import { useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { dummyUser } from "../../services/dummy";
import { IoMdClose } from "react-icons/io";

const initialPipeline = {
  newLead: [],
  needAnalysis: [],
  proposal: [],
  negotiation: [],
  closedWon: [],
  closedLost: [],
};

const stages = [
  { id: "newLead", title: "New Lead" },
  { id: "needAnalysis", title: "Need Analysis" },
  { id: "proposal", title: "Proposal/Price Quote" },
  { id: "negotiation", title: "Negotiation/Review" },
  { id: "closedWon", title: "Closed Won" },
  { id: "closedLost", title: "Closed Lost" },
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingDealId, setEditingDealId] = useState(null);
  const [listModal, setListModal] = useState(false);
  const [teamListModal, setTeamListModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update existing deal
      const updatedPipeline = { ...pipeline };
      const oldStage = Object.keys(updatedPipeline).find((stageId) =>
        updatedPipeline[stageId].some((deal) => deal.id === editingDealId)
      );

      if (oldStage) {
        // Remove the deal from its old stage
        updatedPipeline[oldStage] = updatedPipeline[oldStage].filter(
          (deal) => deal.id !== editingDealId
        );

        // Add the updated deal to the new stage
        const updatedDeal = {
          id: editingDealId,
          name: formData.dealName,
          company: formData.companyName,
          contact: formData.contactName,
          description: formData.description,
          currentStage: formData.stage,
          team: formData.team,
        };

        updatedPipeline[formData.stage] = [
          ...updatedPipeline[formData.stage],
          updatedDeal,
        ];

        setPipeline(updatedPipeline);
      }
    } else {
      // Add new deal
      const newDeal = {
        id: Date.now().toString(),
        name: formData.dealName,
        company: formData.companyName,
        contact: formData.contactName,
        description: formData.description,
        currentStage: formData.stage,
        team: formData.team,
      };

      setPipeline((prevPipeline) => ({
        ...prevPipeline,
        [formData.stage]: [...prevPipeline[formData.stage], newDeal],
      }));
    }

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
    setIsEditing(false);
    setEditingDealId(null);
  };

  const handleEdit = (deal) => {
    setFormData({
      dealName: deal.name,
      companyName: deal.company,
      contactName: deal.contact,
      stage: deal.currentStage,
      description: deal.description,
    });
    setIsEditing(true);
    setEditingDealId(deal.id);
    setShowModal(true);
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

  const role = dummyUser[1].role;

  const handleAssign = () => {
    setListModal(true);
    setTeamListModal(true);
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
          Add New Deal
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
                  {pipeline[stage.id].map((deal) => (
                    <Draggable key={deal.id}>
                      <div className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-bold text-lg text-gray-700">
                          {deal.name}
                        </p>
                        <p className="text-gray-500">Company: {deal.company}</p>
                        <p className="text-gray-500">Contact: {deal.contact}</p>
                        <p className="text-gray-500">Team: {deal.team}</p>
                        <p className="text-green-500 font-semibold">
                          Amount: ${deal.amount}
                        </p>
                        {role === "admin" ? (
                          <>
                            <button
                              onClick={() => handleEdit(deal)}
                              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                            >
                              Edit
                            </button>
                          </>
                        ) : role === "marAdmin" || role === "devAdmin" ? (
                          <button
                            onClick={handleAssign}
                            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                          >
                            Assign To Employee
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
              {isEditing ? "Edit Deal" : "Add New Deal"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Deal Name
                </label>
                <input
                  type="text"
                  name="dealName"
                  value={formData.dealName}
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
                  {/* Add more teams as needed */}
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
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  {isEditing ? "Update Deal" : "Add Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {listModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setListModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            >
              <IoMdClose size={24} />
            </button>

            {/* Modal Header */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              List of Employees
            </h2>

            {/* Filtered List of Employees */}
            <ul className="space-y-3">
              {dummyUser
                .filter((user) => user.team === "developer")
                .map((user, index) => (
                  <li
                    key={index}
                    className="text-lg text-gray-700 bg-gray-100 p-3 rounded-md hover:bg-purple-100 transition-all duration-300"
                  >
                    {user.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lead;
