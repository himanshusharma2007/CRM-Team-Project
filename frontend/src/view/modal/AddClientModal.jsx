import { useState } from "react";

const AddClientModal = ({ isOpen, toggleModal }) => {
  const [isAddClientView, setIsAddClientView] = useState(true);

  const toggleView = () => setIsAddClientView(!isAddClientView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isAddClientView ? "Add New Client" : "Fetch from Lead"}
          </h2>
          <button
            onClick={toggleModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Toggle View Buttons */}
        <div className="flex mb-6">
          <button
            className={`flex-1 px-4 py-2 font-semibold ${
              isAddClientView ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-l-lg transition-all`}
            onClick={() => setIsAddClientView(true)}
          >
            Add New Client
          </button>
          <button
            className={`flex-1 px-4 py-2 font-semibold ${
              !isAddClientView ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-r-lg transition-all`}
            onClick={() => setIsAddClientView(false)}
          >
            Fetch from Lead
          </button>
        </div>

        {/* Add New Client Form */}
        {isAddClientView ? (
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Company"
                className="border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone"
                className="border border-gray-300 p-2 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Save Client
            </button>
          </form>
        ) : (
          // Fetch from Lead Form
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Lead Name"
              className="border border-gray-300 p-2 w-full rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Fetch Client from Lead
            </button>
          </form>
        )}

        <div className="flex justify-center mt-4">
          <button
            className="text-red-500 hover:underline"
            onClick={toggleModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
