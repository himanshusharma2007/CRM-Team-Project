import React, { useState } from "react";

const AddClientModal = ({ isOpen, toggleModal, onAddClient }) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
    setLocation("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }
    onAddClient({ name, company, phone, email, location });
    resetForm();
    toggleModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <button
            onClick={toggleModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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

        <div className="flex justify-center mt-4">
          <button
            className="text-red-500 hover:underline"
            onClick={() => {
              resetForm();
              toggleModal();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
