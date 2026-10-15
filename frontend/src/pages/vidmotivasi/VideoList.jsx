import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VidMotivasi from '../../components/home/VidPopuler';

export default function VideoList() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // default: terbaru (id terbesar)

    // Mengambil data dari file JSON
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/data/vidmotivasi.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // Urutkan berdasarkan ID terbesar pertama (descending) sebagai default
                const sortedVideos = data.sort((a, b) => b.id - a.id);
                setVideos(sortedVideos);
                setFilteredVideos(sortedVideos);
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };

        fetchVideos();
    }, []);

    // Fungsi untuk mengurutkan video berdasarkan kriteria yang dipilih
    const sortVideos = (criteria) => {
        let sortedVideos = [...videos];

        switch (criteria) {
            case 'most_views':
                // Mengubah string views menjadi angka untuk perbandingan
                sortedVideos.sort((a, b) => {
                    const aViews = parseFloat(a.views.replace(',', '.'));
                    const bViews = parseFloat(b.views.replace(',', '.'));
                    return bViews - aViews;
                });
                break;
            case 'oldest':
                sortedVideos.sort((a, b) => a.id - b.id);
                break;
            case 'newest':
                sortedVideos.sort((a, b) => b.id - a.id);
                break;
            case 'oldest_date':
                // Mengubah string tanggal menjadi objek Date untuk perbandingan
                sortedVideos.sort((a, b) => {
                    const months = {
                        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
                        'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
                    };

                    const aDateParts = a.upload_date.split(' ');
                    const bDateParts = b.upload_date.split(' ');

                    const aDate = new Date(parseInt(aDateParts[2]), months[aDateParts[1]], parseInt(aDateParts[0]));
                    const bDate = new Date(parseInt(bDateParts[2]), months[bDateParts[1]], parseInt(bDateParts[0]));

                    return aDate - bDate;
                });
                break;
            case 'newest_date':
                // Mengubah string tanggal menjadi objek Date untuk perbandingan
                sortedVideos.sort((a, b) => {
                    const months = {
                        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
                        'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
                    };

                    const aDateParts = a.upload_date.split(' ');
                    const bDateParts = b.upload_date.split(' ');

                    const aDate = new Date(parseInt(aDateParts[2]), months[aDateParts[1]], parseInt(aDateParts[0]));
                    const bDate = new Date(parseInt(bDateParts[2]), months[bDateParts[1]], parseInt(bDateParts[0]));

                    return bDate - aDate;
                });
                break;
            default:
                break;
        }

        setFilteredVideos(sortedVideos);
        setSortBy(criteria);
        setShowFilter(false); // Tutup sidebar setelah memilih
    };

    // Komponen Sidebar Filter
    const FilterSidebar = () => {
        if (!showFilter) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-hidden">
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={() => setShowFilter(false)}
                ></div>

                {/* Sidebar dari bawah */}
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto shadow-lg">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Urutkan Video</h2>
                        <button
                            onClick={() => setShowFilter(false)}
                            className="text-gray-500 hover:text-gray-800 transition"
                        >
                            <i className="ri-close-line text-2xl"></i>
                        </button>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {/* Populer */}
                        <button
                            onClick={() => sortVideos("most_views")}
                            className={`w-full flex items-center p-4 rounded-xl border transition 
        ${sortBy === "most_views"
                                    ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                                    : "border-gray-300 hover:bg-gray-50 text-gray-800"}`}
                        >
                            <i className={`ri-bar-chart-line mr-3 text-lg 
        ${sortBy === "most_views" ? "text-blue-600" : "text-gray-500"}`}></i>
                            Populer
                        </button>

                        {/* Terbaru */}
                        <button
                            onClick={() => sortVideos("newest_date")}
                            className={`w-full flex items-center p-4 rounded-xl border transition 
        ${sortBy === "newest_date"
                                    ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                                    : "border-gray-200 hover:bg-gray-50 text-gray-800"}`}
                        >
                            <i className={`ri-calendar-event-line mr-3 text-lg 
        ${sortBy === "newest_date" ? "text-blue-600" : "text-gray-500"}`}></i>
                            Terbaru
                        </button>

                        {/* Terlama */}
                        <button
                            onClick={() => sortVideos("oldest_date")}
                            className={`w-full flex items-center p-4 rounded-xl border transition 
        ${sortBy === "oldest_date"
                                    ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                                    : "border-gray-200 hover:bg-gray-50 text-gray-800"}`}
                        >
                            <i className={`ri-calendar-schedule-line mr-3 text-lg 
        ${sortBy === "oldest_date" ? "text-blue-600" : "text-gray-500"}`}></i>
                            Terlama
                        </button>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <div className="min-h-screen pb-2 bg-gray-50">
            {/* Header - di luar container biar full width dan nempel atas */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/"
                        className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Video Motivation
                    </Link>
                    <button
                        className="text-gray-600 hover:text-gray-800 p-1 rounded-full"
                        onClick={() => setShowFilter(true)}
                    >
                        <i className="ri-equalizer-line text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Sidebar Filter */}
            <FilterSidebar />

            <VidMotivasi />

            {/* Konten video dalam bentuk grid seperti YouTube */}
            <div className="flex justify-between items-center pt-3 px-4">
                <h2 className="font-semibold text-[#355485]">Video Terbaru</h2>
            </div>
            <div className='pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto'>
                {filteredVideos.map(video => (
                    <div key={video.id} className="bg-white overflow-hidden transition-all duration-300 border border-gray-100">
                        <Link to={`/detail/video/${video.id}`}>
                            {/* Thumbnail video - FULL WIDTH tanpa padding */}
                            <div className="relative pb-1">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="object-cover w-full aspect-video"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 opacity-0">
                                </div>
                            </div>
                        </Link>

                        {/* Info video */}
                        <div className="p-3">
                            <div className="flex items-start mt-0">
                                {/* Profile image */}
                                <Link to="/profile/storythur">
                                    <img
                                        src="https://fatkhurrhn.vercel.app/preview.jpg"
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full mr-3 object-cover flex-shrink-0"
                                    />
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <Link to={`/detail/video/${video.id}`}>
                                        <h3 className="font-medium text-[14px] text-gray-900 line-clamp-2 mb-1 leading-tight hover:text-black">{video.title}</h3>
                                    </Link>
                                    <div className="flex items-center text-[12px] text-gray-500">
                                        <span>StoryThur</span>
                                        <span className="mx-1">•</span>
                                        <span>{video.views} rb x ditonton</span>
                                        <span className="mx-1">•</span>
                                        <span>{video.upload_date}</span>
                                    </div>
                                </div>

                                {/* More options button */}
                                <button className="text-gray-500 hover:text-gray-800 ml-2 flex-shrink-0">
                                    <i className="ri-more-2-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}