import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const VerifyPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 relative h-64 md:h-auto">
        <Image
          src="https://img.freepik.com/premium-vector/secure-email-otp-authentication-verification-method_258153-468.jpg?semt=ais_hybrid" // Replace with your actual image path
          alt="Verify Email"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Right side - Text and Button */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="max-w-md w-full space-y-8">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Verify Your Email</h1>
          <p className="text-lg mb-8 text-center text-gray-600">Please check your inbox and click the verification link to complete your registration.</p>
          <Link href="https://gmail.com" target="_blank" rel="noopener noreferrer">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Open Gmail
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage