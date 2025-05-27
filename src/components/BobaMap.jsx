import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import OrderPopup from './OrderPopup';

// Fix untuk default icon path Leaflet (tetap diperlukan)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Terima props mapCenter dan mapZoom, dengan nilai default Manado
const BobaMap = ({ shops, mapCenter = [1.4748, 124.8421], mapZoom = 14 }) => {
  // Jika tidak ada toko, dan mapCenter tidak di-pass, kita tetap bisa menggunakan default Manado
  const centerPosition = shops && shops.length > 0 ? mapCenter : [1.4748, 124.8421];
  const zoomLevel = shops && shops.length > 0 ? mapZoom : 13; // Zoom sedikit keluar jika tidak ada toko spesifik

  return (
    <MapContainer center={centerPosition} zoom={zoomLevel} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops.map(shop => (
        <Marker key={shop.id} position={shop.position}>
          <Popup>
            <OrderPopup shop={shop} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default BobaMap;