import React, { useState, useEffect } from 'react';

export default function HybridCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [hijriData, setHijriData] = useState({});
    const [loading, setLoading] = useState(false);
    const [specialDates, setSpecialDates] = useState({});

    // Fungsi untuk mendapatkan jumlah hari dalam bulan
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Fungsi untuk mendapatkan hari pertama dalam bulan
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Fungsi untuk mengubah bulan
    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // Fungsi untuk mendapatkan data Hijriyah untuk tanggal tertentu
    const fetchHijriDate = async (gregorianDate) => {
        const formattedDate = `${gregorianDate.getDate().toString().padStart(2, '0')}-${(gregorianDate.getMonth() + 1).toString().padStart(2, '0')}-${gregorianDate.getFullYear()}`;

        try {
            setLoading(true);
            const response = await fetch(`https://api.aladhan.com/v1/gToH/${formattedDate}?calendarMethod=UAQ`);
            const data = await response.json();

            if (data.code === 200) {
                setHijriData(prev => ({
                    ...prev,
                    [formattedDate]: data.data.hijri
                }));
            }
        } catch (error) {
            console.error('Error fetching hijri date:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk mendapatkan nama bulan Indonesia
    const getIndonesianMonthName = (monthIndex) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[monthIndex];
    };

    // Fungsi untuk mendapatkan nama hari Indonesia
    const getIndonesianDayName = (dayIndex) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[dayIndex];
    };

    // Fungsi untuk menangani klik tanggal
    const handleDateClick = (date, isCurrentMonth = true) => {
        if (isCurrentMonth) {
            setSelectedDate(date);

            // Format tanggal untuk kunci
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

            // Jika data Hijriyah belum ada, fetch dari API
            if (!hijriData[formattedDate]) {
                fetchHijriDate(date);
            }
        }
    };

    // Effect untuk mengambil data awal
    useEffect(() => {
        // Ambil data tanggal hari ini
        const today = new Date();
        const formattedToday = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

        if (!hijriData[formattedToday]) {
            fetchHijriDate(today);
        }

        // Set data tanggal penting (contoh)
        setSpecialDates({
            '15-08-2023': 'Hari Kemerdekaan RI',
            '01-01-2024': 'Tahun Baru Masehi',
            '12-04-2024': 'Hari Raya Idul Fitri 1445 H'
        });
    }, []);

    // Generate kalender
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Hitung jumlah hari di bulan sebelumnya
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    // Tambahkan hari dari bulan sebelumnya
    for (let i = daysInPrevMonth - firstDayOfMonth + 1; i <= daysInPrevMonth; i++) {
        days.push(new Date(prevYear, prevMonth, i));
    }

    // Tambahkan hari dalam bulan
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }

    // Hitung sisa hari untuk mengisi minggu terakhir
    const totalCells = 42; // 6 minggu x 7 hari
    const remainingDays = totalCells - days.length;

    // Tambahkan hari dari bulan berikutnya
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(nextYear, nextMonth, i));
    }

    return (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h2 className="text-lg font-semibold text-gray-800 text-center">
                    {getIndonesianMonthName(month)} {year}
                </h2>

                <button
                    onClick={() => changeMonth(1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}

                {days.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === month;
                    const day = date.getDate();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

                    return (
                        <div
                            key={index}
                            onClick={() => handleDateClick(date, isCurrentMonth)}
                            className={`h-9 w-9 flex items-center justify-center rounded-lg cursor-pointer transition-all ${isCurrentMonth
                                    ? isToday
                                        ? "bg-blue-100 border border-blue-300"
                                        : isSelected
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100"
                                    : "text-gray-400 hover:bg-gray-100"
                                }`}
                        >
                            <span className={`text-sm font-medium ${isSelected ? "text-white" : isCurrentMonth ? "text-gray-800" : "text-gray-400"}`}>
                                {day}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Informasi tanggal yang dipilih */}
            {selectedDate && (
                <div className="mt-4 p-1">
                    {loading ? (
                        <p className="text-sm text-gray-600">Memuat data Hijriyah...</p>
                    ) : (
                        <>
                            {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`] ? (
                                <p className="text-sm text-gray-600">
                                    {selectedDate.getDate()} {getIndonesianMonthName(selectedDate.getMonth())} {selectedDate.getFullYear()} | {
                                        hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].day} {
                                        hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].month.en
                                    } {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].year} H
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600">Data Hijriyah tidak tersedia</p>
                            )}

                            {specialDates[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`] && (
                                <p className="text-sm text-green-600 mt-1">
                                    {specialDates[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`]}
                                </p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}