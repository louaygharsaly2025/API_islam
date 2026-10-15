import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function VidMotivasi() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch("/data/vidmotivasi.json");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                // Mengubah string views menjadi angka untuk sorting
                const processedVideos = data.map(video => ({
                    ...video,
                    // Mengubah format "12,3" menjadi 12.3 (float)
                    numericViews: parseFloat(video.views.replace(',', '.'))
                }));

                // Mengurutkan berdasarkan views terbanyak (descending)
                const sortedVideos = processedVideos.sort((a, b) => b.numericViews - a.numericViews);

                // Mengambil hanya 6 video dengan views terbanyak
                setVideos(sortedVideos.slice(0, 6));
            } catch (error) {
                console.error("Error fetching video data:", error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="px-4 pt-[75px]">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-[#355485]">Video Populer</h2>
            </div>

            {/* List video (scroll horizontal) */}
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                {videos.map((video) => (
                    <Link
                        key={video.id}
                        to={`/detail/video/${video.id}`}
                        className="flex-shrink-0 w-[160px] rounded-lg"
                    >
                        {/* Thumbnail */}
                        <div className="relative">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-[240px] object-cover rounded-[9px]"
                            />

                            {/* Overlay play button */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 opacity-0 hover:bg-opacity-30 hover:opacity-100 rounded-t-lg">
                                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full bg-opacity-80">
                                    <i className="ri-play-fill text-[#355485] text-lg"></i>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
                                <div className="flex flex-col">
                                    {/* Title */}
                                    <span className="text-white leading-tight text-sm font-semibold line-clamp-2">
                                        {video.title}
                                    </span>

                                    {/* Views */}
                                    <span className="text-xs text-gray-200 mt-1 font-medium">
                                        {video.numericViews.toFixed(1).replace('.', ',')} rb ditonton
                                    </span>
                                </div>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default VidMotivasi;