import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { IceCream, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VanMap from '../components/VanMap';
import VanCard from '../components/VanCard';

export default function Hunt() {
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
    <div className="min-h-screen bg-background font-inter">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <span className="text-xl">🔍</span>
          <h1 className="font-pacifico text-xl text-foreground">Hunt for Ice Cream</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
        >
          <VanMap vans={vans} className="h-[50vh] mb-6" />
        </motion.div>

        <div className="mb-4 flex items-center gap-2">
          <IceCream className="w-5 h-5 text-primary" />
          <h2 className="font-pacifico text-xl">
            Active Vans
            {vans.length > 0 && (
              <span className="text-muted-foreground font-inter text-sm font-normal ml-2">({vans.length})</span>
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
            <h3 className="font-pacifico text-xl mb-1">No vans active right now</h3>
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