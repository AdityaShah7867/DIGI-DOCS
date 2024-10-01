'use client'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CareerDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [careerDetails, setCareerDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/careerForm/getSelectionStatus/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        
        if (data.career) {
          setCareerDetails({
            title: data.career.title,
            lastDate: data.career.last_date,
            category: data.career.category,
            status: data.career.status,
            publishDate: data.career.publish_date,
            documents: data.career.documentName,
          });
          
          // Map the applicants data from the API response
          const mappedCandidates = data.career.application.map(application => ({
            id: application._id,
            name: application.userId.email.split('@')[0], // Use email as name
            email: application.userId.email,
            appliedDate: new Date(application.appliedAt).toLocaleDateString(),
            selectionStatus: application.selectionStatus,
          }));
          
          setCandidates(mappedCandidates);
        } else {
          console.error("Failed to fetch career details");
        }
      } catch (error) {
        console.error("Error fetching career details:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleCandidateClick = (candidateId, candidateName) => {
    router.push(`/admin/career/${params.id}/${candidateId}`);
  };

  if (!careerDetails) {
    return <div className="min-h-screen bg-white text-black flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className='min-h-screen bg-white text-black p-8'>
      <h1 className="text-3xl font-bold mb-6">Career Details</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">{careerDetails.title}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Last Date:</strong> {careerDetails.lastDate}</div>
          <div><strong>Category:</strong> {careerDetails.category}</div>
          <div><strong>Link:</strong> <a href={careerDetails.link} className="text-blue-600 hover:underline">{careerDetails.link}</a></div>
          <div><strong>Documents:</strong> {careerDetails.documents.join(", ")}</div>
          <div><strong>Status:</strong> {careerDetails.status}</div>
          <div><strong>Publish Date:</strong> {careerDetails.publishDate}</div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Candidates</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Applied Date</th>
            <th className="border border-gray-300 p-2">Selection Status</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr key={candidate.id}>
              <td 
                className="border border-gray-300 p-2 cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleCandidateClick(candidate.id, candidate.name)}
              >
                {candidate.name}
              </td>
              <td className="border border-gray-300 p-2">{candidate.email}</td>
              <td className="border border-gray-300 p-2">{candidate.appliedDate}</td>
              <td className="border border-gray-300 p-2">{candidate.selectionStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CareerDetailsPage