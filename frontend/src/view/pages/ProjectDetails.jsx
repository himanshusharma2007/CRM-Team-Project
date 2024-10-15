import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "../../services/projectService";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "../components/UI/ProjectCommanUI";
import { Card } from "../components/UI/ProjectCommanUI";
import { Tag } from "../components/UI/ProjectCommanUI";
import CreateProjectModal from "../modal/CreateProjectModal";
import { ConfirmDialog } from "../components/UI/ProjectCommanUI";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleEditProject = async (projectData) => {
    try {
      await updateProject(id, projectData);
      fetchProjectDetails();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(id);
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (!project) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              icon={<FiEdit2 />}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              icon={<FiTrash2 />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p>
              <strong>Service Type:</strong> {project.serviceType}
            </p>
            <p>
              <strong>Status:</strong> {project.projectStatus}
            </p>
            <p>
              <strong>Client:</strong> {project.clientId.name}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Team Members</h2>
          <div className="flex flex-wrap gap-2">
            {project.teamIds.map((member) => (
              <Tag key={member._id}>{member.name}</Tag>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Hashtags</h2>
          <div className="flex flex-wrap gap-2">
            {project.hashtages.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        </div>
      </Card>
      <CreateProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProject}
        initialData={project}
        isEditing={true}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProject}
        title="Confirm Delete"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
};

export default ProjectDetails;
