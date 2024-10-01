'use client'
import React, { useState, useEffect } from 'react'
import UploadDocumentModal from './UploadDocumentModal'

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Add new state variables for document and application counts
  const [documentCount, setDocumentCount] = useState(0)
  const [applicationCount, setApplicationCount] = useState(0)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/document/getAll', {
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
      setLoading(false)
    } catch (error) {
      console.error('Error fetching documents:', error)
      setError('Failed to load documents. Please try again later.')
      setLoading(false)
    }
  }

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
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-800">Applications Submitted</h2>
          <p className="text-3xl font-bold text-green-600">{applicationCount}</p>
        </div>
      </div>  

      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload New Document
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
                    {doc.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <UploadDocumentModal fetchDocuments={fetchDocuments} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={fetchDocuments} />
    </div>
  )
}

export default Dashboard