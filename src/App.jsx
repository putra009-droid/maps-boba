// src/App.jsx
import React, { useState, useEffect } from 'react';
import BobaMap from './components/BobaMap'; // Sesuaikan path jika BobaMap.jsx ada di folder lain

// URL API untuk mengambil data toko dari backend Anda
const API_SHOPS_ENDPOINT = "http://159.203.179.29:3001/api/shops"; // PASTIKAN IP VPS BENAR

function App() {
  const [bobaShopsData, setBobaShopsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("App.jsx: Mulai mengambil data toko...");
    const fetchShops = async () => {
      setIsLoading(true); // Set loading true di awal fetch
      setError(null); // Reset error
      try {
        const response = await fetch(API_SHOPS_ENDPOINT);
        console.log("App.jsx: Status respons API toko:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Gagal mengambil data toko: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("App.jsx: Data mentah diterima dari API toko:", JSON.stringify(data, null, 2));
        
        if (data.shops && Array.isArray(data.shops)) {
          setBobaShopsData(data.shops);
          console.log("App.jsx: State bobaShopsData diupdate:", JSON.stringify(data.shops, null, 2));
        } else {
          console.warn("App.jsx: Properti 'shops' tidak ditemukan atau bukan array dalam respons API. Mengatur ke array kosong.", data);
          setBobaShopsData([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("App.jsx: Error saat mengambil data toko:", err);
        setBobaShopsData([]); // Set array kosong jika terjadi error
      } finally {
        setIsLoading(false);
        console.log("App.jsx: Pengambilan data toko selesai. isLoading:", false);
      }
    };

    fetchShops();
  }, []); // Dependency array kosong, fetch hanya sekali saat komponen mount

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
        
        {isLoading && <p className="text-center py-4 text-lg text-purple-600">Memuat data toko boba, harap tunggu...</p>}
        {error && <p className="text-center py-4 text-red-600 font-semibold">Error: {error}. Pastikan server backend berjalan dan endpoint API toko benar.</p>}
        
        {!isLoading && !error && bobaShopsData.length === 0 && (
             <p className="text-center py-4 text-gray-600">Belum ada data toko boba yang tersedia atau gagal dimuat.</p>
        )}

        {/* Hanya render BobaMap jika tidak loading, tidak ada error, DAN ada data toko */}
        {!isLoading && !error && bobaShopsData.length > 0 && (
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