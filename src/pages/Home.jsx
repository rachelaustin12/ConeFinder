import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { IceCream, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import VanMap from '../components/VanMap';
import VanCard from '../components/VanCard';

export default function Home() {
  const [userPos, setUserPos] = useState(null);

  const { data: vans = [], isLoading } = useQuery({
    queryKey: ['active-vans'],
    queryFn: () => base44.entities.IceCreamVan.filter({ is_active: true }),
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-body">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Find Ice Cream Near You 🍦
          </h1>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Discover ice cream vans in your area sharing their live location. Never miss the jingle again!
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <VanMap vans={vans} className="h-[50vh] mb-6" />
        </motion.div>

        {/* Active Vans List */}
        <div className="mb-4 flex items-center gap-2">
          <IceCream className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg">
            Active Vans
            {vans.length > 0 && (
              <span className="text-muted-foreground font-body text-sm ml-2">({vans.length})</span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : vans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4"
          >
            <div className="text-5xl mb-4">🍨</div>
            <h3 className="font-heading font-semibold text-lg mb-1">No vans active right now</h3>
            <p className="text-muted-foreground text-sm">
              Check back later — drivers will start sharing their locations soon!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {vans.map(van => (
              <VanCard key={van.id} van={van} userPosition={userPos} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}