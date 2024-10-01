'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const router = useRouter();
    const handleLogin = () => {
      router.push('/auth/login');
    };
  return (
    <div>
           <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJthqMbsrV6L5bayHgwmflCHuRoL9t5x12gQ&s" // Update with actual DRDO logo URL
              alt="DRDO logo"
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-800">DRDO</h1>
          </div>
          <div className="flex items-center space-x-6">
            <a href="/careers" className="text-gray-700 hover:text-blue-600">Careers</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            <a href="/news" className="text-gray-700 hover:text-blue-600">News</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar