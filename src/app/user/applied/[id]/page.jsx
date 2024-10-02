'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AppliedJobDetails = () => {
    const params = useParams()
    const [applicationDetails, setApplicationDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/getApplicationDetail/${params.id}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                )
                setApplicationDetails(response.data.application)
            } catch (err) {
                setError('Failed to fetch application details')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchApplicationDetails()
    }, [params.id])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />
    if (!applicationDetails) return <NoDataMessage />

    const careerDetails = applicationDetails?.careerId

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8  shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-indigo-800 border-b border-indigo-200 pb-2">{careerDetails?.title}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <InfoSection title="Job Details" bgColor="bg-blue-100">
                    <InfoItem label="Category" value={careerDetails?.category} />
                    <InfoItem label="Status" value={careerDetails?.status} />
                    <InfoItem label="Publish Date" value={new Date(careerDetails?.publish_date).toLocaleDateString()} />
                    <InfoItem label="Last Date" value={new Date(careerDetails?.last_date).toLocaleDateString()} />
                </InfoSection>
                
                <InfoSection title="Application Details" bgColor="bg-purple-100">
                    <InfoItem 
                        label="Selection Status" 
                        value={applicationDetails?.selectionStatus}
                        customStyle={getStatusStyle(applicationDetails?.selectionStatus)}
                    />
                    <InfoItem label="Applied At" value={new Date(applicationDetails?.appliedAt).toLocaleString()} />
                    <InfoItem label="Message" value={applicationDetails?.message} />
                </InfoSection>
            </div>
            
            <InfoSection title="Required Documents" bgColor="bg-green-100">
                <ul className="list-disc list-inside">
                    {careerDetails?.documentName.map((doc, index) => (
                        <li key={index} className="text-gray-700">{doc}</li>
                    ))}
                </ul>
            </InfoSection>
            
            <InfoSection title="Applicant Information" bgColor="bg-yellow-100">
                <InfoItem label="Email" value={applicationDetails?.userId.email} />
            </InfoSection>
        </div>
    )
}

const InfoSection = ({ title, children, bgColor }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-700">{title}</h2>
        <div className={`${bgColor} p-4 rounded-lg shadow-md`}>{children}</div>
    </div>
)

const InfoItem = ({ label, value, customStyle }) => (
    <div className="mb-2">
        <span className="font-semibold text-gray-700">{label}:</span>{' '}
        <span className={`text-gray-800 ${customStyle}`}>{value}</span>
    </div>
)

const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case 'selected':
            return 'text-green-600 font-bold';
        case 'rejected':
            return 'text-red-600 font-bold';
        case 'pending':
            return 'text-yellow-600 font-bold';
        default:
            return '';
    }
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
)

const ErrorMessage = ({ message }) => (
    <div className="text-center py-10 text-red-500 font-semibold">{message}</div>
)

const NoDataMessage = () => (
    <div className="text-center py-10 text-gray-500 font-semibold">No application details found</div>
)

export default AppliedJobDetails