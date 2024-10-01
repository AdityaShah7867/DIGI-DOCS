'use client'
import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Calendar, FileText, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

const JobListings = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('id');
    setUserId(storedUserId);

    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/careerForm/getAll', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.career) {
          const formattedJobs = data.career.map(job => ({
            id: job._id,
            title: job.title,
            lastDate: job.last_date,
            category: job.category,
            link: '#', // You might want to update this with a real link
            documents: job.documentName.join(', '),
            status: job.status,
            publishDate: job.publish_date,
            appliedStatus: job.applicants.includes(storedUserId) ? 'Applied' : 'Not Applied'
          }));
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const categories = ['All', ...new Set(jobs.map(job => job.category))];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'All' || job.category === filterCategory)
  );

  const handleJobClick = (jobId) => {
    router.push(`/user/dashboard/careers/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Available Job Opportunities</h1>
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          <select
            className="w-full md:w-1/4 p-3 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg "
              // onClick={() => job.status === 'Open' && handleJobClick(job.id)}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                <p className="text-blue-100 flex items-center">
                  <Briefcase size={16} className="mr-2" />
                  {job.category}
                </p>
              </div>
              <div className="p-6">
                <div className="mb-4 space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">Last Date:</span> {job.lastDate}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FileText size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">Documents:</span> {job.documents}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                  {job.appliedStatus === 'Applied' ? (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Applied
                    </span>
                  ) : (
                    <a
                      href={job.link}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
                    >
                      Apply Now
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-4">Published on {job.publishDate}</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-600 mt-8 text-lg">No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default JobListings;