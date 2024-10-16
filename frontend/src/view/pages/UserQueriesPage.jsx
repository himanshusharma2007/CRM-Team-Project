import { useState, useEffect } from "react";
import { fetchContactUs, respondToContactUs } from "../../services/queryService";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const UserQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [sortBy, setSortBy] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetchContactUs();
      console.log("Fetched Queries:", data); // Debugging line
      setQueries(data);
      handleSort("pending", data); // Apply initial sorting with the fetched data
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (option, queriesToSort = queries) => {
    console.log("Sorting Option:", option); // Debugging line
    console.log("Queries Before Sort:", queriesToSort); // Debugging line
  
    setSortBy(option);
    const sortedQueries = [...queriesToSort];
  
    switch (option) {
      case "responded":
        sortedQueries.sort((a, b) => (a.response ? 0 : 1) - (b.response ? 0 : 1));
        break;
      case "pending":
        sortedQueries.sort((a, b) => (a.response ? 1 : 0) - (b.response ? 0 : 1));
        break;
      case "date":
        sortedQueries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
  
    console.log("Sorted Queries:", sortedQueries); // Debugging line
    setQueries(sortedQueries);
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
      await respondToContactUs(selectedQuery._id, response);
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query._id === selectedQuery._id ? { ...query, response } : query
        )
      );
      setShowModal(false);
      setResponse("");
      alert("Response submitted successfully!");
      handleSort(sortBy); // Re-apply current sorting after update
    } catch (error) {
      console.error("Error responding to query:", error);
      alert("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-nowrap">User Queries</h1>

        {/* Filters */}
        <div className="mb-6 flex md:items-center space-x-3">
          <h2 className="text-lg font-medium text-gray-700 text-nowrap min-w-20">Sort By:</h2>
          <div className="flex flex-wrap space-x-2 md:space-x-4">
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
                {option.charAt(0).toUpperCase() + option.slice(1)}
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
                    <p className="text-xl font-medium text-blue-600">{query.name}</p>
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

        {/* Modal */}
        {showModal && selectedQuery && (
          // Modal code remains unchanged
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Respond to Query</h3>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="mt-2 p-2 border rounded w-full"
                      rows="4"
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleSubmitResponse}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <LoadingSpinner /> : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserQueriesPage;
