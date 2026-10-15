import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ScrollToTop from '../../components/ScrollToTop'

export default function DetailPerJuz() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [juzData, setJuzData] = useState(null)
    const [verses, setVerses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchJuzData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch data juz dari endpoint
                const response = await fetch(`https://api.quran.gading.dev/juz/${id}`)
                const result = await response.json()

                if (result.status !== 200 && result.code !== 200) {
                    throw new Error('Failed to fetch juz data')
                }

                // Set data juz
                setJuzData(result.data)

                // Set data ayat
                if (result.data.verses) {
                    setVerses(result.data.verses)
                } else {
                    throw new Error('Verses data not found in response')
                }

                // Set document title
                document.title = `Juz ${result.data.juz} - Islamic`
            } catch (err) {
                setError(err.message)
                document.title = "Detail Juz - Islamic"
            } finally {
                setIsLoading(false)
            }
        }

        fetchJuzData()
    }, [id])

    // Fungsi untuk mendapatkan nomor juz sebelumnya
    const getPrevJuzId = () => {
        const currentId = parseInt(id)
        return currentId > 1 ? currentId - 1 : 30 // Jika di juz 1, kembali ke juz 30
    }

    // Fungsi untuk mendapatkan nomor juz selanjutnya
    const getNextJuzId = () => {
        const currentId = parseInt(id)
        return currentId < 30 ? currentId + 1 : 1 // Jika di juz 30, lanjut ke juz 1
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    <div className="p-4 text-center text-gray-500">Memuat data juz...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    <div className="p-4 text-center text-red-500">Error: {error}</div>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link
                            to="/quran"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Kembali ke Daftar Juz
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-xl px-2 md:mb-0 pt-6 border-x border-gray-200 bg-white min-h-screen">
                {juzData && (
                    <div className="border-b border-gray-200 p-2">
                        {/* Informasi Juz */}
                        <div className="flex items-center justify-between mb-4">
                            {/* Tombol navigasi ke juz sebelumnya */}
                            <Link
                                to={`/quran/juz/${getPrevJuzId()}`}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/quran/juz/${getPrevJuzId()}`)
                                    window.scrollTo(0, 0)
                                }}
                            >
                                <i className="ri-arrow-left-s-line text-2xl"></i>
                            </Link>

                            {/* Konten Juz */}
                            <div className="text-center flex-1">
                                <Link to="/quran">
                                    <p className="text-gray-900 font-mushaf text-2xl">
                                        Juz {juzData.juz}
                                    </p>
                                    <p className="text-gray-600">
                                        {juzData.juzStartInfo} - {juzData.juzEndInfo}
                                    </p>
                                    <p className="text-[12px] text-gray-500">
                                        {juzData.totalVerses} Ayat
                                    </p>
                                </Link>
                            </div>

                            {/* Tombol navigasi ke juz selanjutnya */}
                            <Link
                                to={`/quran/juz/${getNextJuzId()}`}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/quran/juz/${getNextJuzId()}`)
                                    window.scrollTo(0, 0)
                                }}
                            >
                                <i className="ri-arrow-right-s-line text-2xl"></i>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Daftar Ayat */}
                <div className="divide-y divide-gray-100">
                    {verses.map((verse, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-4">
                                {/* Icon kiri */}
                                <button className="text-gray-500 hover:text-gray-700">
                                    <i className="ri-more-2-fill text-xl"></i>
                                </button>

                                {/* Teks Arab kanan */}
                                <p className="font-mushaf text-[23px] leading-loose text-right flex-1 ml-4">
                                    {verse.text.arab}
                                </p>
                            </div>

                            {/* Terjemahan */}
                            <div className='text-[15px]'>
                                <p className="text-gray-800 text-justify">
                                    <span className="mr-2 font-semibold">({verse.number.inSurah})</span>{verse.translation.id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ScrollToTop />
        </div>
    )
}