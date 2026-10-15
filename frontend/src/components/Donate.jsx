import React from 'react'
import { Link } from 'react-router-dom'

export default function Donate() {
    return (
        <>
            <div className="h-[1px] my-4 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 max-w-lg mx-auto">
                <Link to="/donate" className="flex items-center px-4 py-2 mb-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="text-left">
                        <h3 className="text-sm font-medium text-gray-800">Donate</h3>
                        <p className="text-gray-600 text-xs mt-0.5">deskripsi</p>
                    </div>
                    <div className="ml-auto text-gray-400">
                        <i className="ri-arrow-right-s-line text-lg"></i>
                    </div>
                </Link>
            </div>
        </>
    )
}
