import React, { useState, useEffect } from "react";
import { updateMeeting } from "../../services/meetingService";

const MeetingDetailModal = ({ meeting, onClose, onUpdate }) => {
  console.log("meeting modal open");
  const [editedMeeting, setEditedMeeting] = useState(meeting);

  useEffect(() => {
    setEditedMeeting(meeting);
  }, [meeting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "meetingDateTime") {
      // Convert the local datetime string to ISO format
      const isoDateTime = new Date(value).toISOString();
      setEditedMeeting((prev) => ({ ...prev, [name]: isoDateTime }));
    } else {
      setEditedMeeting((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedMeeting = await updateMeeting(
        editedMeeting._id,
        editedMeeting
      );
      onUpdate(updatedMeeting);
      onClose();
    } catch (error) {
      console.error("Failed to update meeting:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Meeting Details</h2>
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={editedMeeting.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="meetingDateTime"
            >
              Date and Time
            </label>
            <input
              type="datetime-local"
              id="meetingDateTime"
              name="meetingDateTime"
              value={
                editedMeeting.meetingDateTime
                  ? new Date(editedMeeting.meetingDateTime)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="meetingStatus"
            >
              Status
            </label>
            <select
              id="meetingStatus"
              name="meetingStatus"
              value={editedMeeting.meetingStatus}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingDetailModal;
