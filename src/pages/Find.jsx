import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { IceCream, Loader2, Plus, Star, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VanMap from '../components/VanMap';
import VanCard from '../components/VanCard';
import ReportSightingModal from '../components/ReportSightingModal';
import AddReviewModal from '../components/AddReviewModal';

export default function Find() {
  const navigate = useNavigate();
  const [userPos, setUserPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [pullStart, setPullStart] = useState(null);
  const [pullDelta, setPullDelta] = useState(0);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['active-vans'] });
    await queryClient.invalidateQueries({ queryKey: ['van-sightings'] });
    setTimeout(() => setRefreshing(false), 600);
  }, [queryClient]);

  useEffect(() => {
    const onTouchStart = (e) => setPullStart(e.touches[0].clientY);
    const onTouchMove = (e) => {
      if (pullStart === null || window.scrollY > 0) return;
      const delta = e.touches[0].clientY - pullStart;
      if (delta > 0) setPullDelta(Math.min(delta, 80));
    };
    const onTouchEnd = () => {
      if (pullDelta > 60) handleRefresh();
      setPullStart(null);
      setPullDelta(0);
    };
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [pullStart, pullDelta, handleRefresh]);


  const { data: vans = [], isLoading } = useQuery({
    queryKey: ['active-vans'],
    queryFn: () => base44.entities.IceCreamVan.filter({ is_active: true }),
    refetchInterval: 15000
  });

  const { data: sightings = [] } = useQuery({
    queryKey: ['van-sightings'],
    queryFn: async () => {
      const all = await base44.entities.VanSighting.list('-created_date', 100);
      const now = new Date();
      return all.filter((s) => !s.expires_at || new Date(s.expires_at) > now);
    },
    refetchInterval: 30000
  });

  // Merge sightings as pseudo-vans for the map (vans not already sharing live location)
  const sightingVans = sightings.
  filter((s) => !vans.find((v) => v.id === s.van_id)).
  map((s) => ({
    id: `sighting-${s.id}`,
    name: s.van_name,
    latitude: s.latitude,
    longitude: s.longitude,
    is_active: true,
    isSighting: true,
    note: s.note,
    reporter_name: s.reporter_name,
    last_location_update: s.created_date
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
    <div className="min-h-screen bg-background font-nunito">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted transition-colors md:hidden">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xl hidden md:inline">🗺️</span>
          <h1 className="text-[hsl(var(--color-sky))] text-lg font-semibold flex-1">Find Vans</h1>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowReviewModal(true)} className="bg-[#f094b1] text-[hsl(var(--secondary))] px-3 text-lg font-thin rounded-xl inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-8 gap-1.5">
            
            
            <Star className="w-4 h-4" />
            Review
          </Button>
          <Button
            size="sm"
            onClick={() => setShowModal(true)} className="bg-[#1499d2] text-[hsl(var(--background))] px-3 text-base font-thin rounded-xl inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-8 gap-1.5 hover:bg-accent/90">
            
            
            <Plus className="w-4 h-4" />
            I found one!
          </Button>
        </div>
      </header>

      {/* Pull-to-refresh indicator */}
      {(pullDelta > 10 || refreshing) &&
      <div className="fixed top-14 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className={`mt-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow transition-all ${refreshing ? 'opacity-100' : 'opacity-70'}`}>
            {refreshing ? '↻ Refreshing...' : pullDelta > 60 ? '↑ Release to refresh' : '↓ Pull to refresh'}
          </div>
        </div>
      }

      <main className="max-w-5xl mx-auto px-4 py-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}>
          
          <VanMap vans={allVans} className="h-[50vh] mb-6" />
        </motion.div>

        <div className="mb-4 flex items-center gap-2">
          <IceCream className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-thin">
            Active Vans
            {allVans.length > 0 &&
            <span className="text-muted-foreground font-inter text-sm font-normal ml-2">({allVans.length})</span>
            }
          </h2>
        </div>

        {isLoading ?
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div> :
        allVans.length === 0 ?
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-4">
          
            <div className="text-5xl mb-4">🍨</div>
            <h3 className="font-pacifico text-xl mb-1">No vans spotted yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Be the first to report a sighting!
            </p>
            <Button onClick={() => setShowModal(true)} className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
              📍 I found a van!
            </Button>
          </motion.div> :

        <div className="grid gap-3 sm:grid-cols-2">
            {allVans.map((van) =>
          <VanCard key={van.id} van={van} userPosition={userPos} />
          )}
          </div>
        }
      </main>

      <ReportSightingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        vans={vans}
        onReported={() => queryClient.invalidateQueries({ queryKey: ['van-sightings'] })} />
      
      <AddReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        vans={vans}
        onReviewed={() => {}} />
      
    </div>);

}