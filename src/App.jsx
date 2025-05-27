// src/App.jsx

import React, { useState, useEffect } from 'react';
import BobaMap from './components/BobaMap';
// Pastikan path ke BobaMap benar

// URL API untuk mengambil data toko dari backend Anda
// PASTIKAN INI MENGARAH KE IP VPS ANDA YANG BENAR
const API_SHOPS_ENDPOINT = "http://159.203.179.29:3001/api/shops";

function App() {
  const [bobaShopsData, setBobaShopsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(API_SHOPS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Gagal mengambil data toko: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.shops) {
          setBobaShopsData(data.shops);
        } else {
          setBobaShopsData([]); // Jika tidak ada 'shops' di response, set array kosong
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching shops data:", err);
        setBobaShopsData([]); // Set array kosong jika ada error
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []); // Dependency array kosong berarti useEffect ini hanya berjalan sekali saat komponen mount

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manado Boba Finder <span className="text-sm font-normal opacity-80"> Sulawesi Utara</span>
          </h1>
          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Temukan gerai boba favoritmu di sekitar Manado!
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-700">Pilih Gerai Boba di Manado</h2>
          <p className="text-sm text-gray-600">Klik penanda pada peta untuk melihat menu dan memesan.</p>
        </div>
        
        {isLoading && <p className="text-center py-4">Memuat data toko boba...</p>}
        {error && <p className="text-center py-4 text-red-600">Error: {error}. Pastikan server backend berjalan dan endpoint API toko benar.</p>}
        {!isLoading && !error && (
          <BobaMap shops={bobaShopsData} mapCenter={[1.4748, 124.8421]} mapZoom={14} />
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 text-center p-4 mt-auto">
        <p className="text-xs">&copy; {new Date().getFullYear()} Boba Finder Manado. Dibuat dengan ❤️ di Manado.</p>
      </footer>
    </div>
  );
}

export default App;