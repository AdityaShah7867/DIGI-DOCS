"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

const CareerPage = () => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    lastDate: "",
    category: "",
    link: "",
    documents: "",
    status: "Open",
    publishDate: "",
  });

  const openForms = [
    {
      id: 1,
      title: "Job Application",
      lastDate: "2023-12-31",
      category: "Employment",
      link: "https://example.com/job",
      documents: "Resume, Cover Letter",
      status: "Open",
      publishDate: "2023-11-01",
    },
    {
      id: 2,
      title: "Internship Program",
      lastDate: "2023-11-30",
      category: "Internship",
      link: "https://example.com/intern",
      documents: "CV, Transcript",
      status: "Open",
      publishDate: "2023-10-15",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsPopupOpen(false);
  };

  const handleRowClick = (id) => {
    router.push(`/admin/career/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-semibold mb-8 text-gray-900  pb-2 inline-block">
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
              <th className="py-4 px-6 text-left font-semibold">Link</th>
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
                key={form.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 cursor-pointer"
                onClick={() => handleRowClick(form.id)}
              >
                <td className="py-4 px-6 font-medium">{index + 1}</td>
                <td className="py-4 px-6 font-medium">{form.title}</td>
                <td className="py-4 px-6">{form.lastDate}</td>
                <td className="py-4 px-6">{form.category}</td>
                <td className="py-4 px-6">
                  <a
                    href={form.link}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                </td>
                <td className="py-4 px-6">{form.documents}</td>
                <td className="py-4 px-6">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {form.status}
                  </span>
                </td>
                <td className="py-4 px-6">{form.publishDate}</td>
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
                  <input
                    type={
                      key === "lastDate" || key === "publishDate"
                        ? "date"
                        : key === "status"
                        ? "select"
                        : "text"
                    }
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    required
                  />
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
