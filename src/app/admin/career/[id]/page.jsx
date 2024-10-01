'use client'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'

const CareerDetailsPage = () => {
  const params = useParams();
  const [careerDetails, setCareerDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Fetch career details and candidates data
    // This is a mock implementation. Replace with actual API calls.
    const fetchData = async () => {
      // Simulating API call delay  
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCareerDetails({
        title: "Software Engineer",
        lastDate: "2023-12-31",
        category: "Engineering",
        link: "https://example.com/apply",
        documents: ["Resume", "Cover Letter"],
        status: "Open",
        publishDate: "2023-06-01",
      });

      setCandidates([
        { id: 1, name: "John Doe", email: "john@example.com", appliedDate: "2023-06-05" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", appliedDate: "2023-06-07" },
        // Add more mock candidates as needed
      ]);
    };

    fetchData();
  }, [params.id]);

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
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr key={candidate.id}>
              <td className="border border-gray-300 p-2">{candidate.name}</td>
              <td className="border border-gray-300 p-2">{candidate.email}</td>
              <td className="border border-gray-300 p-2">{candidate.appliedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CareerDetailsPage