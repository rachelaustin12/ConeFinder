import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { IceCream, Loader2, ArrowLeft, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VanMap from '../components/VanMap';
import VanCard from '../components/VanCard';
import ReportSightingModal from '../components/ReportSightingModal';

export default function Hunt() {
  const [userPos, setUserPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const playJingle = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Simple ice-cream-van style jingle: "Greensleeves" opening notes
    const notes = [
      { freq: 392, dur: 0.3 }, { freq: 440, dur: 0.15 }, { freq: 523, dur: 0.3 },
      { freq: 494, dur: 0.15 }, { freq: 440, dur: 0.3 }, { freq: 392, dur: 0.3 },
      { freq: 349, dur: 0.45 }, { freq: 294, dur: 0.15 }, { freq: 330, dur: 0.3 },
      { freq: 392, dur: 0.3 }, { freq: 440, dur: 0.45 }, { freq: 392, dur: 0.15 },
      { freq: 349, dur: 0.3 }, { freq: 330, dur: 0.6 },
    ];
    let t = ctx.currentTime + 0.05;
    notes.forEach(({ freq, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur);
      t += dur;
    });
  };

  const { data: vans = [], isLoading } = useQuery({
    queryKey: ['active-vans'],
    queryFn: () => base44.entities.IceCreamVan.filter({ is_active: true }),
    refetchInterval: 15000,
  });

  const { data: sightings = [] } = useQuery({
    queryKey: ['van-sightings'],
    queryFn: async () => {
      const all = await base44.entities.VanSighting.list('-created_date', 100);
      const now = new Date();
      return all.filter(s => !s.expires_at || new Date(s.expires_at) > now);
    },
    refetchInterval: 30000,
  });

  // Merge sightings as pseudo-vans for the map (vans not already sharing live location)
  const sightingVans = sightings
    .filter(s => !vans.find(v => v.id === s.van_id))
    .map(s => ({
      id: `sighting-${s.id}`,
      name: s.van_name,
      latitude: s.latitude,
      longitude: s.longitude,
      is_active: true,
      isSighting: true,
      note: s.note,
      reporter_name: s.reporter_name,
      last_location_update: s.created_date,
    }));

  const allVans = [...vans, ...sightingVans];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-inter">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <span className="text-xl">🔍</span>
          <h1 className="font-pacifico text-xl text-foreground flex-1">Hunt for Ice Cream</h1>
          <Button
            size="sm"
            onClick={() => { playJingle(); setShowModal(true); }}
            className="rounded-xl gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Plus className="w-4 h-4" />
            I found one!
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
        >
          <VanMap vans={allVans} className="h-[50vh] mb-6" />
        </motion.div>

        <div className="mb-4 flex items-center gap-2">
          <IceCream className="w-5 h-5 text-primary" />
          <h2 className="font-pacifico text-xl">
            Active Vans
            {allVans.length > 0 && (
              <span className="text-muted-foreground font-inter text-sm font-normal ml-2">({allVans.length})</span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : allVans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4"
          >
            <div className="text-5xl mb-4">🍨</div>
            <h3 className="font-pacifico text-xl mb-1">No vans spotted yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Be the first to report a sighting!
            </p>
            <Button onClick={() => { playJingle(); setShowModal(true); }} className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
              📍 I found a van!
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {allVans.map(van => (
              <VanCard key={van.id} van={van} userPosition={userPos} />
            ))}
          </div>
        )}
      </main>

      <ReportSightingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        vans={vans}
        onReported={() => queryClient.invalidateQueries({ queryKey: ['van-sightings'] })}
      />
    </div>
  );
}