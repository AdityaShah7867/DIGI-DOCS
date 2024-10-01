'use client'
import React, { useState } from 'react';

const Dashboard = () => {
  const [documents, setDocuments] = useState([
    { type: 'aadhar', name: 'Aadhar Card', docName: '' },
    { type: 'pan', name: 'PAN Card', docName: '' },
    { type: 'ebc', name: 'EBC Certificate', docName: '' },
    { type: 'pwd', name: 'PWD Certificate', docName: '' },
    { type: 'passport', name: 'Passport', docName: '' },
    { type: 'gate', name: 'GATE Marksheet', docName: '' },
  ]);

  const handleDocNameChange = (index, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].docName = value;
    setDocuments(updatedDocuments);
  };

  const handleFileUpload = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = file;
    setDocuments(updatedDocuments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const doc of documents) {
      if (doc.file) {
        const formData = new FormData();
        // Change this line
        formData.append('document', doc.file);
        formData.append(`${doc.type}Name`, doc.docName);

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData,
          });

          if (!response.ok) {
            alert(`Error uploading ${doc.name}. Please try again.`);
            return;
          }
        } catch (error) {
          console.error('Error:', error);
          alert(`An error occurred while uploading ${doc.name}. Please try again.`);
          return;
        }
      }
    }

    alert('All documents uploaded successfully!');
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">Document Upload Dashboard</h1>
        <p className="text-center text-gray-600 mb-8">Please upload your required documents below</p>
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8">
          <ul className="space-y-6">
            {documents.map((doc, index) => (
              <li key={doc.type} className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <label htmlFor={`${doc.type}-name`} className="font-semibold text-gray-700">{doc.name}</label>
                  <input
                    type="text"
                    id={`${doc.type}-name`}
                    value={doc.docName}
                    onChange={(e) => handleDocNameChange(index, e.target.value)}
                    placeholder="Enter value"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="file"
                    id={`${doc.type}-file`}
                    onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor={`${doc.type}-file`}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                  >
                    Choose File
                  </label>
                  <span className="ml-2 text-sm text-gray-600">
                    {doc.file ? doc.file.name : 'No file chosen'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Upload All Documents
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;