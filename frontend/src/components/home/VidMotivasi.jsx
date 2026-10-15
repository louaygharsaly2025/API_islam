import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function VidMotivasi() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch("/data/vidmotivasi.json");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                // Urutkan dari ID terbesar ke terkecil dan ambil 5 video pertama
                const sortedVideos = data
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 5);

                setVideos(sortedVideos);
            } catch (error) {
                console.error("Error fetching video data:", error);
                setError("Gagal memuat data video. Pastikan file JSON tersedia.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-[#355485]">Video Motivasi</h2>
                    <div className="text-[#6d9bbc] text-sm">More</div>
                </div>
                <div className="flex space-x-3 overflow-x-auto pb-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-48 bg-gray-200 rounded-md animate-pulse">
                            <div className="w-full h-28 bg-gray-300 rounded-t-md"></div>
                            <div className="p-2">
                                <div className="h-3 mb-2 bg-gray-300 rounded"></div>
                                <div className="flex justify-between">
                                    <div className="h-2 w-16 bg-gray-300 rounded"></div>
                                    <div className="h-2 w-12 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-[#355485]">Video Motivasi</h2>
                    <div className="text-[#6d9bbc] text-sm">More</div>
                </div>
                <div className="p-3 text-center text-red-500 bg-red-100 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 mt-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-[#355485]">Video Motivasi</h2>
                <Link to="/video">
                    <i className="ri-arrow-right-s-line text-xl text-[#6d9bbc]"></i>
                </Link>
            </div>

            {/* List video (scroll horizontal) */}
            <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                {videos.map((video) => (
                    <Link
                        key={video.id}
                        to={`/detail/video/${video.id}`}
                        className="flex-shrink-0 w-48 rounded-md bg-white shadow-sm"
                    >
                        {/* Thumbnail */}
                        <div className="relative">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-28 object-cover rounded-t-md"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 opacity-0 hover:bg-opacity-30 hover:opacity-100">
                                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full bg-opacity-80">
                                    <i className="ri-play-fill text-[#355485] text-lg"></i>
                                </div>
                            </div>
                        </div>

                        {/* Info video */}
                        <div className="px-0 py-2">
                            <h3 className="font-medium text-[13px] text-gray-800 line-clamp-2">
                                {video.title}
                            </h3>
                            <div className="flex items-center justify-between mt-1 text-[11px] text-[#6d9bbc]">
                                <span>{video.views.toLocaleString()} rb x ditonton • {video.upload_date}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default VidMotivasi;