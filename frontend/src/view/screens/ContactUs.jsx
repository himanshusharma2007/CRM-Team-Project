import React, { useState } from "react";
import { submitContactUs } from "../../services/queryService";
import { useNavigate } from "react-router-dom";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message, subject } = formData;
    console.log("FormData in Contactus:", formData);
    submitContactUs(name, email, message, subject); // Call function to add query to the query page
    setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form after submit
    alert("Your Query has been Submitted");
    navigate("/");
  };

  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg mt-10 border border-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
        Contact Us
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-blue-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-blue-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-blue-700 font-semibold mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Subject of your message"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-blue-700 font-semibold mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your message"
            rows="5"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white text-lg font-semibold px-4 py-3 rounded-lg shadow-lg hover:bg-blue-800 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
