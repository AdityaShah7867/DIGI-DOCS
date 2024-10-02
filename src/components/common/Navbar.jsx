'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Navbar = () => {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Move localStorage access to useEffect to avoid SSR issues
    setRole(localStorage.getItem('role'));
  }, []);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/'); // Redirect to home page after logout
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    setRole(null);
  };

  const handleDashboardRedirect = () => {
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'user') {
      router.push('/user/dashboard');
    }
  };

  return (
    <div>
      <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJthqMbsrV6L5bayHgwmflCHuRoL9t5x12gQ&s"
              alt="DRDO logo"
              className="h-8 w-auto"
            />
            <a href="#" onClick={handleDashboardRedirect} className="text-xl font-bold text-gray-800">DRDO</a>
          </div>
          <div className="flex items-center space-x-6">
            {role && (
              <>
                <a href={`/${role}/dashboard`} className="text-gray-700 hover:text-blue-600">Add Documents</a>
                <a href={`/${role}/career`} className="text-gray-700 hover:text-blue-600">Careers</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
                <a href="/news" className="text-gray-700 hover:text-blue-600">News</a>
              </>
            )}
            {role ? (
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300" onClick={handleLogin}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar