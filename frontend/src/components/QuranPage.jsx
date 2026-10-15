// File: src/components/QuranPageFull.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const QuranPageFull = () => {
    const { pageNumber } = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://api.myquran.com/v2/quran/ayat/page/${pageNumber}`);

                if (!response.ok) {
                    throw new Error('Gagal mengambil data');
                }

                const data = await response.json();
                setPageData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPageData();
    }, [pageNumber]);

    // Fungsi untuk mengonversi angka Latin ke angka Arab
    const toArabicNumerals = (num) => {
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().replace(/\d/g, (digit) => arabicNumerals[digit]);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-teal-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-teal-800 text-lg">Memuat halaman {pageNumber}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-teal-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-red-600 mt-4">Terjadi Kesalahan</h2>
                    <p className="text-gray-700 my-4">{error}</p>
                    <Link
                        to="/"
                        className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                        Kembali ke Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-2 bg-teal-50 flex items-center justify-center">
            <div className="w-full px-2 mx-auto">
                {/* Container dengan 15 baris */}
                <div className="bg-white mx-auto rounded-lg shadow-md p-4 quran-container" style={{ height: '85vh' }}>
                    <div className="h-full overflow-hidden">
                        <div className="quran-text h-full text-justify arabic-text">
                            {pageData.data.map((verse) => (
                                <span key={verse.id} className="inline">
                                    <span className="verse-text">{verse.arab}</span>
                                    <sup className="verse-number text-teal-600 text-xs mx-0.5">
                                        ({toArabicNumerals(verse.ayah)})
                                    </sup>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tambahkan style inline untuk memastikan tampilan konsisten */}
            <style jsx>{`
                .verse-text {
                    font-family: 'Scheherazade New', 'Traditional Arabic', serif;
                }
                .arabic-text {
                    font-size: calc(1.5rem + 1vw); /* Ukuran font responsif */
                    line-height: 1.8; /* Line height yang pas untuk 15 baris */
                }
                .quran-container {
                    width: 95vw;
                    max-width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                @media (max-width: 768px) {
                    .arabic-text {
                        font-size: calc(1.3rem + 1vw);
                        line-height: 1.9;
                    }
                    .quran-container {
                        height: 82vh;
                    }
                }
                @media (max-width: 480px) {
                    .arabic-text {
                        font-size: calc(1.2rem + 1vw);
                        line-height: 2.0;
                    }
                    .quran-container {
                        height: 80vh;
                        padding: 0.5rem;
                    }
                    .verse-number {
                        font-size: 0.6rem;
                    }
                }
                @media (min-width: 1200px) {
                    .arabic-text {
                        font-size: 2.2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default QuranPageFull;