import React, { useEffect } from 'react'
import HybridCalendar from '../../components/HybridCalendar'
import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

export default function Home() {
    useEffect(() => {
        document.title = "Kalender | Ihsanly – Daily Muslim";
    }, []);

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
                <div className="fixed top-0 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 border border-gray-200 bg-white px-3 py-4">
                    <div className="flex items-center justify-between">
                        {/* Kiri: Back */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-[15px] font-semibold text-[#355485]"
                        >
                            <i className="ri-arrow-left-line"></i>
                            Kalender
                        </Link>

                        {/* Kanan: Settings */}
                        <div className="flex items-center gap-3">
                            <button className="text-[#355485]">
                                <i className="ri-settings-5-line text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
                {/* tempat isi kontennya */}
                <div className="pt-[65px]">
                    <HybridCalendar />
                </div>
            </div>
            <BottomNav/>
        </div>
    )
}
