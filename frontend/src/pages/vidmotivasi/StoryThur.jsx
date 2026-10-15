import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function StoryThur() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('terbaru');
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/vidmotivasi.json');
                const data = await response.json();

                // Tambahkan timestamp untuk sorting
                const videosWithTimestamp = data.map(video => {
                    // Parse tanggal dari string format "DD MMM YYYY"
                    const dateParts = video.upload_date.split(' ');
                    const day = parseInt(dateParts[0]);
                    const month = getMonthNumber(dateParts[1]);
                    const year = parseInt(dateParts[2]);

                    return {
                        ...video,
                        upload_timestamp: new Date(year, month, day).getTime(),
                        // Konversi views ke angka untuk sorting
                        views_num: parseFloat(video.views.replace(',', '.')),
                        // Durasi acak antara 1-3 menit untuk simulasi
                        duration: `${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
                    };
                });

                setVideos(videosWithTimestamp);
                filterVideos('terbaru', videosWithTimestamp);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fungsi untuk mendapatkan nomor bulan dari nama bulan (dalam bahasa Indonesia)
    const getMonthNumber = (monthName) => {
        const months = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
            'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
        };
        return months[monthName];
    };

    // Fungsi untuk memfilter video berdasarkan tab aktif
    const filterVideos = (tab, videosList) => {
        let sortedVideos = [...videosList];

        switch (tab) {
            case 'terbaru':
                sortedVideos.sort((a, b) => b.upload_timestamp - a.upload_timestamp);
                break;
            case 'populer':
                sortedVideos.sort((a, b) => b.views_num - a.views_num);
                break;
            case 'terlama':
                sortedVideos.sort((a, b) => a.upload_timestamp - b.upload_timestamp);
                break;
            default:
                break;
        }

        setFilteredVideos(sortedVideos);
    };

    // Handler untuk mengubah tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        filterVideos(tab, videos);
    };

    // Format angka views dengan titik sebagai pemisah ribuan
    const formatViews = (views) => {
        if (typeof views === 'string') {
            return views.replace(',', '.');
        }
        return views;
    };

    // Toggle deskripsi lengkap
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div className="min-h-screen pb-2 bg-gray-50">
            <div className="max-w-xl mx-auto px-3 container border-x border-gray-200 bg-white min-h-screen">
                {/* Header */}
                <div className="fixed max-w-xl border-b border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/video" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
                            <i className="ri-arrow-left-line"></i> Profile
                        </Link>
                        <button className="text-gray-600 hover:text-gray-600">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Channel Info */}
                <div className='pt-[65px] px-2'>
                    <div className="text-gray-900 p-4 px-2 max-w-xl mx-auto">
                        {/* Foto + Info singkat */}
                        <div className="flex items-start gap-4">
                            <img
                                src="https://fatkhurrhn.vercel.app/preview.jpg"
                                alt="fatkhurrhn"
                                className="w-20 h-20 rounded-full object-cover"
                            />

                            <div className="space-y-0.5">
                                <h1 className="text-[18px] font-bold leading-tight">
                                    Fathur | Quotes & Motivation
                                </h1>
                                <p className="text-gray-600 leading-tight text-[12px]">@storythur</p>
                                <p className="text-gray-600 leading-tight text-[12px]">
                                    80 rb subscriber • {videos.length} video
                                </p>
                            </div>

                        </div>

                        {/* Deskripsi + link */}
                        <div className="mt-3 text-sm text-gray-700">
                            <p className={showFullDescription ? "" : "line-clamp-2"}>
                                Tempat di mana kamu bisa menemukan motivasi harian, self-reminder, dan quotes Islami yang menguatkan hati dan jiwa. Lewat setiap video, aku berharap bisa menjadi bagian kecil dari perjalananmu menuju hidup yang lebih baik dan lebih dekat dengan Allah SWT. ✨
                            </p>

                            <button
                                className="text-blue-600 hover:underline text-xs mt-1"
                                onClick={toggleDescription}
                            >
                                {showFullDescription ? "Sembunyikan" : "...selengkapnya"}
                            </button>

                            

                            <div className="mt-1">
                                <a
                                    href="https://tiktok.com/@storythurr"
                                    target="_blank"
                                    className="text-[13px] text-blue-600 hover:underline"
                                >
                                    tiktok.com/@storythurr
                                </a>
                                <span className="text-gray-600 text-[13px]"> dan 3 link lainnya</span>
                            </div>
                        </div>

                        {/* Tombol subscribe di bawah */}
                        <a
                            href="https://instagram.com/storythur"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-4 w-full text-center bg-[#1f3963]  text-white py-2 rounded-lg font-medium"
                        >
                            Subscribe
                        </a>
                    </div>


                    {/* Navigation Tabs */}
                    <div className="flex justify-between border-b border-gray-200 mt-2">
                        <button
                            className={`pb-2 font-medium px-1 ${activeTab === 'terbaru' ? 'text-[#1f3963] border-b-2 border-[#1f3963]' : 'text-gray-600'}`}
                            onClick={() => handleTabChange('terbaru')}
                        >
                            Terbaru
                        </button>
                        <button
                            className={`pb-2 font-medium px-1 ${activeTab === 'populer' ? 'text-[#1f3963] border-b-2 border-[#1f3963]' : 'text-gray-600'}`}
                            onClick={() => handleTabChange('populer')}
                        >
                            Populer
                        </button>
                        <button
                            className={`pb-2 font-medium px-1 ${activeTab === 'terlama' ? 'text-[#1f3963] border-b-2 border-[#1f3963]' : 'text-gray-600'}`}
                            onClick={() => handleTabChange('terlama')}
                        >
                            Terlama
                        </button>
                    </div>

                    {/* Video List */}
                    {loading ? (
                        <div className="mt-3 space-y-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex gap-3 animate-pulse">
                                    <div className="w-40 h-24 bg-gray-200 rounded"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-3 space-y-0 pb-2">
                            {filteredVideos.map((video) => (
                                <Link
                                    to={`/detail/video/${video.id}`}
                                    key={video.id}
                                    className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-[135px] h-[80px] bg-gray-200 rounded overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                            {video.duration}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm leading-tight line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatViews(video.views)} x ditonton
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {video.upload_date}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}