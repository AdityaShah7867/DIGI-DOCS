'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

const Page = () => {
  const params = useParams();
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [message, setMessage] = useState('');

  // Placeholder data - replace with actual data fetching
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    photo: '/path/to/photo.jpg',
    appliedRole: 'Software Engineer',
    documents: [
      { id: 1, name: 'Resume.pdf', url: 'https://www.pancardapp.com/blog/wp-content/uploads/2019/04/sample-pan-card.jpg' },
      { id: 2, name: 'Cover Letter.pdf', url: 'https://www.pancardapp.com/blog/wp-content/uploads/2019/04/sample-pan-card.jpg' },
      { id: 3, name: 'Portfolio.pdf', url: 'https://www.pancardapp.com/blog/wp-content/uploads/2019/04/sample-pan-card.jpg' },
    ],
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

  return (
    <div className='min-h-screen bg-white text-black p-8'>
      <h1 className='text-3xl font-bold mb-6'>Applicant Details</h1>
      
      <div className='flex items-center mb-6'>
        <img src={userData.photo} alt={userData.name}  className='rounded-full mr-4' />
        <div>
          <h2 className='text-2xl font-semibold'>{userData.name}</h2>
          <p className='text-gray-600'>{userData.email}</p>
          <p className='text-blue-600 font-medium'>Applied for: {userData.appliedRole}</p>
        </div>
      </div>

      <h3 className='text-xl font-semibold mb-4'>Uploaded Documents</h3>
      <ul className='space-y-2'>
        {userData.documents.map((doc) => (
          <li key={doc.id} className='flex items-center justify-between bg-gray-100 p-3 rounded'>
            <span>{doc.name}</span>
            <button
              onClick={() => handlePreview(doc)}
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
            <h4 className='text-xl font-semibold mb-4'>{previewDocument.name}</h4>
            <iframe src={previewDocument.url} className='w-full h-5/6' />
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