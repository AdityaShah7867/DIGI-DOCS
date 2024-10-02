'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Page = () => {
    const params = useParams()
    const [agreed, setAgreed] = useState(false)
    const [careerForm, setCareerForm] = useState(null)
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [uploadingDoc, setUploadingDoc] = useState(null)
    // Add new state for document values
    const [documentValues, setDocumentValues] = useState({})

    useEffect(() => {
        const fetchCareerForm = async () => {
            try {
                const token = localStorage.getItem('token') // Assuming the token is stored in localStorage
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/getOne/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setCareerForm(response.data.career)
                
                // Get available documents from localStorage
                const availableDocuments = JSON.parse(localStorage.getItem('documentNames') || '[]')
                
                // Create documents array
                const docList = response.data.career.documentName.map(docName => ({
                    name: docName,
                    available: availableDocuments.includes(docName)
                }))
                setDocuments(docList)
            } catch (err) {
                setError('Failed to fetch career form data')
            } finally {
                setLoading(false)
            }
        }

        fetchCareerForm()
    }, [params.id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/apply/${params.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            // Show success toast
            toast.success('Application submitted successfully!')
            
            // Redirect to careers dashboard
            const router = useRouter()
            router.push('/user/dashboard/careers')
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message === "You have already applied for this career.") {
                toast.error('You have already applied for this career.')
            } else {
                setError('Failed to submit application')
                toast.error('Failed to submit application. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (docName, file) => {
        if (!documentValues[docName]) {
            toast.error(`Please enter a value for ${docName} before uploading.`)
            return
        }

        setUploadingDoc(docName)
        const formData = new FormData()
        formData.append('document', file)
        formData.append('docType', docName)
        formData.append('documentName', docName)
        formData.append('value', documentValues[docName])

        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/document/create`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (response.status === 200) {
                toast.success(`${docName} uploaded successfully!`)
                setDocuments(prevDocs => prevDocs.map(doc => 
                    doc.name === docName ? {...doc, available: true} : doc
                ))
                const availableDocuments = JSON.parse(localStorage.getItem('documentNames') || '[]')
                localStorage.setItem('documentNames', JSON.stringify([...availableDocuments, docName]))
                // Clear the value for the uploaded document
                setDocumentValues(prev => ({...prev, [docName]: ''}))
            }
        } catch (err) {
            console.error('Error uploading document:', err)
            toast.error(`Failed to upload ${docName}. Please try again.`)
        } finally {
            setUploadingDoc(null)
        }
    }

    // Add this new function to handle value changes
    const handleValueChange = (docName, value) => {
        setDocumentValues(prev => ({...prev, [docName]: value}))
    }

    const allDocumentsAvailable = documents.every(doc => doc.available)

    return (
        <div className='min-h-screen bg-gray-100 text-gray-800 p-8 flex justify-center items-center'>
            <div className='max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold mb-6 text-center text-blue-600'>Application Documents</h1>
                <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>Document Checklist</h2>
                    <ul className='space-y-3'>
                        {documents.map((doc, index) => (
                            <li key={index} className='flex items-center p-3 bg-gray-50 rounded-md'>
                                <span className={`mr-3 text-lg ${doc.available ? 'text-green-500' : 'text-red-500'}`}>
                                    {doc.available ? '✓' : '✗'}
                                </span>
                                <span className='font-medium'>{doc.name}</span>
                                <span className={`ml-auto ${doc.available ? 'text-green-600' : 'text-red-600'}`}>
                                    {doc.available ? 'Available' : 'Missing'}
                                </span>
                                {!doc.available && (
                                    <div className='ml-4 flex items-center'>
                                        <input
                                            type="text"
                                            placeholder="Enter value"
                                            className="mr-2 p-1 border rounded"
                                            value={documentValues[doc.name] || ''}
                                            onChange={(e) => handleValueChange(doc.name, e.target.value)}
                                        />
                                        <label className='bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition duration-300 cursor-pointer'>
                                            {uploadingDoc === doc.name ? 'Uploading...' : 'Upload'}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleUpload(doc.name, e.target.files[0])}
                                                disabled={uploadingDoc === doc.name}
                                            />
                                        </label>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='flex items-center bg-blue-50 p-4 rounded-md'>
                        <input
                            type='checkbox'
                            id='agreement'
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className='mr-3 h-5 w-5 text-blue-600'
                        />
                        <label htmlFor='agreement' className='text-sm'>
                            I agree to share my documents and all required information
                        </label>
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium 
                                   hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50 
                                   disabled:cursor-not-allowed'
                        disabled={!agreed || !allDocumentsAvailable || loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
                    {!allDocumentsAvailable && (
                        <p className='text-red-500 text-sm text-center'>
                            Please upload all required documents before submitting.
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Page