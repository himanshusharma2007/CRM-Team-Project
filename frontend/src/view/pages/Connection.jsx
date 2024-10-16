import React, { useState, useEffect } from "react";
import ConnectionService from "../../services/connectionService";
import { FiSearch } from "react-icons/fi";

function Connection() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    contactName: "",
    companyName: "",
    email: "",
    phoneNo: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phoneNo.includes(searchTerm)
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  const fetchContacts = async () => {
    try {
      const fetchedContacts = await ConnectionService.getcontact();
      console.log("Contacts in Connection Page:", fetchedContacts);
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact({ ...currentContact, [name]: value });
  };

  const handleAddOrUpdateContact = async () => {
    try {
      if (isEditing) {
        await ConnectionService.updateContact(
          currentContact._id,
          currentContact
        );
      } else {
        await ConnectionService.createContact(currentContact);
      }
      setModalOpen(false);
      setCurrentContact({
        contactName: "",
        companyName: "",
        email: "",
        phoneNo: "",
      });
      setIsEditing(false);
      fetchContacts(); // Refresh the contact list
    } catch (error) {
      console.error("Failed to add/update contact:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleEditContact = (contact) => {
    setCurrentContact(contact);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await ConnectionService.deleteContact(id);
        fetchContacts(); // Refresh the contact list
      } catch (error) {
        console.error("Failed to delete contact:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Connection</h1>
        <button
          onClick={() => {
            setCurrentContact({
              contactName: "",
              companyName: "",
              email: "",
              phoneNo: "",
            });
            setIsEditing(false);
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-blue-600"
        >
          + Add Connection
        </button>
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 pl-10 border rounded-md"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-500">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 md:px-4 py-2 border">Contact Name</th>
              <th className="px-2 md:px-4 py-2 border">Company Name</th>
              <th className="px-2 md:px-4 py-2 border">Email</th>
              <th className="px-2 md:px-4 py-2 border">Phone</th>
              <th className="px-2 md:px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact._id}>
                <td className="px-2 md:px-4 py-2 border">
                  {contact.contactName}
                </td>
                <td className="px-2 md:px-4 py-2 border">
                  {contact.companyName}
                </td>
                <td className="px-2 md:px-4 py-2 border">{contact.email}</td>
                <td className="px-2 md:px-4 py-2 border">{contact.phoneNo}</td>
                <td className="px-2 md:px-4 py-2 border">
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Connection" : "Add New Connection"}
            </h2>

            <input
              type="text"
              name="contactName"
              placeholder="Contact Name"
              className="w-full mb-2 p-2 border rounded"
              value={currentContact.contactName}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              className="w-full mb-2 p-2 border rounded"
              value={currentContact.companyName}
              onChange={handleInputChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full mb-2 p-2 border rounded"
              value={currentContact.email}
              onChange={handleInputChange}
            />

            <input
              type="tel"
              name="phoneNo"
              placeholder="Phone"
              className="w-full mb-4 p-2 border rounded"
              value={currentContact.phoneNo}
              onChange={handleInputChange}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleAddOrUpdateContact}
              >
                {isEditing ? "Update Connection" : "Add Connection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Connection;