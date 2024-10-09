// AddProjectModal.jsx
import React, { useState } from "react";

const AddProjectModal = ({ isOpen, toggleModal, teams, onAddProject }) => {
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [teamIds, setTeamIds] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState(""); // This should be populated with actual client data

  const resetForm = () => {
    setName("");
    setServiceType("");
    setProjectStatus("");
    setTeamIds([]);
    setHashtags("");
    setDescription("");
    setClientId("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProject({
      name,
      description,
      serviceType,
      projectStatus,
      clientId,
      hashtags: hashtags.split(","),
      teamIds,
    });
    resetForm();
    toggleModal();
  };

  const handleCancel = () => {
    resetForm();
    toggleModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <h2 className="text-lg font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex mb-4 space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Service Type
              </label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex mb-4 space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Status</label>
              <input
                type="text"
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Team</label>
              <select
                multiple
                value={teamIds}
                onChange={(e) =>
                  setTeamIds(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              >
                {teams.map((t, index) => (
                  <option key={index} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex mb-4 space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Hashtags (optional)
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg resize-none"
                rows="1"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold mb-1">Client</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="mr-2 bg-gray-200 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
