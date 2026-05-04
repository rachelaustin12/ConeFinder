import React from 'react';
import { IceCream, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function VanMarkerPopup({ van }) {
  const lastUpdate = van.last_location_update ?
  formatDistanceToNow(new Date(van.last_location_update), { addSuffix: true }) :
  'Unknown';

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${van.latitude},${van.longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${van.latitude},${van.longitude}&navigate=yes`;

  return (
    <div className="font-inter min-w-[210px]">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${van.isSighting ? 'bg-pink-100' : 'bg-primary/10'}`}>
          {van.isSighting ?
          <Eye className="w-4 h-4 text-pink-500" /> :
          <IceCream className="w-4 h-4 text-primary" />}
        </div>
        <div>
          <h3 className="font-semibold text-sm leading-tight">{van.name}</h3>
          <p className="text-xs text-gray-400">
            {van.isSighting ?
            `Spotted by ${van.reporter_name || 'a hunter'}` :
            van.driver_name || 'Anonymous Driver'}
          </p>
        </div>
      </div>

      {van.note &&
      <p className="text-xs text-gray-500 mb-2">"{van.note}"</p>
      }

      {van.specialties &&
      <div className="flex flex-wrap gap-1 mb-2">
          {van.specialties.split(',').map((s, i) =>
        <Badge key={i} variant="secondary" className="text-[10px] py-0 px-1.5">
              {s.trim()}
            </Badge>
        )}
        </div>
      }

      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
        <Clock className="w-3 h-3" />
        <span>Updated {lastUpdate}</span>
      </div>

      {/* Direction buttons */}
      <div className="flex gap-1.5">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer" className="text-[hsl(var(--destructive))] px-2 py-1.5 text-xs font-semibold opacity-55 rounded-lg flex-1 flex items-center justify-center gap-1"

          style={{ background: '#4285F4' }}>
          
          <img src="https://www.google.com/favicon.ico" className="w-3 h-3" alt="" />
          Google Maps
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold rounded-lg px-2 py-1.5 text-white"
          style={{ background: '#05c8f7' }}>
          
          <img src="https://www.waze.com/favicon.ico" className="w-3 h-3" alt="" />
          Waze
        </a>
      </div>
    </div>);

}