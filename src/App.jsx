// src/App.jsx

import React from 'react';
import BobaMap from './components/BobaMap';
// Pastikan path ke BobaMap benar

// Data dummy untuk toko boba di MANADO
// Anda bisa mengambil data ini dari API di aplikasi sebenarnya
const bobaShopsData = [
  {
    id: 1,
    name: 'Boba Enak Manado Town Square',
    position: [1.4705, 124.8370], // Perkiraan di sekitar Mantos
    menu: [
      { id: 'bms1', name: 'Coklat Boba Spesial', price: 26000 },
      { id: 'bms2', name: 'Teh Susu Manado', price: 23000 },
      { id: 'bms3', name: 'Matcha Lezat', price: 29000 },
    ],
  },
  {
    id: 2,
    name: 'Boba Segar Megamall',
    position: [1.4800, 124.8400], // Perkiraan di sekitar Megamall
    menu: [
      { id: 'bsm1', name: 'Klasik Milk Tea Boba', price: 20000 },
      { id: 'bsm2', name: 'Smoothie Boba Buah Naga', price: 27000 },
      { id: 'bsm3', name: 'Teh Hijau Lemon Boba', price: 22000 },
    ],
  },
  {
    id: 3,
    name: 'Waroeng Boba Paal Dua',
    position: [1.4600, 124.8500], // Perkiraan di area Paal Dua
    menu: [
      { id: 'wbp1', name: 'Kopi Susu Boba', price: 24000 },
      { id: 'wbp2', name: 'Strawberry Cheesecake Boba', price: 28000 },
      { id: 'wbp3', name: 'Avocado Boba Cream', price: 27000 },
    ],
  },
  // Tambahkan lebih banyak toko di Manado jika perlu
];


function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manado Boba Finder <span className="text-sm font-normal opacity-80"> Sulawesi Utara</span> {/* Diubah ke Manado */}
          </h1>
          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Temukan gerai boba favoritmu di sekitar Manado! {/* Diubah ke Manado */}
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-700">Pilih Gerai Boba di Manado</h2> {/* Diubah ke Manado */}
          <p className="text-sm text-gray-600">Klik penanda pada peta untuk melihat menu dan memesan.</p>
        </div>
        
        {/* Mengirim data toko Manado dan koordinat pusat Manado ke BobaMap */}
        <BobaMap shops={bobaShopsData} mapCenter={[1.4748, 124.8421]} mapZoom={14} />
      </main>

      <footer className="bg-gray-800 text-gray-300 text-center p-4 mt-auto">
        <p className="text-xs">&copy; {new Date().getFullYear()} Boba Finder Manado. Dibuat dengan ❤️ di Manado.</p> {/* Diubah ke Manado */}
      </footer>
    </div>
  );
}

export default App;