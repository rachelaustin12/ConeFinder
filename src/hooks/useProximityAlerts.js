import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const ALERT_RADIUS_KM = 0.5;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useProximityAlerts(vans, userPosition) {
  // Track which van IDs we've already alerted about so we don't spam
  const alertedVans = useRef(new Set());

  useEffect(() => {
    if (!userPosition || !vans || vans.length === 0) return;

    const nearbyVanIds = new Set();

    vans.forEach((van) => {
      if (!van.latitude || !van.longitude || van.isSighting) return;

      const dist = getDistance(userPosition[0], userPosition[1], van.latitude, van.longitude);

      if (dist <= ALERT_RADIUS_KM) {
        nearbyVanIds.add(van.id);
        if (!alertedVans.current.has(van.id)) {
          alertedVans.current.add(van.id);
          toast(`🍦 ${van.name} is nearby!`, {
            description: `Only ${dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`} away — go get it!`,
            duration: 6000,
          });
        }
      }
    });

    // Remove vans from alerted set if they've moved away, so we can re-alert if they come back
    alertedVans.current.forEach((id) => {
      if (!nearbyVanIds.has(id)) {
        alertedVans.current.delete(id);
      }
    });
  }, [vans, userPosition]);
}