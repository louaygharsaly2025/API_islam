import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dzikir from "./pages/dzikir/Dzikir";
import DzikirPagiSugro from "./pages/dzikir/almasurat/PagiSugro";
import DzikirPetangSugro from "./pages/dzikir/almasurat/PetangSugro";
import JadwalSholat from "./pages/islamic/JadwalSholat";
import Almasurat from "./pages/dzikir/Almasurat";
import Donate from "./pages/Donate";
import AutoToTop from "./components/AutoToTop";
import Tes from "./pages/Tes";
import Kalender from "./pages/islamic/Kalender";
import DetailPerSurah from "./pages/alquran/DetailPerSurah";
import DetailPerJuz from "./pages/alquran/DetailPerJuz";


import QuranPage from './components/QuranPage';
import Tess from './components/Home';
import HomeQuran from "./pages/alquran/HomeQuran";
import TebakAyat from "./pages/game/TebakAyat";
import Games from "./pages/game/GameHome";
import History from "./pages/game/History";

import DetailVideo from "./pages/vidmotivasi/DetailVideo";
import VideoList from "./pages/vidmotivasi/VideoList";
import StoryThur from "./pages/vidmotivasi/StoryThur";
import NewsListe from "./pages/news/NewsList";
import NewsDetail from "./pages/news/NewsDetail";
import Kiblat from "./pages/islamic/Kiblat";
import QuotesList from "./pages/quotes/QuotesList";
import QuotesAdd from "./pages/quotes/QuotesAdd";
import EdukasiHome from "./pages/edukasi/EdukasiHome";
import ComingSoon from "./pages/maintenance/ComingSoon";
import SettingHome from "./pages/settings/SettingHome";
import SelfDevHome from "./pages/selfdev/SelfDevHome";
import DoaList from "./pages/doa/DoaList";
import AddDoa from "./pages/doa/AddDoa";
import DetailDoa from "./pages/doa/DetailDoa";
import ControlDoa from "./pages/doa/ControlDoa";
import Login from "./pages/settings/Login";
import ListMenu from "./pages/settings/ListMenu";
import PerHalamanList from "./pages/alquran/PerHalamanList";
import DetailHalamanPerJuz from "./pages/alquran/DetailHalamanPerJuz";
import LibraryHome from "./pages/library/LibraryHome";
import MentahanAudio from "./pages/library/MentahanAudio";
import ManageAudio from "./pages/library/ManageAudio";
import DetailSurah from "./pages/game/rekamayat/DetailSurah";
import MentahanVideo from "./pages/library/MentahanVideo";
import DetailSurahSA from "./pages/game/sambungayat/DetailSurah";
import DetailJuzSA from "./pages/game/sambungayat/DetailJuz";
import TebakSurah from "./pages/game/TebakSurah";
import ManageQuotes from "./pages/quotes/ManageQuotes";

function App() {
  return (
    <Router>
      <AutoToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tes" element={<Tes />} />
        <Route path="/tess" element={<Tess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listmenu" element={<ListMenu />} />
        <Route path="/manage/doa" element={<ControlDoa />} />
        <Route path="/manage/audio" element={<ManageAudio />} />
        <Route path="/manage/quotes" element={<ManageQuotes />} />

        <Route path="/donate" element={<Donate />} />
        <Route path="/kiblat" element={<Kiblat />} />
        <Route path="/kalender" element={<Kalender />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />

        <Route path="/selfdev" element={<SelfDevHome />} />

        <Route path="/doa" element={<DoaList />} />
        <Route path="/doa/add" element={<AddDoa />} />
        <Route path="/doa/detail/:id" element={<DetailDoa />} />
        
        <Route path="/edukasi" element={<EdukasiHome />} />

        <Route path="/library" element={<LibraryHome />} />
        <Route path="/library/audio" element={<MentahanAudio />} />
        <Route path="/library/video" element={<MentahanVideo />} />

        <Route path="/settings" element={<SettingHome />} />

        <Route path="/news" element={<NewsListe />} />
        <Route path="/news/:id" element={<NewsDetail />} />

        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/almasurat" element={<Almasurat />} />
        <Route path="/dzikir/almasurat/pagi" element={<DzikirPagiSugro />} />
        <Route path="/dzikir/almasurat/petang" element={<DzikirPetangSugro />} />

        <Route path="/quotes" element={<QuotesList />} />
        <Route path="/quotes/add" element={<QuotesAdd />} />

        <Route path="/video" element={<VideoList />} />
        <Route path="/detail/video/:id" element={<DetailVideo />} />
        <Route path="/profile/storythur" element={<StoryThur />} />

        <Route path="/quran" element={<HomeQuran />} />
        <Route path="/quran/perhalaman" element={<PerHalamanList />} />
        <Route path="/quran/perhalaman/juz/:id" element={<DetailHalamanPerJuz />} />
        <Route path="/page/:pageNumber" element={<QuranPage />} />
        <Route path="/quran/:tab?" element={<HomeQuran />} />
        <Route path="/quran/juz/:id" element={<DetailPerJuz />} />
        <Route path="/quran/surah/:id" element={<DetailPerSurah />} />
        <Route path="/quran/surah/:id/:verseNumber" element={<DetailPerSurah />} />

        {/* Route Games */}
        <Route path="/game" element={<Games />} />
        <Route path="/game/rekam-ayat/surah/:id" element={<DetailSurah />} />
        <Route path="/history" element={<History />} />

        <Route path="/game/tebak-ayat" element={<TebakAyat />} />
        <Route path="/game/tebak-surah" element={<TebakSurah />} />

        <Route path="/game/sambung-ayat/surah/:id" element={<DetailSurahSA />} />
        <Route path="/game/sambung-ayat/juz/:id" element={<DetailJuzSA />} />

        {/* Catch-all untuk halaman yang tidak ada */}
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/comingsoon" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
