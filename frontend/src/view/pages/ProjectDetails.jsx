import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "../../services/projectService";
import {
  FiEdit2,
  FiTrash2,
  FiHash,
  FiInfo,
  FiFileText,
  FiUser,
  FiPackage,
  FiActivity,
} from "react-icons/fi";
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

  const canUpdateProject =
    user?.role === "admin" || user?.permission?.project?.update;

  const canReadProject =
    user?.role === "admin" || user?.permission?.project?.read;

  useEffect(() => {
    if (canReadProject) {
      fetchProjectDetails();
    } else {
      navigate("/");
    }
  }, [id, canReadProject]);

  const fetchProjectDetails = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleEditProject = async (projectData) => {
    if (canUpdateProject) {
      console.log("Project Data:", projectData);
      try {
        console.log("Id:", id);
        await updateProject(id, projectData);
        fetchProjectDetails();
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating project:", error);
      }
    }
  };



  if (!project) return <LoadingSpinner />;

  if (!canReadProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">
            You don't have permission to view this project.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusColors = {
      Active: "bg-green-100 text-green-800",
      Completed: "bg-blue-100 text-blue-800",
      "On Hold": "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-t-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiPackage className="text-blue-600 text-xl" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(
                    project.projectStatus
                  )}`}
                >
                  <FiActivity className="mr-2" />
                  {project.projectStatus}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {canUpdateProject && (
                <Button
                  variant="outline"
                  icon={<FiEdit2 />}
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition duration-200 rounded-lg flex items-center gap-2"
                >
                  Edit Project
                </Button>
              )}
             
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FiFileText className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Description
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {project.description}
              </p>
            </Card>

            <Card className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FiHash className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Hashtags
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.hashtags && project.hashtags.length > 0 ? (
                  project.hashtags.map((tag, index) => (
                    <Tag
                      key={index}
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      #{tag}
                    </Tag>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No hashtags added</p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FiInfo className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Project Details
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Service Type</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {project.serviceType}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Client</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FiUser className="text-gray-400" />
                    <p className="text-gray-900 font-medium">
                      {project.clientId?.name || "No client assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {canUpdateProject && (
        <CreateProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProject}
          initialData={project}
          isEditing={true}
        />
      )}
  
    </div>
  );
};

export default ProjectDetails;
