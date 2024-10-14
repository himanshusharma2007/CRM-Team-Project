import { useState, useEffect } from "react";
import { leadService } from "../../services/leadServices";
import { createClient } from "../../services/clientServices";

const AddClientModal = ({ isOpen, onClose }) => {
  const [isAddClientView, setIsAddClientView] = useState(true);
  const [leads, setLeads] = useState([]);
  const [clientData, setClientData] = useState({});
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const toggleView = () => setIsAddClientView(!isAddClientView);

  useEffect(() => {
    const fetchLeads = async () => {
      const data = await leadService.getAllLeads();
      setLeads(data);
    };
    fetchLeads();
    console.log("leads", leads);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await createClient({
      name,
      company,
      phone,
      email,
      location,
    });
    console.log("data", data);

  };
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
            onClick={onClose}
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 p-2 rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Company"
                className="border border-gray-300 p-2 rounded-lg"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone"
                className="border border-gray-300 p-2 rounded-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 p-2 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                className="border border-gray-300 p-2 rounded-lg w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
          <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            {/* Select Lead Dropdown */}
            <div>
              <label
                htmlFor="lead"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Lead
              </label>
              <select
                id="lead"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Lead</option>
                {leads.map((lead, index) => (
                  <option key={index} value={lead.id}>
                    {lead.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition duration-300"
            >
              Fetch Client from Lead
            </button>
          </form>
        )}

        <div className="flex justify-center mt-4">
          <button
            className="text-red-500 hover:underline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
