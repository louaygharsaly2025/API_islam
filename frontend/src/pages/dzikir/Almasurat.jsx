// src/pages/dzikir/Almasurat.jsx
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Almasurat() {
    useEffect(() => {
        document.title = "Al-Ma'surat - Islamic"
    }, [])

    return (
        <div className="min-h-screen bg-[#fcfeff]">
            <div className="container mx-auto max-w-xl px-4 pt-20">
                <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                    <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
                        <Link
                            to="/dzikir"
                            className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                        >
                            <i className="ri-arrow-left-line"></i> Almasurat
                        </Link>
                        <button className="text-[#355485] ">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>
                {/* Header */}
                <h1 className="text-xl font-semibold text-[#355485] mb-5 text-center">
                    Al-Ma&apos;surat
                </h1>

                {/* Card List */}
                <div className="space-y-3">
                    {/* Dzikir Pagi */}
                    <Link
                        to="/dzikir/almasurat/pagi"
                        className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-[#e5e9f0] hover:shadow-md transition"
                    >
                        <div className="text-left">
                            <h3 className="text-base font-semibold text-gray-800">
                                Dzikir Pagi
                            </h3>
                            <p className="text-sm text-[#6d9bbc] mt-0.5">
                                Bacaan dzikir pagi untuk ketenangan hati
                            </p>
                        </div>
                        <div className="ml-auto text-[#6d9bbc]">
                            <i className="ri-arrow-right-s-line text-xl"></i>
                        </div>
                    </Link>

                    {/* Dzikir Petang */}
                    <Link
                        to="/dzikir/almasurat/petang"
                        className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-[#e5e9f0] hover:shadow-md transition"
                    >
                        <div className="text-left">
                            <h3 className="text-base font-semibold text-gray-800">
                                Dzikir Petang
                            </h3>
                            <p className="text-sm text-[#6d9bbc] mt-0.5">
                                Bacaan dzikir petang sebagai perlindungan
                            </p>
                        </div>
                        <div className="ml-auto text-[#6d9bbc]">
                            <i className="ri-arrow-right-s-line text-xl"></i>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
