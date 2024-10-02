"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link"; // Add this import

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AdminDashboard = () => {
  const [openForms, setOpenForms] = useState(0);
  const [closedForms, setClosedForms] = useState(0);
  const [applicationsPerDay, setApplicationsPerDay] = useState([]);
  const [applicationsByCategory, setApplicationsByCategory] = useState([]);

  const [applications, setApplications] = useState([]);

  const application = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/getAll`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    console.log(data);
  };

  const fetchAllCareerForms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/getAll`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      
      // Process the data for the bar chart
      const titleCount = {};
      data.career.forEach(form => {
        if (titleCount[form.title]) {
          titleCount[form.title] += form.applicants.length;
        } else {
          titleCount[form.title] = form.applicants.length;
        }
      });

      const processedData = Object.entries(titleCount).map(([title, count]) => ({
        title,
        count
      }));

      setApplicationsByCategory(processedData);
    } catch (error) {
      console.error("Error fetching career forms:", error);
    }
  };

  useEffect(() => {
    application();
    fetchAllCareerForms();
    // Fetch form count data from the API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careerForm/countNum`)
      .then((response) => response.json())
      .then((data) => {
        setOpenForms(data.open);
        setClosedForms(data.close);
      })
      .catch((error) => console.error("Error fetching form count:", error));

    // Fetch applications per day data (you'll need to implement this API endpoint)
    // For now, we'll keep the mock data
    setApplicationsPerDay([
      { x: "2023-10-01", y: 5 },
      { x: "2023-10-02", y: 7 },
      { x: "2023-10-03", y: 3 },
      { x: "2023-10-04", y: 8 },
      { x: "2023-10-05", y: 10 },
    ]);
  }, []);

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      title: {
        text: "Number of Applications",
      },
    },
    title: {
      text: "Applications per Day",
      align: "center",
    },
  };

  const chartSeries = [
    {
      name: "Applications",
      data: applicationsPerDay,
    },
  ];

  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Open Forms", "Closed Forms"],
    colors: ["#10B981", "#EF4444"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const pieChartSeries = [openForms, closedForms];

  const barChartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: applicationsByCategory.map((item) => item.title),
    },
    yaxis: {
      title: {
        text: "Number of Applicants",
      },
    },
    colors: ["#3B82F6"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Applicants by Job Title",
      align: "center",
    },
  };

  const barChartSeries = [
    {
      name: "Applicants",
      data: applicationsByCategory.map((item) => item.count),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Open Forms</h2>
          <p className="text-4xl font-bold text-green-600">{openForms}</p>
          <Link
            href="/admin/career"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            View Open Forms
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Closed Forms</h2>
          <p className="text-4xl font-bold text-red-600">{closedForms}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Chart
            options={pieChartOptions}
            series={pieChartSeries}
            type="pie"
            height={350}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
