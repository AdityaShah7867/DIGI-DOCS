import React from 'react';

const DocumentUploadCard = ({ document, onDocNameChange, onFileUpload }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{document.name}</h3>
      <input
        type="text"
        placeholder="Document Name"
        value={document.docName}
        onChange={(e) => onDocNameChange(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="file"
        onChange={(e) => onFileUpload(e.target.files[0])}
        className="hidden"
        id={`file-${document.type}`}
      />
      <label
        htmlFor={`file-${document.type}`}
        className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md cursor-pointer transition duration-300 ease-in-out"
      >
        {document.file ? 'Change File' : 'Choose File'}
      </label>
      {document.file && (
        <p className="mt-2 text-sm text-gray-600 truncate">{document.file.name}</p>
      )}
    </div>
  );
};

export default DocumentUploadCard;