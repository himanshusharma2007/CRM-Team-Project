import React, { useState } from "react";

const dummyQueries = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    message: "I would like to know more about your CRM solutions.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    message: "Can you provide pricing details for the enterprise package?",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    message: "I'm facing issues with the login functionality. Please assist.",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    message: "How can I integrate your CRM with my existing systems?",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@example.com",
    message: "I would like to schedule a demo of your product.",
  },
];

const QueryPage = () => {
  const [queries, setQueries] = useState(dummyQueries);

  const handleDelete = (id) => {
    const updatedQueries = queries.filter((query) => query.id !== id);
    setQueries(updatedQueries);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Submitted Queries</h1>
      {queries.length === 0 ? (
        <p className="text-center text-gray-700">No queries submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {queries.map((query) => (
            <div
              key={query.id}
              className="bg-gray-100 p-4 rounded-lg shadow-lg relative"
            >
              <h3 className="text-xl font-semibold mb-2">{query.name}</h3>
              <p className="text-gray-700">Email: {query.email}</p>
              <p className="text-gray-700">Message: {query.message}</p>
              <button
                onClick={() => handleDelete(query.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueryPage;
