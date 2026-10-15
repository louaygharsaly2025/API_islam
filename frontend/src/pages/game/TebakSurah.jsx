// src/pages/game/TebakSurah.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function TebakSurah() {
    const [step, setStep] = useState("menu"); // menu | loading | quiz | result
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [answers, setAnswers] = useState([]);
    const [quizOptions, setQuizOptions] = useState({ total: 5, juzRange: "1-15" });

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    /* ---------- countdown ---------- */
    useEffect(() => {
        if (step !== "quiz") return;
        if (timeLeft === 0) {
            handleAnswer(null); // otomatis tidak terjawab
            return;
        }
        if (selected) return;
        const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, selected, step]);

    /* ---------- audio control ---------- */
    useEffect(() => {
        if (step !== "quiz" || !questions.length) return;

        const q = questions[current];
        if (q.mode === "audio") {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            const audio = new Audio(q.audio);
            audioRef.current = audio;

            audio.onplay = () => setIsPlaying(true);
            audio.onpause = () => setIsPlaying(false);
            audio.onended = () => setIsPlaying(false);

            audio.play().catch(() => { });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };
    }, [current, step]);

    /* ---------- fetch soal ---------- */
    const startGame = async (total, juzRange) => {
        setStep("loading");
        setQuizOptions({ total, juzRange });

        try {
            const [start, end] = juzRange.split("-").map(Number);
            const juzPick =
                Math.floor(Math.random() * (end - start + 1)) + start;

            const res = await fetch(
                `https://api.myquran.com/v2/quran/ayat/juz/${juzPick}`
            );
            const json = await res.json();
            const ayatList = json.data;

            const suratRes = await fetch(
                `https://api.myquran.com/v2/quran/surat/semua`
            );
            const suratJson = await suratRes.json();
            const surahs = suratJson.data;

            const shuffled = [...ayatList].sort(() => Math.random() - 0.5);
            const picked = shuffled.slice(0, total);

            const qs = picked.map((a, i) => {
                const correctSurah = surahs.find(
                    (s) => Number(s.number) === Number(a.surah)
                );

                const wrongs = surahs
                    .filter((s) => s.number !== correctSurah.number)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);

                const options = [...wrongs, correctSurah].sort(
                    () => Math.random() - 0.5
                );

                const mode = Math.random() > 0.5 ? "text" : "audio";
                return {
                    id: `${juzPick}-${i}`,
                    mode,
                    arab: a.arab,
                    text: a.text,
                    audio: a.audio,
                    correct: correctSurah,
                    options,
                };
            });

            setQuestions(qs);
            setCurrent(0);
            setScore(0);
            setSelected(null);
            setTimeLeft(30);
            setAnswers([]);
            setStep("quiz");
        } catch (e) {
            alert("Gagal memuat soal: " + e.message);
            setStep("menu");
        }
    };

    /* ---------- jawab ---------- */
    const handleAnswer = (opt) => {
        if (selected) return;
        setSelected(opt);

        const q = questions[current];
        const isCorrect = opt && opt.number === q.correct.number;
        const poin = Math.round(100 / questions.length);
        if (isCorrect) setScore((s) => s + poin);

        setAnswers((prev) => [
            ...prev,
            {
                ...q,
                userAnswer: opt,
                isCorrect,
            },
        ]);

        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }

        setTimeout(() => {
            if (current + 1 < questions.length) {
                setCurrent((c) => c + 1);
                setSelected(null);
                setTimeLeft(30);
            } else {
                saveHistory(score + (isCorrect ? poin : 0));
                setStep("result");
            }
        }, 1000);
    };

    const saveHistory = (finalScore) => {
        const gameRecord = {
            date: new Date().toLocaleString("id-ID"),
            score: finalScore,
            total: 100,
            jumlahSoal: questions.length,
            range: quizOptions.juzRange,
            details: answers,
        };
        const existing = JSON.parse(localStorage.getItem("tebakSurahHistory")) || [];
        const updated = [gameRecord, ...existing];
        localStorage.setItem("tebakSurahHistory", JSON.stringify(updated.slice(0, 50)));
    };

    /* ---------- UI ---------- */
    if (step === "menu") {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-6 text-[#355485]">🎮 Tebak Surah</h1>
                <div className="space-y-3 w-full max-w-sm">
                    {[5, 10, 15, 20].map((n) => (
                        <div key={n} className="p-4 bg-white rounded-xl shadow">
                            <p className="font-medium mb-2">Jumlah Soal: {n}</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => startGame(n, "1-15")}
                                    className="px-3 py-2 bg-[#355485] text-white rounded-lg"
                                >
                                    Juz 1–15
                                </button>
                                <button
                                    onClick={() => startGame(n, "16-30")}
                                    className="px-3 py-2 bg-[#355485] text-white rounded-lg"
                                >
                                    Juz 16–30
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (step === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                <i className="ri-loader-2-line animate-spin text-3xl mr-2"></i> Memuat soal...
            </div>
        );
    }

    if (step === "quiz") {
        const q = questions[current];
        const poin = Math.round(100 / questions.length);

        return (
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="max-w-xl mx-auto">
                    <div className="flex justify-between mb-4 text-sm">
                        <span>Soal {current + 1} / {questions.length}</span>
                        <span className="font-semibold">Skor: {poin}</span>
                    </div>

                    {/* Timer Bar */}
                    <div className="w-full bg-gray-200 h-2 rounded mb-4">
                        <div
                            className="h-2 rounded bg-[#355485] transition-all"
                            style={{ width: `${(timeLeft / 30) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-right text-xs text-gray-500 mb-3">{timeLeft}s</p>

                    {/* Soal */}
                    {q.mode === "text" ? (
                        <div className="bg-white rounded-xl p-4 mb-4 shadow border text-center">
                            <p className="font-mushaf text-2xl leading-relaxed">{q.arab}</p>
                            <p className="mt-2 text-gray-600 text-sm">{q.text}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4">
                            <div className="flex items-center gap-3 bg-[#f0f1f2] px-4 py-3 rounded-xl shadow-sm w-full max-w-sm justify-center">
                                <i
                                    className={`ri-volume-up-fill text-2xl ${isPlaying ? "text-[#355485] animate-pulse" : "text-gray-500"
                                        }`}
                                ></i>
                                <button
                                    onClick={() => {
                                        if (audioRef.current) {
                                            audioRef.current.currentTime = 0;
                                            audioRef.current.play();
                                        }
                                    }}
                                    className="ml-2 px-4 py-2 bg-[#355485] text-white rounded-lg hover:bg-[#1f3963] shadow transition"
                                >
                                    Putar Ulang
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Audio otomatis diputar, klik tombol untuk ulangi
                            </p>
                        </div>
                    )}

                    {/* Options */}
                    <div className="space-y-3">
                        {q.options.map((opt, idx) => {
                            const answered = selected !== null;
                            const isCorrect = opt.number === q.correct.number;
                            const isSelected = selected && selected.number === opt.number;
                            return (
                                <button
                                    key={idx}
                                    disabled={answered}
                                    onClick={() => handleAnswer(opt)}
                                    className={`w-full p-3 text-left border rounded-lg transition ${answered && isCorrect
                                            ? "bg-green-50 border-green-500 text-green-700"
                                            : answered && isSelected
                                                ? "bg-red-50 border-red-500 text-red-700"
                                                : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    {opt.name_id}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (step === "result") {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8 pb-20">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-2">Hasil Akhir</h2>
                    <p className="text-center text-lg mb-6">
                        Skor Kamu:{" "}
                        <span className="font-bold text-[#355485]">{score}</span>/100
                    </p>

                    {/* Recap */}
                    <div className="space-y-6 border-l-2 border-gray-200 pl-4">
                        {answers.map((item, idx) => (
                            <div key={idx} className="relative">
                                <span
                                    className={`absolute -left-[13px] top-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${item.isCorrect
                                            ? "bg-green-500 text-white"
                                            : item.userAnswer === null
                                                ? "bg-yellow-500 text-white"
                                                : "bg-red-500 text-white"
                                        }`}
                                >
                                    {idx + 1}
                                </span>

                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <p className="font-semibold text-center mb-2 font-mushaf text-gray-800 leading-loose">
                                        {item.arab}
                                    </p>
                                    <p className="text-sm text-gray-600 text-center mb-2">
                                        {item.text}
                                    </p>
                                    <hr className="my-2" />

                                    {item.userAnswer ? (
                                        <div
                                            className={`px-3 py-2 rounded-lg text-sm font-medium w-full flex flex-col items-center text-center ${item.isCorrect
                                                    ? "bg-green-50 text-green-700 border border-green-200"
                                                    : "bg-red-50 text-red-700 border border-red-200"
                                                }`}
                                        >
                                            {item.isCorrect ? (
                                                <span className="text-base font-semibold">
                                                    Jawabanmu benar ({item.userAnswer.name_id})
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="mb-1 text-base font-semibold">
                                                        Jawaban salahmu
                                                    </span>
                                                    <span>{item.userAnswer.name_id}</span>
                                                    <span className="mt-1 text-green-700">
                                                        Benarnya: {item.correct.name_id}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="px-3 py-2 rounded-lg text-sm font-medium w-full flex flex-col items-center text-center bg-yellow-50 text-yellow-700 border border-yellow-200">
                                            <span className="text-base font-semibold">
                                                Kamu tidak menjawab
                                            </span>
                                            <span className="mt-1 text-green-700">
                                                Benarnya: {item.correct.name_id}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tombol */}
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                        <button
                            onClick={() => setStep("menu")}
                            className="px-5 py-2 bg-[#355485] text-white rounded-lg shadow hover:bg-[#1f3963]"
                        >
                            Main Lagi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
