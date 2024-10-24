import { useState, useEffect } from "react";
import {
  fetchContactUs,
  respondToContactUs,
} from "../../services/queryService";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useAuth } from "../../context/Context";
import { useToast } from "../../context/ToastContext";

const UserQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [sortBy, setSortBy] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const {showToast} = useToast();

  const canReadQuery = user?.role === "admin" || user?.permission?.query?.read;
  const canRespondQuery = user?.role === "admin" || user?.permission?.query?.respond;

  const fetchData = async () => {
    if (canReadQuery) {
      try {
        const data = await fetchContactUs();
        console.log("Fetched Queries:", data);
        setQueries(data);
        handleSort(sortBy, data); // Apply initial sorting with the fetched data
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [canReadQuery]);

  const handleSort = (option, queriesToSort = queries) => {
    console.log("handleSort called with option:", option);
    console.log("Current sortBy state:", sortBy);
    console.log("Queries Before Sort:", queriesToSort);

    setSortBy(option);
    const sortedQueries = [...queriesToSort];

    switch (option) {
      case "responded":
        console.log("Sorting by responded");
        sortedQueries.sort((a, b) => {
          const aResponded = a.status === "responded" || a.responed;
          const bResponded = b.status === "responded" || b.responed;
          if (aResponded && !bResponded) return -1;
          if (!aResponded && bResponded) return 1;
          return 0;
        });
        break;
      case "pending":
        console.log("Sorting by pending");
        sortedQueries.sort((a, b) => {
          const aPending = a.status === "pending" || (!a.status && !a.responed);
          const bPending = b.status === "pending" || (!b.status && !b.responed);
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          return 0;
        });
        break;
      case "date":
        console.log("Sorting by date");
        sortedQueries.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        console.log("No sorting applied");
        break;
    }

    console.log("Sorted Queries:", sortedQueries);
    setQueries(sortedQueries);
  };

  const handleQueryClick = (query) => {
    if (canReadQuery) {
      setSelectedQuery(query);
      setShowModal(true);
      setResponse(query.response || "");
    }
  };

  const handleSubmitResponse = async () => {
    if (!canRespondQuery) {
      showToast("You don't have permission to respond to queries.", "error");
      return;
    }

    if (!response.trim()) {
      showToast("Please enter a response before submitting.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await respondToContactUs(selectedQuery._id, response);
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query._id === selectedQuery._id
            ? { ...query, response: response, status: "responded" }
            : query
        )
      );
      setShowModal(false);
      setResponse("");
      showToast("Response submitted successfully!", "success");
      handleSort(sortBy); // Re-apply current sorting after update
    } catch (error) {
      console.error("Error responding to query:", error);
      showToast("Failed to submit response. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canReadQuery) {
    return <div>You don't have permission to view queries.</div>;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-nowrap">
          User Queries
        </h1>

        {/* Filters */}
        <div className="mb-6 flex md:items-center space-x-3">
          <h2 className="text-lg font-medium text-gray-700 text-nowrap min-w-20">
            Sort By:
          </h2>
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
                        query.status === "responded"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {query.status === "responded" ? "Responded" : "Pending"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal */}
        {showModal && selectedQuery && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {selectedQuery.status === "responded" ? "Query Details" : "Respond to Query"}
                    </h3>
                    <div className="text-left mb-4">
                      <p><strong>Name:</strong> {selectedQuery.name}</p>
                      <p><strong>Email:</strong> {selectedQuery.email}</p>
                      <p><strong>Subject:</strong> {selectedQuery.subject}</p>
                      <p><strong>Message:</strong> {selectedQuery.message}</p>
                      <p><strong>Created At:</strong> {new Date(selectedQuery.createdAt).toLocaleString()}</p>
                      <p><strong>Status:</strong> {selectedQuery.status}</p>
                      {selectedQuery.status === "responded" && (
                        <p><strong>Response:</strong> {selectedQuery.responed}</p>
                      )}
                    </div>
                    {selectedQuery.status !== "responded" && canRespondQuery && (
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="mt-2 p-2 border rounded w-full"
                        rows="4"
                        placeholder="Enter your response here..."
                      />
                    )}
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  {selectedQuery.status !== "responded" && canRespondQuery && (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleSubmitResponse}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <LoadingSpinner /> : "Submit Response"}
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
    </div>
  );
};

export default UserQueriesPage;
