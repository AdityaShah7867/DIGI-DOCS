'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const CareerPage = () => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    lastDate: "",
    category: "",
    documents: [],
    status: "Open",
    publishDate: "",
  });
  const [openForms, setOpenForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/getAll`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOpenForms(data.career);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const documentOptions = [
    "Aadhar Card",
    "Pan Card",
    "EBC Certificate",
    "PWD Card",
    "Passport",
  ];

  // Remove or comment out this reassignment:
  // openForms = [
  //   {
  //     id: 1,
  //     title: "Job Application",
  //     // ... other properties ...
  //   }
  // ];

  // If you need to set initial data, use setOpenForms instead:
  // useEffect(() => {
  //   setOpenForms([
  //     {
  //       id: 1,
  //       title: "Job Application",
  //       // ... other properties ...
  //     }
  //   ]);
  // }, []);

  const handleChange = (e) => {
    if (e.target.name === 'documents') {
      const updatedDocuments = [...formData.documents];
      if (e.target.checked) {
        updatedDocuments.push(e.target.value);
      } else {
        const index = updatedDocuments.indexOf(e.target.value);
        if (index > -1) {
          updatedDocuments.splice(index, 1);
        }
      }
      setFormData({ ...formData, documents: updatedDocuments });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNewForm(formData);
    setIsPopupOpen(false);
    // Optionally, you can reset the form or fetch updated data here
  };

  const handleRowClick = (id) => {
    router.push(`/admin/career/${id}`);
  };

  const createNewForm = async (data) => {
    try {
      const apiData = {
        title: data.title,
        last_date: data.lastDate,
        category: data.category,
        link: data.link,
        status: data.status,
        publish_date: data.publishDate,
        documentName: data.documents,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form created successfully:', result);
      // You can add a success message or redirect here
    } catch (error) {
      console.error('Error creating form:', error);
      // You can add an error message here
    }
    await fetchForms(); // Refresh the list of forms
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-semibold mb-8 text-gray-900 pb-2 inline-block">
        Open Forms
      </h1>

      <div className="flex justify-end">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-8 hover:bg-blue-700 transition duration-300 font-semibold shadow-md"
        >
          Create New Form
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-800 text-white uppercase text-sm leading-normal">
              <th className="py-4 px-6 text-left font-semibold">Sr. No.</th>
              <th className="py-4 px-6 text-left font-semibold">Title</th>
              <th className="py-4 px-6 text-left font-semibold">Last Date</th>
              <th className="py-4 px-6 text-left font-semibold">Category</th>
              <th className="py-4 px-6 text-left font-semibold">Documents</th>
              <th className="py-4 px-6 text-left font-semibold">Status</th>
              <th className="py-4 px-6 text-left font-semibold">
                Publish Date
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {openForms.map((form, index) => (
              <tr
                key={form._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 cursor-pointer"
                onClick={() => handleRowClick(form._id)}
              >
                <td className="py-4 px-6 font-medium">{index + 1}</td>
                <td className="py-4 px-6 font-medium">{form.title}</td>
                <td className="py-4 px-6">{form.last_date}</td>
                <td className="py-4 px-6">{form.category}</td>
                <td className="py-4 px-6">{form.documentName.join(", ")}</td>
                <td className="py-4 px-6">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {form.status}
                  </span>
                </td>
                <td className="py-4 px-6">{form.publish_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full shadow-2xl">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900 border-b-2 border-blue-500 pb-2">
              Create New Form
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="mb-4">
                  <label className="block mb-2 text-sm font-semibold text-black capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  {key === 'documents' ? (
                    <div className="flex flex-wrap gap-2">
                      {documentOptions.map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            name={key}
                            value={option}
                            checked={formData.documents.includes(option)}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  ) : key === 'status' ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    <input
                      type={key === "lastDate" || key === "publishDate" ? "date" : "text"}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      required
                    />
                  )}
                </div>
              ))}
              <div className="col-span-2 flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="mr-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPage;