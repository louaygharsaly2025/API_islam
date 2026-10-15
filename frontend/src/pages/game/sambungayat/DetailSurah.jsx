import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function SurahSambungAyat() {
    const { surahNumber: surahParam } = useParams();
    const surahNumber = Number(surahParam ?? 1);

    /* ---------- state ---------- */
    const [surah, setSurah] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    /* tambahan state untuk play/pause */
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);

    /* ---------- utils ---------- */
    const formatDateId = (dateObj) => {
        const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = bulan[dateObj.getMonth()];
        const y = dateObj.getFullYear();
        const t = dateObj.toLocaleTimeString('id-ID',
            { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `${d} ${m} ${y} | ${t}`;
    };

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    /* ---------- load surah & soal ---------- */
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
                const json = await res.json();
                if (!mounted) return;
                setSurah(json.data);

                const ayat = json.data.ayat;
                const kandidat = ayat.filter(a => a.nomorAyat < json.data.jumlahAyat);
                const jumlahSoal = Math.min(10, kandidat.length);
                const picked = shuffle(kandidat).slice(0, jumlahSoal);

                const qs = picked.map((q) => {
                    const correct = ayat.find(a => a.nomorAyat === q.nomorAyat + 1);
                    const wrongPool = ayat.filter(
                        a => a.nomorAyat !== q.nomorAyat && a.nomorAyat !== correct.nomorAyat
                    );
                    const wrongs = shuffle(wrongPool).slice(0, 3);
                    const options = shuffle([correct, ...wrongs]);
                    return { question: q, correct, options };
                });

                setQuestions(qs);
            } catch (e) {
                console.error(e);
                alert('Gagal memuat data surah: ' + e.message);
            } finally {
                setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
            audioRef.current?.pause();
        };
    }, [surahNumber]);

    /* reset audio saat berpindah soal */
    useEffect(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
    }, [currentQuestion]);

    /* ---------- timer ---------- */
    useEffect(() => {
        if (timeLeft === 0) { handleTimeUp(); return; }
        if (!selectedOption && !gameOver && questions.length) {
            const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [timeLeft, selectedOption, gameOver, questions]);

    /* ---------- history ---------- */
    const saveGameHistory = (finalScore) => {
        const gameRecord = {
            date: formatDateId(new Date()),
            score: finalScore,
            total: 100,
            details: userAnswers,
            game: 'Sambung Ayat',
            mode: 'Per Surah',
            surahName: surah?.namaLatin,
            surahNumber: surah?.nomor,
        };
        const existingHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        const updatedHistory = [gameRecord, ...existingHistory];
        localStorage.setItem('gameHistory', JSON.stringify(updatedHistory.slice(0, 50)));
    };

    /* ---------- logic ---------- */
    const handleAnswer = (option) => {
        if (selectedOption) return;
        setSelectedOption(option);

        const isCorrect = option.nomorAyat === questions[currentQuestion].correct.nomorAyat;
        const poinPerSoal = Math.round(100 / questions.length);
        if (isCorrect) setScore((s) => s + poinPerSoal);

        setUserAnswers(prev => ([
            ...prev,
            { ...questions[currentQuestion], userAnswer: option, isCorrect }
        ]));

        setTimeout(() => {
            if (currentQuestion + 1 < questions.length) {
                setCurrentQuestion(q => q + 1);
                setTimeLeft(30);
                setSelectedOption(null);
            } else {
                const finalScore = isCorrect ? score + poinPerSoal : score;
                setGameOver(true);
                saveGameHistory(finalScore);
                audioRef.current?.pause();
            }
        }, 1200);
    };

    const handleTimeUp = () => {
        setUserAnswers(prev => ([
            ...prev,
            { ...questions[currentQuestion], userAnswer: null, isCorrect: false }
        ]));

        setTimeout(() => {
            if (currentQuestion + 1 < questions.length) {
                setCurrentQuestion(q => q + 1);
                setTimeLeft(30);
                setSelectedOption(null);
            } else {
                setGameOver(true);
                saveGameHistory(score);
                audioRef.current?.pause();
            }
        }, 500);
    };

    const restartGame = () => window.location.reload();

    /* toggle play / pause audio */
    const toggleAudio = () => {
        if (!audioRef.current) {
            const src = questions?.[currentQuestion]?.question?.audio?.["05"];
            if (!src) return;
            audioRef.current = new Audio(src);
        }

        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    /* ---------- UI Loading ---------- */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfeff]">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#cbdde9] border-t-[#355485] rounded-full animate-spin mb-3"></div>
                    <p className="text-[#44515f] font-medium">Memuat soal...</p>
                </div>
            </div>
        );
    }

    /* ---------- UI GameOver ---------- */
    if (gameOver) {
        return (
            <div className="min-h-screen bg-[#fcfeff] px-4 py-8 pb-20">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-1 text-[#1f3963]">Hasil Akhir</h2>
                    <p className="text-center text-lg mb-6 text-[#44515f]">
                        Skor Kamu: <span className="font-bold text-[#355485]">{score}</span>/100
                    </p>

                    {/* Recap Timeline */}
                    <div className="space-y-6 border-l-2 border-[#cbdde9] pl-4">
                        {userAnswers.map((item, idx) => (
                            <div key={idx} className="relative">
                                <span
                                    className={`absolute -left-[13px] top-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${item.isCorrect
                                        ? 'bg-green-500 text-white'
                                        : !item.userAnswer
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-red-500 text-white'
                                        }`}
                                >
                                    {idx + 1}
                                </span>

                                <div className="bg-white border border-[#e5e9f0] rounded-xl p-4 shadow-sm">
                                    <p className="font-semibold text-center mb-2 font-mushaf text-[#1f3963] leading-loose">
                                        {item.question.teksArab} —{' '}
                                        <span className="font-semibold text-[#355485]">
                                            {item.correct.teksArab}
                                        </span>
                                    </p>
                                    <hr className="p-2" />

                                    {item.userAnswer ? (
                                        <div
                                            className={`px-3 py-2 rounded-lg text-sm font-medium font-mushaf w-full flex flex-col items-center text-center ${item.isCorrect
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}
                                        >
                                            {item.isCorrect ? (
                                                <span className="text-base font-semibold">Jawabanmu benar</span>
                                            ) : (
                                                <>
                                                    <span className="mb-2 text-base font-semibold">Jawaban salahmu</span>
                                                    <span className="font-mushaf text-lg mb-1">{item.userAnswer.teksArab}</span>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="px-3 py-2 rounded-lg text-sm font-medium font-mushaf w-full flex flex-col items-center text-center bg-yellow-50 text-yellow-700 border border-yellow-200">
                                            <span className="text-base font-semibold">Kamu tidak menjawab</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-xl divide-x divide-gray-200 overflow-hidden">
                            <button
                                onClick={restartGame}
                                className="w-[120px] py-2.5 text-sm font-medium text-white bg-[#355485] hover:bg-[#1f3963] transition"
                            >
                                <i className="ri-refresh-line"></i> Main Lagi
                            </button>
                            <Link
                                to="/history"
                                className="w-[120px] py-2.5 text-sm font-medium text-[#44515f] hover:bg-[#f0f1f2] transition flex items-center justify-center"
                            >
                                <i className="ri-time-line"></i> History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- UI Soal ---------- */
    const q = questions[currentQuestion];
    return (
        <div className="min-h-screen bg-[#fcfeff] pb-2">
            <div className="max-w-xl mx-auto px-3 container border-x border-[#e5e9f0]">
                {/* Header */}
                <div className="fixed max-w-xl border-b border-[#cbdde9] mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/game" className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]">
                            <i className="ri-arrow-left-line"></i> Sambung Ayat — {surah?.namaLatin ?? `Surah ${surahNumber}`}
                        </Link>
                    </div>
                </div>

                <div className="pt-[70px]">
                    {/* Indikator */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-[#44515f]">
                            Soal <span className="font-semibold">{currentQuestion + 1}</span> / {questions.length}
                        </span>
                        <span className="text-sm font-mono font-semibold text-[#355485] bg-[#eef4f8] px-2 py-1 rounded">
                            {timeLeft}s
                        </span>
                    </div>
                    <div className="h-1 w-full bg-[#cbdde9] rounded mb-4 overflow-hidden">
                        <div
                            className="h-full bg-[#4f90c6] transition-all duration-1000 ease-linear"
                            style={{ width: `${(timeLeft / 30) * 100}%` }}
                        ></div>
                    </div>

                    {/* Ayat */}
                    <div className="bg-white border border-[#e5e9f0] rounded-xl p-5 mb-6 shadow-sm relative">
                        <p dir="rtl" className="text-2xl font-mushaf leading-relaxed text-center text-[#1f3963]">
                            {q.question.teksArab}
                        </p>
                        <button
                            onClick={toggleAudio}
                            className="absolute bottom-2 right-3 text-[#355485] hover:text-[#1f3963] transition"
                            aria-label={isPlaying ? "Jeda audio" : "Putar audio"}
                        >
                            <i className={`text-lg ${isPlaying ? 'ri-volume-mute-line' : 'ri-volume-up-line'}`}></i>
                        </button>
                    </div>

                    {/* Pilihan */}
                    <div className="max-w-md mx-auto px-2">
                        <p className="text-center pb-3 font-medium text-[#44515f]">Silakan pilih jawabanmu</p>
                        <div className="space-y-3">
                            {q.options.map((opt, idx) => {
                                const isCorrect = opt.nomorAyat === q.correct.nomorAyat;
                                const answered = selectedOption !== null;
                                const zebraBase = idx % 2 === 0 ? 'bg-[#fcfeff]' : 'bg-[#f0f1f2]';

                                return (
                                    <button
                                        key={idx}
                                        disabled={answered}
                                        onClick={() => handleAnswer(opt)}
                                        className={`w-full p-3 border rounded-lg text-right text-xl leading-relaxed font-mushaf transition 
                      ${answered && isCorrect ? 'bg-green-50 border-green-500 text-green-700' : ''} 
                      ${answered && !isCorrect && opt.nomorAyat === selectedOption?.nomorAyat ? 'bg-red-50 border-red-500 text-red-700' : ''} 
                      ${!answered ? `${zebraBase} border-[#e5e9f0]` : ''}`}
                                    >
                                        {opt.teksArab}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}