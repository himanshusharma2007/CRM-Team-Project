import { useState, useEffect } from "react";
import { getAllTeams } from "../../services/teamService";
import { createProject } from "../../services/projectService";

const AddProjectModal = ({ isOpen, onClose, onAddProject, clientId }) => {
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [teamIds, setTeamIds] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [description, setDescription] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTeams = await getAllTeams();
        console.log("Fetched Teams: ", fetchedTeams);
        setTeams(fetchedTeams);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setServiceType("");
    setProjectStatus("");
    setTeamIds([]);
    setHashtags("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !serviceType || !projectStatus || teamIds.length === 0) {
      console.error("Please fill all required fields");
      alert("Please fill all required fields");
      return;
    }
    console.log("name in modal", name);
    console.log("serviceType in modal", serviceType);
    console.log("projectStatus in modal", projectStatus);
    console.log("teamIds in modal", teamIds);
    console.log("clientId in modal", clientId);
    const projectData = {
      name,
      description,
      serviceType,
      projectStatus,
      hashtags: hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      teamIds: Array.isArray(teamIds) ? teamIds : [teamIds],
      clientId,
    };
    console.log("projectData in modal", projectData);
    onAddProject(projectData);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
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
          <div className="wraper flex mb-4 space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Team</label>
              <select
                value={teamIds}
                onChange={(e) => setTeamIds([e.target.value])}
                className="border border-gray-300 p-2 w-full rounded-lg"
                required
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
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
