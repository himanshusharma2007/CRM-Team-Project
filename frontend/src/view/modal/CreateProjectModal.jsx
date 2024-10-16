import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { Input } from "../components/UI/ProjectCommanUI";
import { Select } from "../components/UI/ProjectCommanUI";
import { Button } from "../components/UI/ProjectCommanUI";
import {getAllClients} from "../../services/clientServices";
import {createProject} from "../../services/projectService";

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
  });
  const [clients, setClients] = useState([]);


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
        setClients(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    console.log("handle submit called")
    e.preventDefault();
    console.log("form data in handleSubmit",formData);
    const submissionData = {
      ...formData,
      hashtags: formData.hashtags.split(",").map((tag) => tag.trim()),
    };
    
    onSubmit(submissionData);
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
          multiline
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
        <select className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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
      <div className="flex-1">
        <Input
          name="teamIds"
          label="Team IDs (comma-separated)"
          value={formData.teamIds.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              teamIds: e.target.value.split(",").map((id) => id.trim()),
            })
          }
        />
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

    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update" : "Create"} Project
      </Button>
    </div>
  </form>
</Modal>

  
  );
};

export default CreateProjectModal;