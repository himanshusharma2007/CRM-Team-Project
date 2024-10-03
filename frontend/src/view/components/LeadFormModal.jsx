import React from "react";

const LeadFormModal = ({
  showModal,
  formData,
  handleInputChange,
  handleSubmit,
  setShowModal,
  resetForm,
  stages,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Lead
        </h2>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
            resetForm(); // Optional reset of form after submission
          }}
        >
          {/* Title */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Company Name */}
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

          {/* Contact Name */}
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

          {/* Phone Number */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Stage */}
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

          {/* Team */}
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

          {/* Description */}
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

          {/* Buttons */}
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
  );
};

export default LeadFormModal;
