'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle, Loader2 } from 'lucide-react';const Page = () => {
  const params = useParams();
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [applicationId, setApplicationId] = useState(null);
  const router = useRouter();
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  useEffect(() => {
    fetchUserData();
    fetchCareerData();
    // fetchStatus();
  }, []);

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setVerificationStep(0);
    setVerificationComplete(false);
    simulateVerificationProcess();
  };

 
  const VerificationStep = ({ step, currentStep, text }) => {
    const isCompleted = currentStep > step;
    const isInProgress = currentStep === step;
  
    return (
      <div className={`flex items-center mb-4 ${isCompleted ? 'text-green-500' : isInProgress ? 'text-blue-500' : 'text-gray-400'}`}>
        {isCompleted ? (
          <CheckCircle className="mr-2" />
        ) : isInProgress ? (
          <Loader2 className="mr-2 animate-spin" />
        ) : (
          <div className="w-5 h-5 mr-2 rounded-full border-2 border-current"></div>
        )}
        <span>{text}</span>
      </div>
    );
  };
  const simulateVerificationProcess = () => {
    const steps = [
      { step: 1, delay: 3000 },
      { step: 2, delay: 3000 },
      { step: 3, delay: 3000 },
    ];
  
    setVerificationStep(1); // Start with step 1
  
    steps.forEach(({ step, delay }, index) => {
      setTimeout(() => {
        setVerificationStep(step + 1); // Move to next step
        if (index === steps.length - 1) {
          setVerificationComplete(true);
        }
      }, delay * (index + 1));
    });
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/get/${params.name}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserData(data);
      setExtractedData(data.uploadedDocs.reduce((acc, doc) => {
        if (doc.documentId && doc.documentId.extractedData) {
          acc[doc.documentName] = doc.documentId.extractedData;
        }
        return acc;
      }, {}));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCareerData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/careerForm/getSelectionStatus/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCareerData(data.career);

      // Find the application for the current user
      const currentUserApplication = data.career.application.find(app => app.userId._id === params.name);
      if (currentUserApplication) {
        setActionType(currentUserApplication.selectionStatus);
        // Save the application ID
        setApplicationId(currentUserApplication._id);
      }
    } catch (error) {
      console.error('Error fetching career data:', error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/careerForm/getStatus/${params.id}/${params.name}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCareerData(data.career);
      
      // Find the application for the current user
      const currentUserApplication = data.career.application.find(app => app.userId._id === params.name);
      if (currentUserApplication) {
        setActionType(currentUserApplication.selectionStatus);
      }
    } catch (error) {
      console.error('Error fetching career data:', error);
    }
  };

  // const handlePreview = (document) => {
  //   setPreviewDocument(document);
  // };

  const handleAction = (type) => {
    setActionType(type);
    setShowActionModal(true);
  };

  const submitAction = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/careerForm/change/${params.id}/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          selectionStatus: actionType === 'accept' ? 'Selected' : 'Rejected',
          applicationId: applicationId // Add this line
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      console.log(`Applicant ${actionType}ed with message: ${message}`);
      setShowActionModal(false);
      setMessage('');
      
      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error('Error updating application status:', error);
      // Optionally, show an error message to the user
    }
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
          <p className='text-gray-600'>Application Date: {new Date(careerData.application[0].appliedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <h3 className='text-xl font-semibold mb-4'>Uploaded Documents</h3>
      <ul className='space-y-4'>
        {userDocuments.map((doc) => (
          <li key={doc._id} className='bg-white border border-gray-300 shadow-md p-4 rounded'>
            <div className='flex items-center justify-between mb-2'>
              <span className='font-semibold'>{doc.documentName}</span>
              <button
                onClick={() => handlePreview(doc.documentId)}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
              >
                Preview
              </button>
            </div>
            {/* {extractedData[doc.documentName] && (
              <div className='text-sm text-gray-600'>
                <h4 className='font-medium mb-1'>Extracted Data:</h4>
                <ul className='list-disc list-inside'>
                  {Object.entries(extractedData[doc.documentName]).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
              </div>
            )} */}
          </li>
        ))}
      </ul>

      {previewDocument && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg w-11/12 h-5/6 flex flex-col">
      <h4 className="text-2xl font-semibold mb-4">{previewDocument.documentName}</h4>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-2/3 pr-8 overflow-auto">
          <img src={previewDocument.documentUrl} alt={previewDocument.documentName} className="w-full h-auto object-contain" />
        </div>
        <div className="w-1/3 border-l pl-8 overflow-auto">
          <h5 className="text-xl font-semibold mb-4">Verification Process</h5>
          {verificationComplete ? (
            <div className="text-green-500 font-semibold mb-4">Verification Complete!</div>
          ) : (
            <div className="text-blue-500 font-semibold mb-4">Verification in progress...</div>
          )}
          <VerificationStep step={1} currentStep={verificationStep} text="Verifying via OCR" />
          <VerificationStep step={2} currentStep={verificationStep} text="Checking government database" />
          <VerificationStep step={3} currentStep={verificationStep} text="Extracting data" />
          {verificationComplete && (
            <div className="mt-8">
              <h6 className="text-lg font-semibold mb-2">Extracted Data:</h6>
              <ul className="list-disc list-inside">
                {Object.entries(extractedData[previewDocument.documentName] || {}).map(([key, value]) => (
                  <li key={key} className="mb-1">{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => setPreviewDocument(null)}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Close
      </button>
    </div>
  </div>
)}
      <div className='mt-8'>
        <h3 className='text-xl font-semibold mb-4'>Application Status</h3>
        <div className='bg-gray-100 p-4 rounded'>
          <p className='text-lg font-medium'>
            Current Status: <span className={`${actionType === 'Selected' ? 'text-green-600' : actionType === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
              {actionType}
            </span>
          </p>
          {actionType === 'Pending' && (
            <div className='mt-4 flex space-x-4'>
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
          )}
        </div>
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