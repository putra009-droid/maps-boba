// src/App.jsx
import React, { useState, useEffect } from 'react';
import BobaMap from './components/BobaMap';
import 'leaflet/dist/leaflet.css'; // Pastikan CSS Leaflet diimpor

const API_SHOPS_ENDPOINT = "/api/shops"; 

function App() {
  const [bobaShopsData, setBobaShopsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("App.jsx: useEffect_fetchShops_dijalankan");
    const fetchShops = async () => {
      setIsLoading(true);
      setError(null);
      console.log("App.jsx: Memulai fetch ke", API_SHOPS_ENDPOINT);
      try {
        const response = await fetch(API_SHOPS_ENDPOINT);
        console.log("App.jsx: Status respons API toko:", response.status, response.statusText);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("App.jsx: Respons API tidak OK. Teks error:", errorText);
          throw new Error(`Gagal mengambil data toko: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log("App.jsx: Data mentah diterima dari API toko:", JSON.stringify(data, null, 2));
        
        if (data && data.shops && Array.isArray(data.shops)) {
          setBobaShopsData(data.shops);
          console.log("App.jsx: State bobaShopsData diupdate menjadi:", JSON.stringify(data.shops, null, 2));
        } else {
          console.warn("App.jsx: Properti 'shops' tidak ditemukan, bukan array, atau data null dalam respons API. Mengatur ke array kosong.", data);
          setBobaShopsData([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("App.jsx: Terjadi error saat mengambil data toko:", err);
        setBobaShopsData([]);
      } finally {
        setIsLoading(false);
        console.log("App.jsx: Proses pengambilan data toko selesai. isLoading:", false);
      }
    };

    fetchShops();
  }, []);

  const header = (
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
  );

  let mainContent;
  if (isLoading) {
    mainContent = <p className="text-center py-4 text-lg text-purple-600">Memuat data toko boba, harap tunggu...</p>;
  } else if (error) {
    mainContent = <p className="text-center py-4 text-red-600 font-semibold">Error: {error}. Pastikan server backend berjalan dan endpoint API toko benar.</p>;
  } else if (bobaShopsData.length === 0 && !isLoading) {
    mainContent = <p className="text-center py-4 text-gray-600">Belum ada data toko boba yang tersedia atau gagal dimuat.</p>;
  } else {
    mainContent = <BobaMap shops={bobaShopsData} mapCenter={[1.4748, 124.8421]} mapZoom={14} />;
  }

  const footer = (
    <footer className="bg-gray-800 text-gray-300 text-center p-4 mt-auto">
      <p className="text-xs">&copy; {new Date().getFullYear()} Boba Finder Manado. Dibuat dengan ❤️ di Manado.</p>
    </footer>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans text-gray-800">
      {header}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-700">Pilih Gerai Boba di Manado</h2>
          <p className="text-sm text-gray-600">Klik penanda pada peta untuk melihat menu dan memesan.</p>
        </div>
        {mainContent}
      </main>
      {footer}
    </div>
  );
}

export default App;