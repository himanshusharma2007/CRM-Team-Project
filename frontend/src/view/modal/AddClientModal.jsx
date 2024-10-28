import { useState } from "react";
import { useToast } from "../../context/ToastContext";

const AddClientModal = ({ isOpen, onClose, onAddClient }) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata"); // Default to IST
  const { showToast } = useToast();
  // Indian timezone options
  const timezones = [
    { value: "", label: "-- Select Time Zone --" },
    { value: "Asia/Kolkata", label: "Asia/Kolkata" },
    { value: "Asia/Delhi", label: "Asia/Delhi (same as Asia/Kolkata)" },
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "America/New_York (Eastern Time)" },
    {
      value: "America/Los_Angeles",
      label: "America/Los_Angeles (Pacific Time)",
    },
    { value: "Europe/London", label: "Europe/London (GMT)" },
    { value: "Europe/Paris", label: "Europe/Paris (CET)" },
    { value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
    { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
    { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
    { value: "Asia/Seoul", label: "Asia/Seoul (KST)" },
    { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong (HKT)" },
    { value: "Australia/Sydney", label: "Australia/Sydney (AET)" },
    { value: "Australia/Melbourne", label: "Australia/Melbourne (AET)" },
    { value: "Africa/Cairo", label: "Africa/Cairo (EET)" },
    { value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST)" },
    { value: "America/Chicago", label: "America/Chicago (CST)" },
    { value: "America/Denver", label: "America/Denver (MST)" },
    { value: "America/Sao_Paulo", label: "America/Sao_Paulo (BRT)" },
    {
      value: "America/Argentina/Buenos_Aires",
      label: "America/Argentina/Buenos_Aires (ART)",
    },
    { value: "Europe/Moscow", label: "Europe/Moscow (MSK)" },
    { value: "Europe/Istanbul", label: "Europe/Istanbul (TRT)" },
    { value: "Asia/Tehran", label: "Asia/Tehran (IRST)" },
    { value: "Asia/Karachi", label: "Asia/Karachi (PKT)" },
    { value: "Asia/Dhaka", label: "Asia/Dhaka (BST)" },
    { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB)" },
    { value: "Pacific/Auckland", label: "Pacific/Auckland (NZST)" },
    { value: "Indian/Mauritius", label: "Indian/Mauritius (MUT)" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddClient({
        name,
        company,
        phone,
        email,
        location,
        timeZone, // Adding timezone to the client data
      });
      onClose();
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Client email already exists"
      ) {
        showToast(
          "Client email already exists. Please use a different email.",
          "error"
        );
      } else {
        showToast("An error occurred. Please try again.", "error");
      }
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Add New Client Form */}
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
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Location"
              className="border border-gray-300 p-2 rounded-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
          >
            Save Client
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
