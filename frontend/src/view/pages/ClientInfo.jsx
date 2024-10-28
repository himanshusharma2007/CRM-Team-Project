import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById } from "../../services/clientServices";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const ClientInfo = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClientData(clientData);
      } catch (error) {
        setError("Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;

  return clientData ? (
    <div className="p-6 max-w-5xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <button
        className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Client Information</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg mb-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b border-gray-200 pb-2">
          {clientData.name}
        </h2>

        <div className="space-y-3 text-gray-700">
          <p className="flex items-center">
            <strong>Company:</strong>{" "}
            <span className="ml-2">{clientData.company}</span>
          </p>
          <p className="flex items-center">
            <strong>Email:</strong>{" "}
            <span className="ml-2">{clientData.email}</span>
          </p>
          <p className="flex items-center">
            <strong>Phone:</strong>{" "}
            <span className="ml-2">{clientData.phone}</span>
          </p>
          <p className="flex items-center">
            <strong>Location:</strong>{" "}
            <span className="ml-2">{clientData.location}</span>
          </p>
          <p className="flex items-center">
            <strong>Timezone:</strong>{" "}
            <span className="ml-2">{clientData.timeZone}</span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Projects</h2>

      {clientData.projectId.map((project) => (
        <div
          key={project._id}
          className="flex justify-between bg-white p-6 px-10 rounded-lg shadow-lg mb-6"
        >
          <div className="my-auto">
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {project.name}
            </h3>
            <p className="text-gray-600">
              <strong>Description:</strong> {project.description}
            </p>
            <p className="text-gray-600">
              <strong>Service Type:</strong> {project.serviceType}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong>{" "}
              <span
                className={`text-${
                  project.projectStatus === "completed"
                    ? "green"
                    : project.projectStatus === "cancelled"
                    ? "red"
                    : "yellow"
                }-500`}
              >
                {project.projectStatus}
              </span>
            </p>
          </div>
          {project.projectImage && (
            <div className="my-4">
              <img
                src={project.projectImage}
                alt="Project"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div>No client data found.</div>
  );
};

export default ClientInfo;
