import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">Al-Quran Digital</h1>
          <p className="text-xl text-teal-600 mb-8">Baca dan pelajari Al-Quran dengan mudah dan nyaman</p>
          <Link 
            to="/page/1" 
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover-lift"
          >
            Mulai Membaca
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg fade-in">
          <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">Tentang Aplikasi</h2>
          <p className="text-gray-700 mb-4">
            Aplikasi Al-Quran Digital ini menyediakan akses mudah untuk membaca kitab suci Al-Quran 
            dengan terjemahan bahasa Indonesia dan fitur-fitur pendukung lainnya.
          </p>
          <p className="text-gray-700 mb-4">
            Anda dapat menelusuri halaman demi halaman (dari 1 hingga 604) untuk membaca Al-Quran 
            dengan tampilan yang nyaman dan jelas.
          </p>
          <div className="flex justify-center mt-8">
            <div className="flex items-center bg-teal-100 p-4 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-teal-700">Total 604 halaman tersedia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;