import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
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

function MyLocationButton({ userPos }) {
  const map = useMap();
  return (
    <div style={{ position: 'absolute', bottom: '16px', right: '10px', zIndex: 1000 }}>
      <button
        onClick={() => userPos && map.flyTo(userPos, 15, { duration: 1.2 })}
        title="Go to my location"
        style={{
          background: 'white',
          border: '2px solid rgba(0,0,0,0.2)',
          borderRadius: '8px',
          width: '34px',
          height: '34px',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        }}
      >
      🧭
      </button>
    </div>
  );
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
        <MyLocationButton userPos={userPos} />
        {userPos && <Marker position={userPos} icon={userIcon} />}
        {vans.filter((v) => v.is_active && v.latitude && v.longitude).map((van) =>
        <Marker key={van.id} position={[van.latitude, van.longitude]} icon={van.isSighting ? sightingIcon : vanIcon}>
            <Tooltip permanent direction="top" offset={[0, -38]} opacity={1} className="van-label">
              <span style={{ fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', color: '#0ea5e9' }}>{van.name}</span>
            </Tooltip>
            <Popup>
              <VanMarkerPopup van={van} />
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>);

}