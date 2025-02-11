import React from 'react'
import { Link } from 'react-router-dom';

const TripDetailsCard = () => {
  return (
    <div className="max-w-sm rounded-3xl bg-white shadow-lg text-center">
      <div className="bg-sky-100 p-4 rounded-t-3xl">
        <h2 className="text-xl font-semibold">Trip Details</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <span className="text-gray-600 text-sm">From</span>
          <h3 className="text-2xl font-bold">Bangalore</h3>
          <p className="text-gray-600">Indiranagar</p>
        </div>

        <div className="space-y-1">
          <span className="text-gray-600 text-sm">to</span>
          <h3 className="text-2xl font-bold">Chennai</h3>
          <p className="text-gray-600">ECR</p>
        </div>

        <div className="space-y-4">
          <p className="text-lg">23/01/2025</p>
          <button className="w-24 bg-gradient-to-r from-blue-300 to-blue-400 text-white py-2 px-6 rounded-full hover:bg-gray-800 transition-colors">
            <Link to="/">Modify</Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripDetailsCard
