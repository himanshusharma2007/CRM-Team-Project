import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { Input } from "../components/UI/ProjectCommanUI";
import { Select } from "../components/UI/ProjectCommanUI";
import { Button } from "../components/UI/ProjectCommanUI";

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
    hashtages: "",
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        ...initialData,
        hashtages: initialData.hashtages.join(", "),
        teamIds: initialData.teamIds.map((member) => member._id),
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      hashtages: formData.hashtages.split(",").map((tag) => tag.trim()),
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
        <Input
          name="name"
          label="Project Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
        />
        <Input
          name="serviceType"
          label="Service Type"
          value={formData.serviceType}
          onChange={handleChange}
          required
        />
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
        <Input
          name="clientId"
          label="Client ID"
          value={formData.clientId}
          onChange={handleChange}
          required
        />
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
        <Input
          name="hashtages"
          label="Hashtags (comma-separated)"
          value={formData.hashtages}
          onChange={handleChange}
        />
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
