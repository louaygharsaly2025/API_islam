import React from 'react'

function PrayersSection() {
    const prayers = [
        { name: "Fajr", time: "4:37 AM" },
        { name: "Dhuhr", time: "11:55 AM" },
        { name: "Asr", time: "3:14 PM" },
        { name: "Maghrib", time: "5:53 PM" },
        { name: "Isha", time: "7:03 PM" },
    ];
    return (
        <>
            {/* Prayer times row */}
            <div className="flex justify-around py-3 px-2 border-b bg-[#fcfeff]">
                {prayers.map((p, i) => (
                    <div key={i} className="text-center flex flex-col items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#355485] mb-0.5"></span>
                        <p className="text-sm font-medium text-[#355485]">{p.name}</p>
                        <p className="text-xs text-[#6d9bbc]">{p.time}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default PrayersSection
