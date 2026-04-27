import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IceCream, Clock, Navigation, Eye, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import MessageVanModal from './MessageVanModal';

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function VanCard({ van, userPosition }) {
  const [showMessage, setShowMessage] = useState(false);
  const lastUpdate = van.last_location_update ?
  formatDistanceToNow(new Date(van.last_location_update), { addSuffix: true }) :
  null;

  const distance = userPosition && van.latitude && van.longitude ?
  getDistance(userPosition[0], userPosition[1], van.latitude, van.longitude) :
  null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      
      <Card className="overflow-hidden hover:shadow-md transition-shadow border-border/60 bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${van.isSighting ? 'bg-accent/10' : 'bg-primary/10'}`}>
            {van.isSighting ? <Eye className="w-5 h-5 text-accent" /> : <IceCream className="w-5 h-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-thin truncate">{van.name}</h3>
              <div className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${van.isSighting ? 'bg-accent' : 'bg-green-400'}`} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {van.isSighting ?
                `Spotted by ${van.reporter_name || 'a hunter'}` :
                van.driver_name || 'Anonymous Driver'}
            </p>
            {van.note &&
              <p className="text-xs text-muted-foreground mt-0.5">"{van.note}"</p>
              }
            {van.specialties &&
              <div className="flex flex-wrap gap-1 mt-2">
                  {van.specialties.split(',').slice(0, 3).map((s, i) =>
                <Badge key={i} variant="secondary" className="bg-[hsl(var(--destructive-foreground))] text-[10px] px-1.5 py-0 font-body opacity-100 rounded-md inline-flex items-center border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80">
                      {s.trim()}
                    </Badge>
                )}
                </div>
              }
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {distance !== null &&
                  <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
                    </span>
                  }
                  {lastUpdate &&
                  <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lastUpdate}
                    </span>
                  }
                </div>
                {!van.isSighting && van.messages_enabled !== false &&
                <button
                  onClick={() => setShowMessage(true)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
                  
                    <MessageCircle className="w-3.5 h-3.5" />
                    Message
                  </button>
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <MessageVanModal open={showMessage} onClose={() => setShowMessage(false)} van={van} />
    </motion.div>);

}