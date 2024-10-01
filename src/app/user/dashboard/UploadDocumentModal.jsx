'use client'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const documentTypes = [
  'Aadhar Card',
  'Pan Card',
  'EBC Certificate',
  'PWD Card',
  'Passport',
  'Other'
]

const UploadDocumentModal = ({ isOpen, onClose ,fetchDocuments}) => {
  const [documentType, setDocumentType] = useState('')
  const [documentDetails, setDocumentDetails] = useState({})
  const [file, setFile] = useState(null)

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value)
    setDocumentDetails({})
  }

  const handleDetailsChange = (e) => {
    setDocumentDetails({
      ...documentDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (file) {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('documentName', documentType || '')
      formData.append('fileName', documentDetails.name || '')

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
          return
        }

        toast.success('Document uploaded successfully!')
        fetchDocuments();
        // Reset form and close modal
        setDocumentType('')
        setDocumentDetails({})
        setFile(null)
        onClose()
      } catch (error) {
        console.error('Error:', error)
        alert(`An error occurred while uploading ${documentType}. Please try again.`)
      }
    } else {
      alert('Please select a file to upload.')
    }
  }

  const renderDynamicFields = () => {
    switch (documentType) {
      case 'Aadhar Card':
        return (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={documentDetails.name || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              required
            />
            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number"
              value={documentDetails.aadharNumber || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </>
        )
      case 'Pan Card':
        return (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={documentDetails.name || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              required
            />
            <input
              type="text"
              name="panNumber"
              placeholder="PAN Number"
              value={documentDetails.panNumber || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </>
        )
      case 'EBC Certificate':
        return (
          <input
            type="text"
            name="certificateNumber"
            placeholder="Certificate Number"
            value={documentDetails.certificateNumber || ''}
            onChange={handleDetailsChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        )
      case 'PWD Card':
        return (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={documentDetails.name || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              required
            />
            <input
              type="text"
              name="udid"
              placeholder="UDID"
              value={documentDetails.udid || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </>
        )
      case 'Passport':
        return (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={documentDetails.name || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              required
            />
            <input
              type="text"
              name="fileNumber"
              placeholder="File Number"
              value={documentDetails.fileNumber || ''}
              onChange={handleDetailsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </>
        )
      default:
        return null
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
              <option value="">Select a document type</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {documentType && (
            <div className="mb-4">
              {renderDynamicFields()}
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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