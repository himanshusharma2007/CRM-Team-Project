import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import { Input } from "../components/UI/ProjectCommanUI";
import { Select } from "../components/UI/ProjectCommanUI";
import { Button } from "../components/UI/ProjectCommanUI";
import {getAllClients} from "../../services/clientServices";
import {createProject} from "../../services/projectService";
import {getAllTeams} from "../../services/TeamService"
import { Checkbox } from "../components/UI/ProjectCommanUI";
import { FaChevronDown } from 'react-icons/fa';

const CreateProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    serviceType: "",
    projectStatus: "pending",
    clientId: "",
    teamIds: [],
    hashtags: "",
    projectImage: ""
  });
  const [clients, setClients] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(()=>{
    const fetchAllTeams = async () => {
      try {
        const allFetchedTeams = await getAllTeams();
        setAllTeams(allFetchedTeams);
      } catch (error) {
        console.log("Error in fetch all teams: ", error.message)
      }
    }
    fetchAllTeams()
    if(isOpen){
      console.log("All teams : ", allTeams)
      console.log("Team ids : ", )
    }
  }, [isOpen])
  useEffect(() => {
    if (initialData && isEditing) {
      console.log("initial data in useEffect",initialData);
      setFormData({
        ...initialData,
        hashtags: initialData.hashtags?.join(", "),
        teamIds: initialData.teamIds?.map((member) => member._id),
      });
    }
  }, [initialData, isEditing]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getAllClients();
        console.log("clients in fetchClients", clients);
        setClients(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTeamDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const submissionData = {
        ...formData,
        hashtags: formData.hashtags.split(",").map((tag) => tag.trim()),
      };
     
      onSubmit(submissionData);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTeamChange = (teamId) => {
    setFormData((prevData) => ({
      ...prevData,
      teamIds: prevData.teamIds.includes(teamId)
        ? prevData.teamIds.filter((id) => id !== teamId)
        : [...prevData.teamIds, teamId],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Project" : "Create New Project"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              name="name"
              label="Project Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <Input
              name="serviceType"
              label="Service Type"
              value={formData.serviceType}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline="true"
              rows={4}
            />
          </div>
          <div className="flex-1">
            <Select
              name="projectStatus"
              label="Project Status"
              value={formData.projectStatus}
              onChange={handleChange}
              options={[
                { value: "pending", label: "Pending" },
                { value: "ongoing", label: "Ongoing" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <select
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  clientId: e.target.value,
                })
              }
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 relative" ref={dropdownRef}>
          
            <div
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
              onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
            >
              <div className="flex justify-between items-center">
                <span>
                  {formData.teamIds.length
                    ? `${formData.teamIds.length} team(s) selected`
                    : "Select Teams"}
                </span>
                <FaChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {isTeamDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {allTeams.map((team) => (
                  <div
                    key={team._id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <Checkbox
                      id={`team-${team._id}`}
                      checked={formData.teamIds.includes(team._id)}
                      onChange={() => handleTeamChange(team._id)}
                    />
                    <label
                      htmlFor={`team-${team._id}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {team.teamName}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              name="hashtags"
              label="Hashtags (comma-separated)"
              value={formData.hashtags}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <button
            type="submit"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
