// src/components/OrderPopup.jsx
import React from 'react'; // Hanya butuh React untuk tes ini

// Tidak perlu import state, ikon, atau fungsi lain untuk tes sederhana ini

const OrderPopup = ({ shop }) => {
  // Log utama untuk melihat data shop yang diterima
  console.log('OrderPopup.jsx (TES LEBIH BERSIH) - Props "shop" yang diterima:', JSON.stringify(shop, null, 2));

  // Validasi dasar untuk prop shop
  if (!shop || typeof shop !== 'object' || !shop.name) {
    console.error("OrderPopup.jsx (TES LEBIH BERSIH): Props 'shop' tidak valid atau tidak memiliki nama.", shop);
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Informasi toko tidak valid.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-white text-gray-700 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-purple-700 text-center">
          Pesan dari: {shop.name}
        </h3>
        
        {/* --- BAGIAN TES TAMPILKAN NOMOR WA MENTAH --- */}
        <div className="mt-2 text-center bg-yellow-100 p-2 rounded border border-yellow-300">
          <p className="text-sm font-semibold text-yellow-800">TES DATA WHATSAPP:</p>
          <p className="text-xs text-yellow-700">
            Nama Toko dari Prop: {shop.name || "Nama tidak ada"}
          </p>
          <p className="text-xs text-yellow-700">
            Nomor WA dari Prop (mentah): {shop.whatsappNumber || "Nomor WA tidak ada di prop"}
          </p>
          <p className="text-xs text-yellow-700">
            Tipe data whatsappNumber: {typeof shop.whatsappNumber}
          </p>
        </div>
        {/* --------------------------------------------- */}

      </div>

      {/* Bagian menu, order, dan tombol submit DIHILANGKAN SEMENTARA untuk tes ini */}
      {/* agar tidak menyebabkan error jika ada state atau fungsi yang belum didefinisikan */}
      <div className="text-center text-gray-500 text-sm p-4">
        (Bagian menu dan order disembunyikan untuk tes tampilan WhatsApp)
      </div>

    </div> 
  ); 
}; 

export default OrderPopup;