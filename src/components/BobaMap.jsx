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

const BobaMap = ({ shops, mapCenter = [1.4748, 124.8421], mapZoom = 14 }) => {
  // Log props yang diterima
  console.log('BobaMap received shops:', JSON.stringify(shops, null, 2));
  console.log('BobaMap received mapCenter:', mapCenter);
  console.log('BobaMap received mapZoom:', mapZoom);

  const centerPosition = shops && shops.length > 0 ? mapCenter : [1.4748, 124.8421];
  const zoomLevel = shops && shops.length > 0 ? mapZoom : 13;

  if (!shops || !Array.isArray(shops)) {
    console.error('BobaMap: "shops" prop is missing or not an array!', shops);
    // Mungkin tampilkan pesan atau peta kosong jika tidak ada data toko
    return (
        <MapContainer center={centerPosition} zoom={10} className="map-container">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Popup position={centerPosition}>Tidak ada data toko untuk ditampilkan atau format data salah.</Popup>
        </MapContainer>
    );
  }

  return (
    <MapContainer center={centerPosition} zoom={zoomLevel} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops.map(shop => {
        // Validasi setiap shop sebelum membuat Marker
        if (!shop || typeof shop.id === 'undefined') { // Minimal harus ada ID
          console.error('BobaMap: Invalid shop data, missing id:', shop);
          return null; 
        }
        if (!shop.position || !Array.isArray(shop.position) || shop.position.length !== 2 || 
            typeof shop.position[0] !== 'number' || typeof shop.position[1] !== 'number') {
          console.error('BobaMap: Invalid or missing position for shop:', shop.name, '(ID:', shop.id, ') Position:', shop.position);
          return null; // Jangan render marker jika posisi tidak valid
        }
        
        console.log('BobaMap: Rendering Marker for shop ->', shop.name, 'ID:', shop.id, 'Position:', shop.position);
        return (
          <Marker key={shop.id} position={shop.position}>
            <Popup>
              <OrderPopup shop={shop} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default BobaMap;