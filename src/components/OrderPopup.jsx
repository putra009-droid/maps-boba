import React, { useState } from 'react';

// Icon SVG sederhana
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

// Alamat API Backend (HIPOTETIS - Servernya perlu dijalankan terpisah)
const API_ENDPOINT = "http://localhost:3001/api/orders";
// Nomor WhatsApp Admin (jika masih ingin digunakan untuk notifikasi sekunder)
const ADMIN_WHATSAPP_NUMBER = "6281234567890"; // CONTOH! GANTI DENGAN NOMOR ADMIN YANG BENAR

const OrderPopup = ({ shop }) => {
  const [orderItems, setOrderItems] = useState({});
  const [orderMessage, setOrderMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(0, parseInt(newQuantity, 10) || 0);
    setOrderItems(prev => ({ ...prev, [itemId]: quantity }));
    setOrderMessage('');
    setOrderSubmitted(false); 
  };

  const incrementQuantity = (itemId) => handleQuantityChange(itemId, (orderItems[itemId] || 0) + 1);
  const decrementQuantity = (itemId) => handleQuantityChange(itemId, (orderItems[itemId] || 0) - 1);

  const calculateTotal = () => {
    return shop.menu.reduce((total, item) => total + (item.price * (orderItems[item.id] || 0)), 0);
  };

  const handleSubmitOrder = async () => {
    if (isSubmitting) return;

    const itemsForPayload = shop.menu
      .filter(item => orderItems[item.id] && orderItems[item.id] > 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        quantity: orderItems[item.id],
        price: item.price,
        subtotal: item.price * orderItems[item.id],
      }));

    if (itemsForPayload.length === 0) {
      setOrderMessage('Pilih minimal satu item untuk dipesan.');
      setOrderSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setOrderMessage('');

    const totalAmount = calculateTotal();
    const orderId = `BBM-${Date.now()}`;

    const orderPayload = {
      orderId,
      shopName: shop.name,
      items: itemsForPayload,
      totalAmount,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText })); // Default ke statusText jika parse JSON gagal
        throw new Error(`Gagal mengirim pesanan. Server: ${response.status} - ${errorData.message || 'Tidak ada pesan error tambahan'}`);
      }

      const responseData = await response.json();
      console.log('Server response:', responseData);

      setOrderMessage(`Pesanan Anda (${orderId}) berhasil dikirim & diterima server!`);
      setOrderItems({});
      setOrderSubmitted(true);

      // --- OPSIONAL: Kirim notifikasi WhatsApp ke Admin SETELAH berhasil kirim ke server ---
      // (Bisa diaktifkan jika diperlukan dengan menghapus komentar di bawah)
      /*
      let waMessage = `🔔 PESANAN BARU DITERIMA SERVER (${orderId}) 🔔\n\n`;
      waMessage += `Toko: *${shop.name}*\n`;
      itemsForPayload.forEach(item => {
        waMessage += `• ${item.name} (x${item.quantity}) - ${formatRupiah(item.subtotal)}\n`;
      });
      waMessage += `\nTotal: *${formatRupiah(totalAmount)}*\n\n`;
      waMessage += `Status: Telah tercatat di sistem. Mohon periksa dashboard admin.\n`;
      
      const encodedMessage = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      console.log("Notifikasi WA Admin dibuka (jika diaktifkan):", whatsappUrl);
      */
      // --- Akhir bagian Opsional WhatsApp ---

    } catch (error) {
      console.error('Error submitting order:', error);
      setOrderMessage(`Terjadi kesalahan: ${error.message || "Tidak dapat terhubung ke server."} Pastikan server backend berjalan.`);
      setOrderSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();
  // Variabel isError didefinisikan dengan benar di sini
  const isError = orderMessage.startsWith('Pilih minimal') || orderMessage.startsWith('Gagal mengirim pesanan') || orderMessage.startsWith('Terjadi kesalahan');

  return (
    <div className="p-4 sm:p-5 bg-white text-gray-700 w-full max-w-md">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-purple-700 text-center">Pesan dari: {shop.name}</h3>
      </div>

      <div className="space-y-4 mb-5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {shop.menu.map(item => (
          <div key={item.id} className="flex flex-col items-center p-4 bg-slate-100 rounded-lg shadow-md border border-slate-200 space-y-2">
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-base">{item.name}</p>
              <p className="text-sm text-purple-700 font-bold">{formatRupiah(item.price)}</p>
            </div>
            <div className="flex items-center justify-center space-x-2 pt-1">
              <button 
                onClick={() => decrementQuantity(item.id)} 
                disabled={(orderItems[item.id] || 0) === 0 || isSubmitting} 
                className="p-2 rounded-md text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                aria-label={`Kurangi jumlah ${item.name}`}
              > 
                <MinusIcon /> 
              </button>
              <input 
                type="text" 
                value={orderItems[item.id] || 0} 
                onChange={(e) => handleQuantityChange(item.id, e.target.value.replace(/[^0-9]/g, ''))} 
                disabled={isSubmitting} 
                className="w-12 text-center font-semibold border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 p-1.5 text-base mx-1"
                aria-label={`Jumlah saat ini ${item.name}`}
              />
              <button 
                onClick={() => incrementQuantity(item.id)} 
                disabled={isSubmitting} 
                className="p-2 rounded-md text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-70 transition-colors disabled:bg-gray-300"
                aria-label={`Tambah jumlah ${item.name}`}
              > 
                <PlusIcon /> 
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalAmount > 0 && !orderSubmitted && (
        <div className="mb-5 p-3 bg-purple-50 border-2 border-purple-200 rounded-lg shadow">
          <h4 className="font-bold text-purple-800 mb-2 text-center">Ringkasan Pesanan:</h4>
          <div className="space-y-1 text-sm text-gray-700">
            {shop.menu.filter(i => orderItems[i.id] && orderItems[i.id] > 0).map(item => ( // Pastikan 'i' digunakan dengan benar jika ini variabel lokal map
              <div key={`summary-${item.id}`} className="flex justify-between">
                <span>{item.name} x {orderItems[item.id]}</span>
                <span className="font-medium">{formatRupiah(item.price * orderItems[item.id])}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-extrabold text-lg text-purple-800 mt-3 pt-3 border-t-2 border-purple-200">
            <span>Total:</span> <span>{formatRupiah(totalAmount)}</span>
          </div>
        </div>
      )}

      {!orderSubmitted ? (
        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting || (totalAmount === 0 && !isError && !orderMessage) } 
          className={`w-full flex items-center justify-center text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl 
                     transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 
                     ${(isSubmitting || (totalAmount === 0 && !isError && !orderMessage) ) 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-green-500 hover:bg-green-600 active:bg-green-700 focus:ring-green-400 active:scale-[0.98]'
                     }`}
        >
          {isSubmitting ? ( // Variabel 'isSubmitting' digunakan di sini
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : <ShoppingCartIcon />}
          {isSubmitting ? 'Mengirim Pesanan...' : 'Kirim Pesanan ke Server'} 
        </button>
      ) : (
         <div className="text-center p-3 bg-blue-100 text-blue-700 border border-blue-300 rounded-md">
          <p className="font-semibold">Pesanan Anda telah dicatat oleh sistem!</p>
          <p className="text-xs mt-1">Admin akan segera memprosesnya. (Pastikan server backend berjalan)</p>
        </div>
      )}

      {orderMessage && (
        // Bagian ini menggunakan 'isError' dan 'orderSubmitted'
        <p className={`mt-4 text-sm font-medium text-center p-3 rounded-md shadow ${ 
          isError 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : (orderSubmitted ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-green-100 text-green-800 border border-green-300')
        }`}>
          {orderMessage}
        </p>
      )}
    </div> 
  ); 
}; 

export default OrderPopup;