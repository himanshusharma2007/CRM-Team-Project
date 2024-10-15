import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, createProject } from "../../services/projectService";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Button } from "../components/UI/ProjectCommanUI";
import { Card } from "../components/UI/ProjectCommanUI";
import { Input } from "../components/UI/ProjectCommanUI";
import CreateProjectModal from "../modal/CreateProjectModal";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200 + 55);
    const g = Math.floor(Math.random() * 200 + 55);
    const b = Math.floor(Math.random() * 200 + 55);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="flex justify-between items-center mb-6">
        <Input
          icon={<FiSearch className="text-gray-400" />}
          placeholder="Search Projects"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button onClick={() => setIsModalOpen(true)} icon={<FiPlus />}>
          Create Project
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project._id}
            title={project.name}
            subtitle={`Status: ${project.projectStatus}`}
            onClick={() => navigate(`/project/${project._id}`)}
          >
            <div
              className="h-36 mb-4 bg-cover bg-center"
              style={{
                backgroundColor: project.projectImage
                  ? "transparent"
                  : getRandomColor(),
                backgroundImage: project.projectImage
                  ? `url(${project.projectImage})`
                  : "none",
              }}
            />
            <p className="text-gray-600 line-clamp-3">{project.description}</p>
          </Card>
        ))}
      </div>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default ProjectPage;
