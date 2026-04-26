import React from 'react';
import { IceCream, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function VanMarkerPopup({ van }) {
  const lastUpdate = van.last_location_update
    ? formatDistanceToNow(new Date(van.last_location_update), { addSuffix: true })
    : 'Unknown';

  return (
    <div className="font-body min-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <IceCream className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-sm">{van.name}</h3>
          <p className="text-xs text-muted-foreground">{van.driver_name || 'Anonymous Driver'}</p>
        </div>
      </div>
      {van.specialties && (
        <div className="flex flex-wrap gap-1 mb-2">
          {van.specialties.split(',').map((s, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] py-0 px-1.5">
              {s.trim()}
            </Badge>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Updated {lastUpdate}</span>
      </div>
    </div>
  );
}