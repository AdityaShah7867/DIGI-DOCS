'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'  // Add this import

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const AdminDashboard = () => {
  const [openForms, setOpenForms] = useState(0)
  const [closedForms, setClosedForms] = useState(0)
  const [applicationsPerDay, setApplicationsPerDay] = useState([])

  useEffect(() => {
    // Fetch data from your API here
    // For demonstration, we'll use mock data
    setOpenForms(15)
    setClosedForms(25)
    setApplicationsPerDay([
      { x: '2023-05-01', y: 5 },
      { x: '2023-05-02', y: 8 },
      { x: '2023-05-03', y: 12 },
      { x: '2023-05-04', y: 7 },
      { x: '2023-05-05', y: 10 },
    ])
  }, [])

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Number of Applications',
      },
    },
    title: {
      text: 'Applications per Day',
      align: 'center',
    },
  }

  const chartSeries = [
    {
      name: 'Applications',
      data: applicationsPerDay,
    },
  ]

  return (
    <div className='min-h-screen bg-white text-black p-8'>
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>
      
      <div className='grid grid-cols-2 gap-8 mb-8'>
        <div className='bg-blue-100 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold mb-2'>Open Forms</h2>
          <p className='text-4xl font-bold'>{openForms}</p>
          <Link href="/admin/career" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            View Open Forms
          </Link>
        </div>
        <div className='bg-green-100 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold mb-2'>Closed Forms</h2>
          <p className='text-4xl font-bold'>{closedForms}</p>
        </div>
      </div>

      <div className='bg-gray-100 p-6 rounded-lg'>
        <Chart options={chartOptions} series={chartSeries} type='line' height={350} />
      </div>
    </div>
  )
}

export default AdminDashboard