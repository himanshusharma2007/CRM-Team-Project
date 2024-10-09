const NewMeetingModal = ({ isOpen, toggleModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Schedule New Meeting</h2>
        
        <select className="border border-gray-300 p-2 w-full rounded-lg mb-4">
          <option>Select A Client</option>
          <option>Client A</option>
          <option>Client B</option>
        </select>

        <select className="border border-gray-300 p-2 w-full rounded-lg mb-4">
          <option>Select Project</option>
          <option>Project A</option>
          <option>Project B</option>
        </select>

        <input
          type="datetime-local"
          className="border border-gray-300 p-2 w-full rounded-lg mb-4"
        />

        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <label>Notify Client via email</label>
        </div>

        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <label>Notify Team Leader via email</label>
        </div>

        <div className="flex justify-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
            Schedule
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2" onClick={toggleModal}>
            Close
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default NewMeetingModal;
