import React, { useState, useEffect } from "react";
import {
  fetchContactUs,
  respondToContactUs,
} from "../../services/queryService";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const UserQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [sortBy, setSortBy] = useState("pending"); // Changed default to "pending"
  const [showModal, setShowModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchContactUs();
      setQueries(data);
      handleSort("pending"); // Apply initial sorting
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleSort = (option) => {
    setSortBy(option);
    setQueries((prevQueries) => {
      const sortedQueries = [...prevQueries];
      switch (option) {
        case "responded":
          return sortedQueries.sort((a, b) =>
            a.response && !b.response ? -1 : !a.response && b.response ? 1 : 0
          );
        case "pending":
          return sortedQueries.sort((a, b) =>
            !a.response && b.response ? -1 : a.response && !b.response ? 1 : 0
          );
        case "date":
          return sortedQueries.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        default:
          return sortedQueries;
      }
    });
  };
  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setShowModal(true);
    setResponse(query.response || "");
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      alert("Please enter a response before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("selectedQuery._id :>> ", selectedQuery._id);
      console.log("response:>> ", response);
      await respondToContactUs(selectedQuery._id, response);

      // Update the queries list to reflect the new response
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query._id === selectedQuery._id ? { ...query, response } : query
        )
      );

      setShowModal(false);
      setResponse("");
      // Optionally, you can add a success message here
      alert("Response submitted successfully!");
    } catch (error) {
      console.error("Error responding to query:", error);
      alert("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className=" min-h-screen w-full ">
      <div className=" mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-nowrap">
          User Queries
        </h1>

        {/* Filters */}
        <div className="mb-6 flex  md:items-center space-x-3">
          <h2 className="text-lg font-medium text-gray-700  text-nowrap min-w-20">
            Sort By:
          </h2>
          <div className="flex  flex-wrap space-x-2 md:space-x-4">
            {["responded", "pending", "date"].map((option) => (
              <button
                key={option}
                className={`px-4 py-2 rounded-full text-lg font-medium ${
                  sortBy === option
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                } transition-colors duration-150`}
                onClick={() => handleSort(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Query List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {queries.map((query) => (
              <li key={query._id}>
                <div
                  className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                  onClick={() => handleQueryClick(query)}
                >
                  <div>
                    <p className="text-xl font-medium text-blue-600">
                      {query.name}
                    </p>
                    <p className="text-lg text-gray-500">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        query.response
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {query.response ? "Responded" : "Pending"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedQuery && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-64 md:max-h-full overflow-auto">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <span className="h-6 w-6" aria-hidden="true">
                    X
                  </span>
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Query Details
                    </h3>
                    <div className="mt-4 space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedQuery.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedQuery.email}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(selectedQuery.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Query:</span>{" "}
                        {selectedQuery.query}
                      </p>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="response"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {selectedQuery.response
                          ? "Response:"
                          : "Your Response:"}
                      </label>
                      <textarea
                        id="response"
                        rows="4"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-lg p-2 border border-gray-300 rounded-md resize-none outline-none"
                        placeholder="Enter your response..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        readOnly={selectedQuery.response}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!selectedQuery.response && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleSubmitResponse}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Response"
                    )}
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserQueriesPage;
