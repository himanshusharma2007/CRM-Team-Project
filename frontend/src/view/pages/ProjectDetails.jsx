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
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useAuth } from "../../context/Context";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();

  const canUpdateProject = user?.role === "admin" || user?.permission?.project?.update;
  const canDeleteProject = user?.role === "admin" || user?.permission?.project?.delete;
  const canReadProject = user?.role === "admin" || user?.permission?.project?.read;

  useEffect(() => {
    if (canReadProject) {
      fetchProjectDetails();
    } else {
      navigate("/"); // Redirect to home if user doesn't have read permission
    }
  }, [id, canReadProject]);

  const fetchProjectDetails = async () => {
    try {
      const data = await getProjectById(id);
      console.log("project data", data);
      setProject(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleEditProject = async (projectData) => {
    if (canUpdateProject) {
      try {
        await updateProject(id, projectData);
        console.log("I am updating")
        fetchProjectDetails();
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating project:", error);
      }
    }
  };

  const handleDeleteProject = async () => {
    if (canDeleteProject) {
      try {
        await deleteProject(id);
        navigate("/projects");
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (!project) return <LoadingSpinner />;

  if (!canReadProject) {
    return <div>You don't have permission to view this project.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8 ">
          <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
          <div className="space-x-3 flex">
            {canUpdateProject && (
              <Button
                variant="outline"
                icon={<FiEdit2 />}
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 ease-in-out rounded-md flex items-center gap-2"
              >
                Edit
              </Button>
            )}
            {canDeleteProject && (
              <Button
                variant="danger"
                icon={<FiTrash2 />}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition duration-200 ease-in-out rounded-md flex items-center gap-2"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
            <p className="text-gray-600 mb-1">
              <strong className="font-medium">Service Type:</strong> {project.serviceType}
            </p>
            <p className="text-gray-600 mb-1">
              <strong className="font-medium">Status:</strong> {project.projectStatus}
            </p>
            <p>
              <strong>Client:</strong> {project.clientId?.name || "No client name available"}
            </p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Team Members</h2>
          <div className="flex flex-wrap gap-2">
            {project.teamIds && project.teamIds.length > 0 ? (
              project.teamIds.map((member) => (
                <Tag key={member._id} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {member.name}
                </Tag>
              ))
            ) : (
              <p className="text-gray-600">No team members assigned</p>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Hashtags</h2>
          <div className="flex flex-wrap gap-2">
            {project.hashtages && project.hashtages.length > 0 ? (
              project.hashtages.map((tag, index) => (
                <Tag key={index} className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  #{tag}
                </Tag>
              ))
            ) : (
              <p className="text-gray-600">No hashtags added</p>
            )}
          </div>
        </div>
      </Card>
      {canUpdateProject && (
        <CreateProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProject}
          initialData={project}
          isEditing={true}
        />
      )}
      {canDeleteProject && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteProject}
          title="Confirm Delete"
          message="Are you sure you want to delete this project? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default ProjectDetails;
