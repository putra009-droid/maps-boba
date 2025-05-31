// src/components/OrderPopup.jsx
import React, { useState } from 'react';

// Icon SVG
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
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
  </svg>
);

const formatRupiah = (angka) => {
  if (typeof angka !== 'number' || isNaN(angka)) return formatRupiah(0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

const API_ENDPOINT = "/api/orders";

const OrderPopup = ({ shop }) => {
  // --- LOG KUNCI 1: DATA SHOP YANG DITERIMA ---
  console.log('OrderPopup.jsx - Props "shop" yang diterima:', JSON.stringify(shop, null, 2));

  const [orderItems, setOrderItems] = useState({});
  const [orderMessage, setOrderMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  if (!shop || typeof shop !== 'object' || !shop.name || !Array.isArray(shop.menu)) {
    console.error("OrderPopup.jsx: Props 'shop' tidak valid atau tidak lengkap.", shop);
    return <div className="p-4 text-center text-sm text-red-500">Informasi toko tidak tersedia atau tidak valid.</div>;
  }

  const cleanWhatsAppNumber = (number) => {
    if (!number) return null;
    return String(number).replace(/\D/g, '');
  };

  const shopSpecificWhatsapp = shop ? cleanWhatsAppNumber(shop.whatsappNumber) : null;

  // --- LOG KUNCI 2 & 3: PROSES NOMOR WHATSAPP ---
  console.log('OrderPopup.jsx - shop.whatsappNumber mentah:', shop ? shop.whatsappNumber : 'Objek shop tidak tersedia atau tidak ada whatsappNumber');
  console.log('OrderPopup.jsx - shopSpecificWhatsapp setelah dibersihkan:', shopSpecificWhatsapp);

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(0, parseInt(newQuantity, 10) || 0);
    setOrderItems(prev => ({ ...prev, [itemId]: quantity }));
    setOrderMessage('');
    setOrderSubmitted(false);
  };

  const incrementQuantity = (itemId) => handleQuantityChange(itemId, (orderItems[itemId] || 0) + 1);
  const decrementQuantity = (itemId) => handleQuantityChange(itemId, (orderItems[itemId] || 0) - 1);

  const calculateTotal = () => {
    return shop.menu.reduce((total, item) => {
        if (!item || typeof item.price !== 'number' || isNaN(item.price)) return total;
        return total + (item.price * (orderItems[item.id] || 0));
    }, 0);
  };

  const handleSubmitOrder = async () => {
    console.log('OrderPopup.jsx: Memulai handleSubmitOrder'); // Log awal fungsi
    if (isSubmitting) return;
    const itemsForPayload = shop.menu
      .filter(item => item && typeof item.id !== 'undefined' && orderItems[item.id] && orderItems[item.id] > 0)
      .map(item => ({
        id: item.id,
        name: item.name || "Item Tidak Bernama",
        quantity: orderItems[item.id],
        price: typeof item.price === 'number' ? item.price : 0,
        subtotal: (typeof item.price === 'number' ? item.price : 0) * orderItems[item.id],
      }));
    
    console.log('OrderPopup.jsx: itemsForPayload:', itemsForPayload); // Log item yang akan dikirim

    if (itemsForPayload.length === 0) {
      setOrderMessage('Pilih minimal satu item untuk dipesan.');
      setOrderSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setOrderMessage('Mengirim pesanan...');
    const totalAmount = calculateTotal();
    const orderId = `BBM-${shop.id || 'TID'}-${Date.now()}`;
    const orderPayload = {
      orderId,
      shopName: shop.name,
      items: itemsForPayload,
      totalAmount,
      status: "tertunda",
      timestamp: new Date().toISOString(),
    };
    console.log('OrderPopup.jsx: orderPayload:', orderPayload); // Log payload lengkap

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      console.log('OrderPopup.jsx: Respons submit order - Status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Gagal mengirim pesanan. Server: ${response.status} - ${errorData.message || 'Tidak ada pesan error tambahan'}`);
      }
      const responseData = await response.json();
      console.log('OrderPopup.jsx: Server response (order submitted):', responseData);
      setOrderMessage(responseData.message || `Pesanan Anda (${orderId}) berhasil dikirim & diterima server!`);
      setOrderItems({});
      setOrderSubmitted(true);
    } catch (error) {
      console.error('OrderPopup.jsx - Error submitting order:', error);
      setOrderMessage(`Terjadi kesalahan: ${error.message || "Tidak dapat terhubung ke server."} Pastikan server backend berjalan.`);
      setOrderSubmitted(false);
    } finally {
      setIsSubmitting(false);
      console.log('OrderPopup.jsx: handleSubmitOrder selesai.');
    }
  };

  const totalAmount = calculateTotal();
  const isErrorMessage = orderMessage && (orderMessage.startsWith('Pilih minimal') || orderMessage.startsWith('Gagal mengirim pesanan') || orderMessage.startsWith('Terjadi kesalahan'));

  return (
    <div className="p-4 sm:p-5 bg-white text-gray-700 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-purple-700 text-center">Pesan dari: {shop.name}</h3>
        
        {shopSpecificWhatsapp && ( 
          <div className="mt-2 text-center">
            <a
              href={`https://wa.me/${shopSpecificWhatsapp}?text=${encodeURIComponent(`Halo ${shop.name}, saya ingin bertanya mengenai produk Anda.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <WhatsAppIcon />
              Hubungi Toko via WhatsApp
            </a>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {shop.menu.map((item, index) => (
          item && typeof item.id !== 'undefined' && item.name && typeof item.price === 'number' ? (
            <div key={item.id || `menu-item-${index}`} className="flex flex-col items-center p-3 bg-slate-50 rounded-lg shadow border border-slate-200 space-y-1">
              <div className="text-center">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{item.name}</p>
                <p className="text-xs sm:text-sm text-purple-600 font-bold">{formatRupiah(item.price)}</p>
              </div>
              <div className="flex items-center justify-center space-x-1.5 pt-1">
                <button 
                  onClick={() => decrementQuantity(item.id)} 
                  disabled={(orderItems[item.id] || 0) === 0 || isSubmitting} 
                  className="p-1.5 sm:p-2 rounded-md text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                  aria-label={`Kurangi jumlah ${item.name}`}
                > 
                  <MinusIcon /> 
                </button>
                <input 
                  type="text" 
                  value={orderItems[item.id] || 0} 
                  onChange={(e) => handleQuantityChange(item.id, e.target.value.replace(/[^0-9]/g, ''))} 
                  disabled={isSubmitting} 
                  className="w-10 sm:w-12 text-center font-semibold border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 p-1 sm:p-1.5 text-sm sm:text-base mx-0.5 sm:mx-1"
                  aria-label={`Jumlah saat ini ${item.name}`}
                />
                <button 
                  onClick={() => incrementQuantity(item.id)} 
                  disabled={isSubmitting} 
                  className="p-1.5 sm:p-2 rounded-md text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-70 transition-colors disabled:bg-gray-300"
                  aria-label={`Tambah jumlah ${item.name}`}
                > 
                  <PlusIcon /> 
                </button>
              </div>
            </div>
          ) : (
            <div key={`invalid-item-${index}`} className="text-xs text-red-500 p-2">Item menu tidak valid atau tidak lengkap.</div>
          )
        ))}
      </div>

      {totalAmount > 0 && !orderSubmitted && (
         <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
          <h4 className="font-semibold text-purple-700 mb-1.5 text-center text-base sm:text-lg">Ringkasan Pesanan:</h4>
          <div className="space-y-0.5 text-xs sm:text-sm text-gray-700">
            {shop.menu.filter(i => i && typeof i.id !== 'undefined' && orderItems[i.id] && orderItems[i.id] > 0).map(item => (
              <div key={`summary-${item.id}`} className="flex justify-between">
                <span>{item.name} (x{orderItems[item.id]})</span>
                <span className="font-medium">{formatRupiah(item.price * orderItems[item.id])}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-base sm:text-lg text-purple-700 mt-2 pt-2 border-t border-purple-200">
            <span>Total:</span> <span>{formatRupiah(totalAmount)}</span>
          </div>
        </div>
      )}

      {!orderSubmitted ? (
        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting || (totalAmount === 0 && !isErrorMessage && !(orderMessage && orderMessage.startsWith('Mengirim pesanan...'))) } 
          className={`w-full flex items-center justify-center text-white font-semibold py-2.5 px-4 rounded-lg shadow 
                     transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base
                     ${(isSubmitting || (totalAmount === 0 && !isErrorMessage && !(orderMessage && orderMessage.startsWith('Mengirim pesanan...'))) ) 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-green-500 hover:bg-green-600 active:bg-green-700 focus:ring-green-400 active:scale-[0.98]'
                     }`}
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : <ShoppingCartIcon />}
          {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan'} 
        </button>
      ) : (
         <div className="text-center p-3 bg-blue-100 text-blue-700 border border-blue-300 rounded-md mt-4">
          <p className="font-semibold text-sm sm:text-base">Pesanan Anda telah dicatat!</p>
          <p className="text-xs sm:text-sm mt-1">Admin akan segera memprosesnya.</p>
        </div>
      )}

      {orderMessage && !(orderMessage && orderMessage.startsWith('Mengirim pesanan...')) && (
        <p className={`mt-3 text-xs sm:text-sm font-medium text-center p-2.5 rounded-md shadow-sm ${ 
          isErrorMessage 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : (orderSubmitted ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-green-100 text-green-700 border border-green-300')
        }`}>
          {orderMessage}
        </p>
      )}
    </div> 
  ); 
}; 

export default OrderPopup;