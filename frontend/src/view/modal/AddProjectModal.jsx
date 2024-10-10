// AddProjectModal.jsx
import React, { useEffect, useState } from "react";

const AddProjectModal = ({ isOpen, toggleModal, teams, onAddProject }) => {
  // console.log("Teams in Add Project Modal", teams);
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [teamIds, setTeamIds] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [description, setDescription] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("useeffect ids", teamIds);
  }, [teamIds]);
  const resetForm = () => {
    setName("");
    setServiceType("");
    setProjectStatus("");
    setTeamIds([]);
    setHashtags("");
    setDescription("");
  };

  const handleSubmit = (e) => {
    console.log("Form Data of addProject:", e.target.value);
    e.preventDefault();
    onAddProject({
      name,
      description,
      serviceType,
      projectStatus,
      hashtags: hashtags.split(","),
      teamIds,
    });
    resetForm();
    toggleModal();
  };

  const handleCancel = () => {
    resetForm();
    toggleModal();
  };

  const handleTeamChange = (teamId) => {
    console.log("teamId in team change", teamId);
    setTeamIds((prevTeamIds) =>
      prevTeamIds.includes(teamId)
        ? prevTeamIds.filter((id) => id !== teamId)
        : [...prevTeamIds, teamId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <h2 className="text-lg font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex mb-4 space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Service Type
              </label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex mb-4 space-x-4">
            <div className="w-full">
              <label className="block text-sm font-semibold mb-1">Team</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                  className="border border-gray-300 p-2 w-full rounded-lg text-left flex justify-between items-center"
                >
                  <span>
                    {teamIds.length
                      ? `${teamIds.length} team(s) selected`
                      : "Select teams"}
                  </span>
                  <span className="ml-2">▼</span>
                </button>
                {isTeamDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {teams.map((team) => (
                      <label
                        key={team._id}
                        className="flex items-center p-2 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={teamIds.includes(team._id)}
                          onChange={() => handleTeamChange(team._id)}
                          className="mr-2"
                        />
                        {team.teamName}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className=" mb-4 ">
            <div className="w-full">
              <label className="block text-sm font-semibold mb-1">
                Hashtags (optional)
              </label>
              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg resize-none h-20"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 w-full resize-none rounded-lg h-20"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="mr-2 bg-gray-200 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
