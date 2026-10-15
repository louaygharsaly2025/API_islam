import React from 'react'
import { Link } from 'react-router-dom'

function TebakSurah() {
    return (
        <div>
            <Link to="/game/tebak-surah"
                className="flex flex-col items-center justify-center h-32 p-3 text-center transition bg-white border border-[#e5e9f0] rounded-xl shadow-sm hover:shadow-md">
                <div className="flex items-center justify-center w-10 h-10 p-1 
                  bg-[#fcfeff] border border-[#e5e9f0] rounded-lg">
                    <i className="text-lg text-[#355485] ri-book-line"></i>
                </div>
                <h3 className="mt-2 text-sm font-medium text-[#355485]">
                    Tebak Surah
                </h3>
                <p className="mt-0 text-xs text-[#6d9bbc]">
                    Mulai Game
                </p>
            </Link>
        </div>
    )
}

export default TebakSurah
