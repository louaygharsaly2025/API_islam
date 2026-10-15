import React, { useEffect, useState } from "react";

export default function LandingPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // deteksi mode standalone (sudah install)
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

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="ri-islamic-line text-3xl text-[#355485] mr-2"></i>
            <span className="text-xl font-bold text-[#44515f]">AlFath</span>
            <span className="text-lg text-[#6d9bbc] ml-1 hidden sm:inline">– Muslim Daily</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-[#4f90c6] transition-colors">Fitur</a>
            <a href="#testimonials" className="hover:text-[#4f90c6] transition-colors">Testimoni</a>
            <a href="#about" className="hover:text-[#4f90c6] transition-colors">Tentang</a>
            <a href="#faq" className="hover:text-[#4f90c6] transition-colors">FAQ</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#44515f]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="hover:text-[#4f90c6] transition-colors" onClick={() => setIsMenuOpen(false)}>Fitur</a>
              <a href="#testimonials" className="hover:text-[#4f90c6] transition-colors" onClick={() => setIsMenuOpen(false)}>Testimoni</a>
              <a href="#about" className="hover:text-[#4f90c6] transition-colors" onClick={() => setIsMenuOpen(false)}>Tentang</a>
              <a href="#faq" className="hover:text-[#4f90c6] transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#355485] to-[#4f90c6] text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-6">
              <i className="ri-star-fill text-yellow-300 mr-2"></i>
              <span className="text-sm">Aplikasi Islami Terbaik 2025 hhe</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-4">
              AlFath – Muslim Daily
            </h1>
            <p className="text-lg mb-8 text-[#cbdde9] leading-relaxed">
              Satu aplikasi Islami sederhana yang bisa menemani setiap harimu:
              jadwal sholat, Quran, dzikir, motivasi, kiblat, zakat, hingga habit tracker.
              Semua dalam genggaman.
            </p>
            {!isInstalled ? (
              <button
                onClick={handleInstall}
                className="px-6 py-3 rounded-lg bg-white text-[#355485] font-semibold shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1 flex items-center"
              >
                <i className="ri-download-cloud-fill mr-2"></i>
                Install AlFath Sekarang
              </button>
            ) : (
              <span className="px-6 py-3 rounded-lg bg-white/20 text-white font-medium shadow inline-flex items-center">
                <i className="ri-checkbox-circle-fill mr-2"></i>
                Sudah Terpasang 🎉
              </span>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center">
                <i className="ri-user-heart-line text-xl mr-2"></i>
                <span>100+ Pengguna</span>
              </div>
              <div className="flex items-center">
                <i className="ri-star-fill text-xl text-yellow-300 mr-2"></i>
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Background Accent */}
              <div className="absolute -inset-4 bg-[#90b6d5] rounded-2xl rotate-6 opacity-50" />

              {/* Card */}
              <div className="relative bg-white p-2 rounded-2xl shadow-xl">
                <img
                  className="w-48 max-w-xs md:max-w-md object-contain"
                  src="/home.png"
                  alt="Preview aplikasi AlFath - Muslim Daily"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#355485]">100+</div>
              <div className="text-[#6d7b85]">Pengguna</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#355485]">4.9★</div>
              <div className="text-[#6d7b85]">Rating</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#355485]">15+</div>
              <div className="text-[#6d7b85]">Fitur</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#355485]">100%</div>
              <div className="text-[#6d7b85]">Gratis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-[#fcfeff]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#44515f] mb-4">Fitur Unggulan</h2>
            <p className="text-[#6d7b85]">AlFath menghadirkan semua yang Anda butuhkan untuk kehidupan muslim sehari-hari dalam satu aplikasi sederhana</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "ri-calendar-schedule-line", title: "Jadwal Sholat", desc: "Akurat sesuai lokasi dengan notifikasi." },
              { icon: "ri-book-open-line", title: "Al-Quran Digital", desc: "Lengkap dengan terjemahan dan audio." },
              { icon: "ri-compass-3-line", title: "Arah Kiblat", desc: "Kompas presisi ke arah Ka'bah." },
              { icon: "ri-heart-2-line", title: "Dzikir & Doa", desc: "Kumpulan dzikir harian dan doa pilihan." },
              { icon: "ri-gamepad-line", title: "Game Islami", desc: "Belajar sambil bermain tebak ayat/surah." },
              { icon: "ri-line-chart-line", title: "Habit Tracker", desc: "Pantau ibadah harian dengan grafik." },
              { icon: "ri-calendar-event-line", title: "Kalender Islam", desc: "Tanggal hijriyah dan event penting." },
              { icon: "ri-alarm-warning-line", title: "Pengingat Ibadah", desc: "Atur pengingat untuk ibadah harian." },
              { icon: "ri-search-eye-line", title: "Temukan Masjid", desc: "Cari masjid terdekat di sekitar Anda." },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#f0f1f2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${f.icon} text-3xl text-[#4f90c6]`}></i>
                </div>
                <h3 className="text-xl font-semibold text-[#44515f] mb-2 text-center">
                  {f.title}
                </h3>
                <p className="text-[#a6b0b6] text-center">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#44515f] mb-4">Lihat Tampilan Aplikasi</h2>
            <p className="text-[#6d7b85]">Desain yang intuitif dan mudah digunakan untuk pengalaman terbaik</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { src: "/screenshots/home.png", alt: "Home App" },
              { src: "/screenshots/quran.png", alt: "Quran App" },
              { src: "/screenshots/quotes.png", alt: "Quotes App" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="w-64 shadow-xl rounded-2xl overflow-hidden border-4 border-white"
              >
                {/* Browser Header */}
                <div className="h-12 bg-gray-100 flex items-center px-4">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="h-80 bg-gradient-to-br from-[#355485] to-[#4f90c6] flex items-center justify-center">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-[#fcfeff]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#44515f] mb-4">Apa Kata Pengguna?</h2>
            <p className="text-[#6d7b85]">Dengarkan pengalaman langsung dari pengguna setia AlFath</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Ahmad", role: "Mahasiswa", text: "Sejak install AlFath, saya jadi lebih disiplin sholat tepat waktu. Fitur notifikasinya sangat membantu!", avatar: "A" },
              { name: "Aisyah M.", role: "Mahasiswa", text: "Aplikasinya lengkap banget! Dari jadwal sholat, Quran, sampai dzikir semuanya ada. Desainnya juga cantik.", avatar: "S" },
              { name: "Budi W.", role: "Mahasiswa", text: "Game islaminya seru banget, bikin belajar Quran jadi menyenangkan. Fitur habit trackernya juga membantu banget.", avatar: "B" },
            ].map((testi, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#4f90c6] flex items-center justify-center text-white font-bold mr-4">
                    {testi.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#44515f]">{testi.name}</h4>
                    <p className="text-[#6d7b85] text-sm">{testi.role}</p>
                  </div>
                </div>
                <p className="text-[#6d7b85]">"{testi.text}"</p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="ri-star-fill text-yellow-400 mr-1"></i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold text-[#44515f] mb-6">Tentang AlFath</h2>
            <p className="text-[#6d7b85] mb-4">
              AlFath adalah aplikasi Islami serbaguna yang membantu muslim modern
              untuk tetap istiqomah dalam ibadah dan aktivitas harian.
            </p>
            <p className="text-[#6d7b85] mb-6">
              Dengan desain sederhana namun elegan, AlFath menghadirkan pengalaman
              beribadah yang lebih dekat, ringan, dan praktis.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#f0f1f2] px-4 py-2 rounded-lg flex items-center">
                <i className="ri-smartphone-line text-[#4f90c6] mr-2"></i>
                <span>Ukuran: kecil banget kok</span>
              </div>
              <div className="bg-[#f0f1f2] px-4 py-2 rounded-lg flex items-center">
                <i className="ri-android-line text-[#4f90c6] mr-2"></i>
                <span>Android & iOS</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-[#f0f1f2] p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <i className="ri-user-heart-line text-4xl text-[#4f90c6] mb-2"></i>
              <h4 className="font-semibold text-[#44515f]">Ramah Pengguna</h4>
            </div>
            <div className="bg-[#f0f1f2] p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <i className="ri-shield-check-line text-4xl text-[#4f90c6] mb-2"></i>
              <h4 className="font-semibold text-[#44515f]">Akurat & Terpercaya</h4>
            </div>
            <div className="bg-[#f0f1f2] p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <i className="ri-global-line text-4xl text-[#4f90c6] mb-2"></i>
              <h4 className="font-semibold text-[#44515f]">Fitur Lengkap</h4>
            </div>
            <div className="bg-[#f0f1f2] p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <i className="ri-lightbulb-flash-line text-4xl text-[#4f90c6] mb-2"></i>
              <h4 className="font-semibold text-[#44515f]">Ringan & Inovatif</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#355485] to-[#4f90c6] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Tingkatkan Ibadah Harian Anda?</h2>
          <p className="text-lg mb-8 text-[#cbdde9]">Install AlFath sekarang dan rasakan kemudahannya secara gratis</p>
          {!isInstalled ? (
            <button
              onClick={handleInstall}
              className="px-8 py-4 rounded-lg bg-white text-[#355485] font-semibold shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1 text-lg"
            >
              <i className="ri-download-cloud-fill mr-2"></i>
              Install Sekarang - Gratis!
            </button>
          ) : (
            <div className="bg-white/20 p-6 rounded-lg inline-block">
              <div className="flex items-center justify-center">
                <i className="ri-checkbox-circle-fill text-2xl mr-2"></i>
                <span className="text-lg">AlFath sudah terpasang di perangkat Anda</span>
              </div>
            </div>
          )}
          <p className="mt-4 text-sm text-[#cbdde9]">Tanpa iklan, tanpa biaya tersembunyi</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-[#fcfeff]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#44515f] mb-10">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              {
                q: "Apakah AlFath harus download di Play Store?",
                a: "Tidak, cukup buka https://alfathh.vercel.app/ lalu install langsung dari browser ke layar utama HP Anda."
              },
              {
                q: "Apakah AlFath gratis?",
                a: "Ya, seluruh fitur AlFath bisa digunakan secara gratis tanpa biaya berlangganan."
              },
              {
                q: "Apakah butuh internet?",
                a: "Beberapa fitur seperti jadwal sholat dan doa bisa diakses offline, namun untuk konten terbaru tetap butuh koneksi."
              },
              {
                q: "Apakah bisa dipakai di iPhone?",
                a: "AlFath bisa dipasang di iOS melalui Safari dengan fitur Add to Home Screen."
              },
              {
                q: "Bagaimana cara install AlFath?",
                a: "Buka https://alfathh.vercel.app/ di browser HP Anda, lalu klik tombol 'Install' atau 'Add to Home Screen'."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white shadow-sm rounded-xl overflow-hidden">
                <button
                  className="w-full p-5 text-left font-semibold text-[#355485] flex justify-between items-center"
                  onClick={() => toggleFAQ(i)}
                >
                  <span>{faq.q}</span>
                  <i className={`ri-${activeFAQ === i ? 'arrow-up-s' : 'arrow-down-s'}-line`}></i>
                </button>
                {activeFAQ === i && (
                  <div className="px-5 pb-5 text-[#6d7b85]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#44515f] text-white py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="md:w-1/3">
              <div className="flex items-center mb-4">
                <i className="ri-islamic-line text-2xl text-[#90b6d5] mr-2"></i>
                <span className="text-xl font-bold">AlFath</span>
                <span className="text-lg text-[#6d9bbc] ml-1">– Muslim Daily</span>
              </div>
              <p className="text-[#a6b0b6]">
                Aplikasi muslim serbaguna untuk hidup lebih berkah dan ihsan.
              </p>
            </div>

            <div className="md:w-1/3">
              <h4 className="font-semibold mb-3">Tautan Cepat</h4>
              <ul className="space-y-2 text-[#a6b0b6]">
                <li><a href="#" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimoni</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Tentang</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div className="md:w-1/3">
              <h4 className="font-semibold mb-3">Hubungi Kami</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-[#a6b0b6] hover:text-white transition-colors text-2xl">
                  <i className="ri-instagram-line"></i>
                </a>
                <a href="#" className="text-[#a6b0b6] hover:text-white transition-colors text-2xl">
                  <i className="ri-facebook-circle-line"></i>
                </a>
                <a href="#" className="text-[#a6b0b6] hover:text-white transition-colors text-2xl">
                  <i className="ri-youtube-line"></i>
                </a>
                <a href="#" className="text-[#a6b0b6] hover:text-white transition-colors text-2xl">
                  <i className="ri-twitter-line"></i>
                </a>
              </div>
              <p className="text-[#a6b0b6]">support@alfath.com</p>
            </div>
          </div>

          <div className="border-t border-[#5c6b7a] pt-6 text-center text-[#a6b0b6]">
            <p>© {new Date().getFullYear()} AlFath – Muslim Daily. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}