import React, { useEffect, useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DriverLocationToggle({ van, onUpdate }) {
  const watchRef = useRef(null);

  const startSharing = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const data = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          is_active: true,
          last_location_update: new Date().toISOString()
        };
        await base44.entities.IceCreamVan.update(van.id, data);
        onUpdate({ ...van, ...data });
      },
      (err) => {
        toast.error("Could not get your location. Please enable location services.");
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  };

  const stopSharing = async () => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    const data = { is_active: false };
    await base44.entities.IceCreamVan.update(van.id, data);
    onUpdate({ ...van, ...data });
  };

  useEffect(() => {
    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, []);

  const handleToggle = (checked) => {
    if (checked) {
      startSharing();
      toast.success("You're now sharing your location!");
    } else {
      stopSharing();
      toast("Location sharing stopped");
    }
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${van.is_active ? 'bg-green-50 border-green-200' : 'bg-muted/50 border-border'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${van.is_active ? 'bg-green-100' : 'bg-muted'}`}>
        <MapPin className={`w-5 h-5 ${van.is_active ? 'text-green-600' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1">
        <Label className="font-heading font-semibold text-sm">
          {van.is_active ? 'Sharing Location' : 'Location Off'}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          {van.is_active ? 'Customers can find you on the map' : 'Turn on to let customers find you'}
        </p>
      </div>
      <Switch checked={van.is_active} onCheckedChange={handleToggle} />
    </div>
  );
}