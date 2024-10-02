'use client'
import React, { useState, useMemo } from 'react'
import toast from 'react-hot-toast'

const allDocumentTypes = [
  'Aadhar Card',
  'Pan Card',
  'EBC Certificate',
  'PWD Card',
  'Passport',
  'Caste Certificate',
  '10th Marksheet',
  '12th Marksheet',
  'Other'
]

const UploadDocumentModal = ({ isOpen, onClose, fetchDocuments, uploadedDocumentTypes }) => {
  const [documentType, setDocumentType] = useState('')
  const [documentValue, setDocumentValue] = useState('')
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter out already uploaded document types
  const availableDocumentTypes = useMemo(() => {
    return allDocumentTypes.filter(type => !uploadedDocumentTypes.includes(type))
  }, [uploadedDocumentTypes])

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value)
    setDocumentValue('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (file && !isLoading) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('document', file)
      formData.append('docType', documentType)
      formData.append('documentName', documentType)
      formData.append('value', documentValue)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData,
        })

        if (!response.ok) {
          toast.error(`Error uploading ${documentType}. Please try again.`)
          setIsLoading(false)
          return
        }

        toast.success('Document uploaded successfully!')
        fetchDocuments();
        // Reset form and close modal
        setDocumentType('')
        setDocumentValue('')
        setFile(null)
        setIsLoading(false)
        onClose()
      } catch (error) {
        console.error('Error:', error)
        toast.error(`An error occurred while uploading ${documentType}. Please try again.`)
        setIsLoading(false)
      }
    } else if (!file) {
      toast.error('Please select a file to upload.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Document</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentType">
              Document Type
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={handleDocumentTypeChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="" className='bg-gray-200'>Select a document type</option>
              {allDocumentTypes.map((type) => (
                <option 
                  key={type} 
                  value={type}
                  className={uploadedDocumentTypes.includes(type) && type !== 'Other' ? 'bg-gray-200' : ''}
                  disabled={uploadedDocumentTypes.includes(type) && type !== 'Other'}
                >
                  {type}{uploadedDocumentTypes.includes(type) && type !== 'Other' ? ' (Already Uploaded)' : ''}
                </option>
              ))}
            </select>
          </div>
          {documentType && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentValue">
                {documentType === 'PAN Card' ? 'PAN Card Number' :
                 documentType === 'Aadhar Card' ? 'Aadhar Number' :
                 documentType === 'PWD Card' ? 'UDID Number' :
                 documentType === 'EBC Certificate' ? 'Bar code Number' :
                 documentType === 'Passport' ? 'Passport Number' :
                 documentType === 'Caste Certificate' ? 'Caste Certificate Number' :
                 `${documentType} Value`}
              </label>
              <input
                type="text"
                id="documentValue"
                value={documentValue}
                onChange={(e) => setDocumentValue(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={documentType === 'PAN Card' ? 'Enter PAN Card Number' :
                   documentType === 'Aadhar Card' ? 'Enter Aadhar Number' :
                   documentType === 'PWD Card' ? 'Enter UDID Number' :
                   documentType === 'EBC Certificate' ? 'Enter Bar code Number' :
                   documentType === 'Caste Certificate' ? 'Enter Caste Certificate Number' :
                   documentType === 'Passport' ? 'Enter Passport Number' :
                   `Enter ${documentType} Value`}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              File
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadDocumentModal