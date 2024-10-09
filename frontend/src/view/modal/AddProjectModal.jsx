import React, { useState } from "react";

const AddServiceModal = ({ isOpen, toggleModal, teams }) => {
  // State variables
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [status, setStatus] = useState("");
  const [team, setTeam] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [description, setDescription] = useState("");

  // Reset form fields
  const resetForm = () => {
    setName("");
    setServiceType("");
    setStatus("");
    setTeam("");
    setHashtags("");
    setDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here (e.g., updating state in MeetingManagement)
    console.log("New Service Added:", { name, serviceType, status, team, hashtags, description });
    resetForm(); // Clear the form after submission
    toggleModal(); // Close the modal
  };

  const handleCancel = () => {
    resetForm(); // Clear the form when canceling
    toggleModal(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <div className="bg-white rounded-lg p-6 w-1/2">
    <h2 className="text-lg font-bold mb-4">Add New Service</h2>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      {/* First Row with Two Input Fields */}
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
          <label className="block text-sm font-semibold mb-1">Service Type</label>
          <input
            type="text"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>
      </div>

      {/* Second Row with Two Input Fields */}
      <div className="flex mb-4 space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-semibold mb-1">Status</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-semibold mb-1">Team</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
            required
          >
            <option value="" disabled>Select Team</option>
            {teams.map((t, index) => (
              <option key={index} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Third Row with Optional Input Fields */}
      <div className="flex mb-4 space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-semibold mb-1">Hashtags (optional)</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-semibold mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg resize-none"
            rows="1"
          />
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="mr-2 bg-gray-200 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add Service
        </button>
      </div>
    </form>
  </div>
</div>


  );
};

export default AddServiceModal;
