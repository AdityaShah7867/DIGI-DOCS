'use client'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
    const params = useParams()
    const [agreed, setAgreed] = useState(false)

    // Sample document list (replace with actual data)
    const documents = [
        { name: 'Resume', available: true },
        { name: 'Cover Letter', available: true },
        { name: 'References', available: false },
        { name: 'Portfolio', available: false },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted', { agreed, id: params.id })
    }

    return (
        <div className='min-h-screen bg-gray-100 text-gray-800 p-8 flex justify-center items-center'>
            <div className='max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold mb-6 text-center text-blue-600'>Application Documents</h1>
                <div className='mb-8'>
                    <img src='https://adityadevappweb.s3.ap-south-1.amazonaws.com/Screenshot+2024-10-01+184158.png' alt='job' className='w-24 h-auto rounded-md' />
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
                        disabled={!agreed}
                    >
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Page