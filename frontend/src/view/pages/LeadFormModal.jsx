
const LeadFormModal = ({
  showModal,
  formData,
  handleInputChange,
  handleSubmit,
  setShowModal,
  resetForm,
  stages,
}) => {
  console.log("Stages in Form Model:", stages);
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Lead
        </h2>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
            resetForm();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
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
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
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
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
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
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
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

            {/* Email (New Field) */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter email address"
                required
              />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter location"
                required
              />
            </div>

            {/* Stage */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
                Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select lead stage</option>
                {stages.map((stage) => (
                  <option
                    key={stage._id}
                    value={stage.stageName}
                    className="text-black"
                  >
                    {stage.stageName}
                  </option>
                ))}
              </select>
            </div>

            {/* Team */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
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
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
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
          </div>

          {/* Buttons */}
          <div className="space-x-4 text-right mt-6">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
