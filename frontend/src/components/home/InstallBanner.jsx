import { useEffect, useState } from "react";

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        // deteksi apakah app udah mode standalone (udah install)
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone;
        setIsInstalled(isStandalone);

        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", () => setIsInstalled(true));

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User install choice:", outcome);
        setDeferredPrompt(null);
    };

    return (
        <div className="px-4 pt-2">
            <div className="mb-4 rounded-[13px] bg-gradient-to-r from-[#355485] to-[#4f90c6] p-4 text-white">
                <div className="flex items-center justify-between">
                    {/* Icon + Text */}
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="font-bold text-base">Install AlFath</p>
                            {!isInstalled ? (
                                <p className="text-sm text-white/90">
                                    Rasakan pengalaman lebih cepat dengan aplikasi
                                </p>
                            ) : (
                                <p className="text-sm text-white/90">
                                    Aplikasi sudah terpasang, nikmati kemudahan akses 🎉
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Button */}
                    {!isInstalled ? (
                        <button
                            onClick={handleInstall}
                            className="ml-4 px-4 py-2 rounded-lg bg-white text-[#355485] font-semibold text-sm shadow hover:bg-gray-100 transition"
                        >
                            Install
                        </button>
                    ) : (
                        <span className="ml-4 px-4 py-2 rounded-lg bg-white/20 text-white font-medium text-sm shadow">
                            Terpasang
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
