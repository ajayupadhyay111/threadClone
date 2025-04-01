import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  )
}

export default Error