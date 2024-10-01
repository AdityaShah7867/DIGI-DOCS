'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

const Page = () => {
  const params = useParams();
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [careerData, setCareerData] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchCareerData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/get/${params.name}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCareerData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/careerForm/getOne/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCareerData(data.career);
    } catch (error) {
      console.error('Error fetching career data:', error);
    }
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
  };

  const handleAction = (type) => {
    setActionType(type);
    setShowActionModal(true);
  };

  const submitAction = () => {
    // TODO: Implement API call to submit action
    console.log(`Applicant ${actionType}ed with message: ${message}`);
    setShowActionModal(false);
    setMessage('');
  };

  if (!userData || !careerData) {
    return <div>Loading...</div>;
  }

  const requiredDocuments = careerData.documentName;
  const userDocuments = userData.uploadedDocs.filter(doc => 
    doc.documentId && requiredDocuments.includes(doc.documentName)
  );

  return (
    <div className='min-h-screen bg-white text-black p-8'>
      <h1 className='text-3xl font-bold mb-6'>Applicant Details</h1>
      
      <div className='flex items-center mb-6'>
        <div className='w-16 h-16 bg-gray-300 rounded-full mr-4'></div>
        <div>
          <h2 className='text-2xl font-semibold'>{userData.email}</h2>
          <p className='text-blue-600 font-medium'>Applied for: {careerData.title}</p>
        </div>
      </div>

      <h3 className='text-xl font-semibold mb-4'>Uploaded Documents</h3>
      <ul className='space-y-2'>
        {userDocuments.map((doc) => (
          <li key={doc._id} className='flex items-center justify-between bg-gray-100 p-3 rounded'>
            <span>{doc.documentName}</span>
            <button
              onClick={() => handlePreview(doc.documentId)}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
            >
              Preview
            </button>
          </li>
        ))}
      </ul>

      {previewDocument && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-lg w-3/4 h-3/4'>
            <h4 className='text-xl font-semibold mb-4'>{previewDocument.documentName}</h4>
            <iframe src={previewDocument.documentUrl} className='w-full h-5/6' />
            <button
              onClick={() => setPreviewDocument(null)}
              className='mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition'
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className='mt-8 flex space-x-4'>
        <button
          onClick={() => handleAction('accept')}
          className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition'
        >
          Accept
        </button>
        <button
          onClick={() => handleAction('reject')}
          className='bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition'
        >
          Reject
        </button>
      </div>

      {showActionModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg w-1/2'>
            <h4 className='text-xl font-semibold mb-4'>
              {actionType === 'accept' ? 'Accept' : 'Reject'} Applicant
            </h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='w-full h-32 p-2 border rounded mb-4'
              placeholder={`Enter message for ${actionType === 'accept' ? 'acceptance' : 'rejection'}...`}
            ></textarea>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowActionModal(false)}
                className='bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition'
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className={`text-white px-4 py-2 rounded transition ${
                  actionType === 'accept' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm {actionType === 'accept' ? 'Acceptance' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page