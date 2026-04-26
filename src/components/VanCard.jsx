import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IceCream, Clock, Navigation } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function VanCard({ van, userPosition }) {
  const lastUpdate = van.last_location_update
    ? formatDistanceToNow(new Date(van.last_location_update), { addSuffix: true })
    : null;

  const distance = userPosition && van.latitude && van.longitude
    ? getDistance(userPosition[0], userPosition[1], van.latitude, van.longitude)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow border-border/60 bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <IceCream className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-semibold text-sm truncate">{van.name}</h3>
                <div className="w-2 h-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {van.driver_name || 'Anonymous Driver'}
              </p>
              {van.specialties && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {van.specialties.split(',').slice(0, 3).map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] py-0 px-1.5 font-body">
                      {s.trim()}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {distance !== null && (
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
                  </span>
                )}
                {lastUpdate && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lastUpdate}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}