import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import VanMarkerPopup from './VanMarkerPopup';

const vanIcon = new L.DivIcon({
  html: `<div style="font-size:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🍦</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  className: ''
});

const sightingIcon = new L.DivIcon({
  html: `<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -30],
  className: ''
});

const userIcon = new L.DivIcon({
  html: `<div style="width:14px;height:14px;background:hsl(340,75%,55%);border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  className: ''
});

function FlyToUser({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function VanMap({ vans, className = "" }) {
  const [userPos, setUserPos] = useState(null);
  const defaultCenter = [51.505, -0.09];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  const center = userPos || defaultCenter;

  return (
    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-border h-[50vh]">
      <MapContainer center={center} zoom={13} className="w-full h-full" style={{ minHeight: '400px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20} />
        
        <FlyToUser position={userPos} />
        {userPos && <Marker position={userPos} icon={userIcon} />}
        {vans.filter((v) => v.is_active && v.latitude && v.longitude).map((van) =>
        <Marker key={van.id} position={[van.latitude, van.longitude]} icon={van.isSighting ? sightingIcon : vanIcon}>
            <Popup>
              <VanMarkerPopup van={van} />
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>);

}