import React from 'react';

const ApplicationStatusModal = ({ isOpen, onClose }) => {
  // Static JSON data for applications
  const applications = [
    {
      id: 1,
      name: "Software Engineer - Frontend",
      appliedDate: "2024-03-15",
      status: "Under Review"
    },
    {
      id: 2,
      name: "Data Analyst",
      appliedDate: "2024-03-10",
      status: "Interview Scheduled"
    },
    {
      id: 3,
      name: "Product Manager",
      appliedDate: "2024-03-05",
      status: "Rejected"
    },
    {
      id: 4,
      name: "UX Designer",
      appliedDate: "2024-03-01",
      status: "Accepted"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Application Status</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Application Name</th>
              <th className="border p-2 text-left">Applied Date</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="border p-2">{app.name}</td>
                <td className="border p-2">{app.appliedDate}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Helper function to get the appropriate color for each status
const getStatusColor = (status) => {
  switch (status) {
    case "Under Review":
      return "bg-yellow-200 text-yellow-800";
    case "Interview Scheduled":
      return "bg-blue-200 text-blue-800";
    case "Rejected":
      return "bg-red-200 text-red-800";
    case "Accepted":
      return "bg-green-200 text-green-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default ApplicationStatusModal;

