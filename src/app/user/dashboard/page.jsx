'use client'
import React, { useState, useEffect } from 'react'
import UploadDocumentModal from './UploadDocumentModal'
import { useRouter } from 'next/navigation'
import ApplicationStatusModal from './ApplicationStatusModal.jsx'
import { FaTrash } from 'react-icons/fa'; // Import the trash icon

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Add new state variables for document and application counts
  const [documentCount, setDocumentCount] = useState(0)
  const [applicationCount, setApplicationCount] = useState(0)
  const [uploadedDocumentTypes, setUploadedDocumentTypes] = useState([])
  // Add a new state for applications
  const [applications, setApplications] = useState([])

  const router = useRouter();
  useEffect(() => {
    fetchUserData()
    fetchDocuments()
    fetchApplications() // Add this line to fetch applications
  }, [])

  const handleApply = () => {
    router.push('/user/dashboard/careers')
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/get/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = await response.json();
      console.log(userData)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/getAll`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }

      const data = await response.json()
      setDocuments(data.documents)
      console.log(data.documents)
      // Update document and application counts
      setDocumentCount(data.documents.length)
      setApplicationCount(data.documents.filter(doc => doc.verified).length)
      // Update the uploadedDocumentTypes state
      const uploadedTypes = data.documents.map(doc => doc.documentName  )
      setUploadedDocumentTypes(uploadedTypes)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching documents:', error)
      setError('Failed to load documents. Please try again later.')
      setLoading(false)
    }
  }

  const deleteDocument = async (documentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/delete/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      // Refresh the documents list after successful deletion
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete document. Please try again later.');
    }
  };

  const fetchApplications = async () => {
    // This is a placeholder. In a real application, you would fetch this data from your API
    const mockApplications = [
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
    setApplications(mockApplications);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">User Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-blue-800">Documents Uploaded</h2>
          <p className="text-3xl font-bold text-blue-600">{documentCount}</p>
        </div>
        <b className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-800">Applications Submitted</h2>
          <p className="text-3xl font-bold text-green-600">{applicationCount}</p>
        </b>
      </div>  

      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload New Document
        </button>
        <button
          onClick={handleApply}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Apply to Open Postings
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2 text-gray-900">Uploaded Documents</h2>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Document Name</th>
              <th className="border border-gray-300 p-2 text-left">Upload Date</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc._id || index}>
                <td className="border border-gray-300 p-2">{doc.documentName || 'Unnamed Document'}</td>
                <td className="border border-gray-300 p-2">
                  {doc.createdAt
                    ? new Date(doc.createdAt).toLocaleDateString()
                    : 'Date not available'
                  }
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded ${doc.verified ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {doc.verified}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => deleteDocument(doc._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="text-xl font-semibold mb-2 mt-8 text-gray-900">Application Status</h2>
      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Application Name</th>
              <th className="border border-gray-300 p-2 text-left">Applied Date</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="border border-gray-300 p-2">{app.name}</td>
                <td className="border border-gray-300 p-2">{app.appliedDate}</td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <UploadDocumentModal 
        fetchDocuments={fetchDocuments} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={fetchDocuments}
        uploadedDocumentTypes={uploadedDocumentTypes}
      />
    </div>
  )
}

// Add the getStatusColor function from the ApplicationStatusModal
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

export default Dashboard