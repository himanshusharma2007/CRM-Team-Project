import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, createProject } from "../../services/projectService";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Button } from "../components/UI/ProjectCommanUI";
import { Card } from "../components/UI/ProjectCommanUI";
import { Input } from "../components/UI/ProjectCommanUI";
import CreateProjectModal from "../modal/CreateProjectModal";
import { useAuth } from "../../context/Context";
import LoadingSpinner from "../components/UI/LoadingSpinner"; // Import the LoadingSpinner component

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usedColors, setUsedColors] = useState(new Set());
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const canCreateProject =
    user?.role === "admin" || user?.permission?.project?.create;
  const canUpdateProject =
    user?.role === "admin" || user?.permission?.project?.update;
  const canReadProject =
    user?.role === "admin" || user?.permission?.project?.read;

  useEffect(() => {
    if (canReadProject) {
      fetchProjects();
    }
  }, [canReadProject]);

  const getUniqueColor = () => {
    let color;
    do {
      const r = Math.floor(Math.random() * 200 + 55);
      const g = Math.floor(Math.random() * 200 + 55);
      const b = Math.floor(Math.random() * 200 + 55);
      color = `rgb(${r},${g},${b})`;
    } while (usedColors.has(color));

    setUsedColors((prevColors) => new Set(prevColors).add(color));
    return color;
  };

  const assignUniqueColorsToProjects = (projectsData) => {
    return projectsData.map((project) => {
      if (!project.color) {
        project.color = getUniqueColor();
      }
      return project;
    });
  };

  const fetchProjects = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const data = await getAllProjects();
      const projectsWithColors = assignUniqueColorsToProjects(data);
      setProjects(projectsWithColors);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (projectData) => {
    console.log("crete project called",projectData)
    if (canCreateProject) {
      try {
        console.log("projectData",projectData)
        const newProject = await createProject(projectData);
        const newProjectWithColor = { ...newProject, color: getUniqueColor() };
        setProjects((prevProjects) => [...prevProjects, newProjectWithColor]);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating project:", error);
      }
    }
  };

  const handleProjectClick = (projectId) => {
    if (canUpdateProject) {
      navigate(`/project/${projectId}`);
    }
  };

  if (!canReadProject) {
    return <div>You don't have permission to view projects.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {isLoading && <LoadingSpinner />} {/* Render loading spinner if loading */}
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="flex justify-between items-center mb-6">
        <Input
          icon={<FiSearch className="text-gray-400" />}
          placeholder="Search Projects"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<FiPlus />}
          disabled={!canCreateProject}
        >
          Create Project
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project._id}
            title={project.name}
            subtitle={`Status: ${project.projectStatus}`}
            onClick={() => handleProjectClick(project._id)}
            className={
              canUpdateProject ? "cursor-pointer" : "cursor-not-allowed"
            }
          >
            <div
              className="h-36 mb-4 bg-cover bg-center"
              style={{
                backgroundColor: project.projectImage
                  ? "transparent"
                  : project.color,
                backgroundImage: project.projectImage
                  ? `url(${project.projectImage})`
                  : "none",
              }}
            />
            <p className="text-gray-600 line-clamp-3">{project.description}</p>
          </Card>
        ))}
      </div>
      {canCreateProject && (
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};

export default ProjectPage;
