import React from 'react';

export default function IceCreamIcon({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8C24.268 8 18 14.268 18 22C18 22 16 22 16 24C16 26 18 28 18 28L28 56C29 58 31 58 32 58C33 58 35 58 36 56L46 28C46 28 48 26 48 24C48 22 46 22 46 22C46 14.268 39.732 8 32 8Z" fill="hsl(340, 75%, 55%)" />
      <path d="M22 22C22 16.477 26.477 12 32 12C37.523 12 42 16.477 42 22" stroke="hsl(340, 75%, 65%)" strokeWidth="1.5" />
      <circle cx="26" cy="20" r="2" fill="hsl(45, 90%, 65%)" />
      <circle cx="34" cy="18" r="1.5" fill="hsl(190, 60%, 70%)" />
      <circle cx="30" cy="24" r="1.5" fill="hsl(120, 50%, 65%)" />
      <circle cx="38" cy="22" r="1" fill="hsl(45, 90%, 65%)" />
      <path d="M28 56L32 58L36 56" stroke="hsl(45, 80%, 50%)" strokeWidth="2" />
      <path d="M26 38L32 58L38 38" fill="hsl(45, 70%, 60%)" />
      <line x1="28" y1="42" x2="36" y2="42" stroke="hsl(45, 60%, 50%)" strokeWidth="0.5" />
      <line x1="29" y1="46" x2="35" y2="46" stroke="hsl(45, 60%, 50%)" strokeWidth="0.5" />
      <line x1="30" y1="50" x2="34" y2="50" stroke="hsl(45, 60%, 50%)" strokeWidth="0.5" />
    </svg>
  );
}