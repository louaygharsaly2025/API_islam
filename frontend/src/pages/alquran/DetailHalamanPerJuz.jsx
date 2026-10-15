import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// setup worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function DetailHalamanPerJuz() {
    const { id } = useParams();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [scale, setScale] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [jumpPage, setJumpPage] = useState("");

    // swipe state
    let touchStartX = 0;

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1); // mulai halaman awal
    };

    const goPrevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    const goNextPage = () => {
        if (pageNumber < numPages) setPageNumber(pageNumber + 1);
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleJumpPage = () => {
        const page = parseInt(jumpPage, 10);
        if (page >= 1 && page <= numPages) {
            setPageNumber(page);
            setJumpPage("");
        }
    };

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-100 select-none">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/quran/perhalaman"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Juz {id}
                    </Link>
                </div>
            </div>

            {/* PDF Viewer */}
            <div
                className="flex-1 flex justify-center items-center pt-[5px] pb-[60px]"
                // CLICK navigation
                onClick={(e) => {
                    const x = e.clientX;
                    const width = window.innerWidth;
                    if (x < width / 2) {
                        goPrevPage();
                    } else {
                        goNextPage();
                    }
                }}
                // SWIPE navigation
                onTouchStart={(e) => {
                    touchStartX = e.changedTouches[0].clientX;
                }}
                onTouchEnd={(e) => {
                    const touchEndX = e.changedTouches[0].clientX;
                    if (touchStartX - touchEndX > 50) goNextPage();
                    else if (touchEndX - touchStartX > 50) goPrevPage();
                }}
            >
                <Document file={`https://quran-perhalaman.vercel.app/juz${id}.PDF`} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                        pageNumber={pageNumber}
                        width={windowWidth * scale * 1.2}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>
            </div>

            {/* Footer Controls */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
                <div className="max-w-xl mx-auto flex flex-wrap items-center justify-center gap-2 px-3 py-5 text-sm">
                    <button
                        onClick={goNextPage}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        ◀ Next
                    </button>
                    <span className="px-2 text-gray-600">
                        {pageNumber}/{numPages}
                    </span>
                    <button
                        onClick={goPrevPage}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                         Prev ▶
                    </button>

                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={jumpPage}
                            placeholder="Hal..."
                            onChange={(e) => setJumpPage(e.target.value)}
                            className="w-16 px-2 py-1 border rounded text-sm"
                        />
                        <button
                            onClick={handleJumpPage}
                            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Go
                        </button>
                    </div>

                    <button
                        onClick={() => setScale(scale + 0.2)}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Zoom+
                    </button>
                    <button
                        onClick={() => setScale(scale > 0.4 ? scale - 0.2 : scale)}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Zoom-
                    </button>
                    <button
                        onClick={() => setScale(1)}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleFullscreen}
                        className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                    >
                        {isFullscreen ? "Exit" : "Fullscreen"}
                    </button>
                </div>
            </div>
        </div>
    );
}
