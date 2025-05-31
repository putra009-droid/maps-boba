// src/components/BobaMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// import OrderPopup from './OrderPopup'; // OrderPopup sementara dinonaktifkan untuk tes

// Fix untuk default icon path Leaflet (wajib ada)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const BobaMap = ({ shops, mapCenter = [1.4748, 124.8421], mapZoom = 14 }) => {
  console.log('BobaMap.jsx - Props "shops" diterima:', JSON.stringify(shops, null, 2));
  console.log('BobaMap.jsx - Props "mapCenter" diterima:', mapCenter);
  console.log('BobaMap.jsx - Props "mapZoom" diterima:', mapZoom);

  if (!shops || !Array.isArray(shops)) {
    console.error('BobaMap.jsx: "shops" prop is missing or not an array!', shops);
    return (
        <MapContainer center={mapCenter} zoom={13} className="map-container">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Popup position={mapCenter}>
                <div>
                    <p className="font-semibold text-red-600">Data toko tidak tersedia.</p>
                    <p className="text-xs text-gray-500">Pastikan API backend menyajikan data toko dengan benar.</p>
                </div>
            </Popup>
        </MapContainer>
    );
  }
  
  console.log("BobaMap.jsx: Akan me-render peta dengan center:", mapCenter, "zoom:", mapZoom, "jumlah toko:", shops.length);

  return (
    <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops.map(shop => {
        console.log('BobaMap.jsx - Mapping shop object:', JSON.stringify(shop, null, 2));

        if (!shop || typeof shop.id === 'undefined') {
          console.error('BobaMap.jsx: Data toko tidak valid, ID hilang atau objek shop null/undefined:', shop);
          return null; 
        }
        if (!shop.position || !Array.isArray(shop.position) || shop.position.length !== 2 || 
            typeof shop.position[0] !== 'number' || typeof shop.position[1] !== 'number') {
          console.warn('BobaMap.jsx: Posisi tidak valid atau hilang untuk toko:', shop.name, '(ID:', shop.id, ') Posisi yang diterima:', shop.position, '- Marker tidak akan dirender.');
          return null; 
        }
        
        console.log('BobaMap.jsx: Merender Marker untuk toko ->', shop.name, 'dengan ID:', shop.id, 'di Posisi:', shop.position);
        return (
          <Marker key={shop.id} position={shop.position}>
            <Popup>
              {/* --- AWAL BAGIAN TES SEMENTARA --- */}
              <div>
                <p>TES POPUP: Toko {shop.name}</p>
                <p>ID Toko: {shop.id}</p>
                {/* Log ini akan dieksekusi jika bagian ini dirender oleh Popup */}
                {console.log(`BobaMap.jsx: KONTEN POPUP TES untuk toko -> ${shop.name} (ID: ${shop.id})`)}
              </div>
              {/* <OrderPopup shop={shop} /> */} {/* OrderPopup dinonaktifkan sementara */}
              {/* --- AKHIR BAGIAN TES SEMENTARA --- */}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default BobaMap;