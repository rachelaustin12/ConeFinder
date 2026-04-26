import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IceCream, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const location = useLocation();
  const isDriver = location.pathname === '/driver';

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <IceCream className="w-5 h-5 text-primary" />
          </div>
          <span className="font-heading font-bold text-foreground hidden sm:block">
            Where's the Ice Cream Van?
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/">
            <Button variant={!isDriver ? "default" : "ghost"} size="sm" className="font-body gap-1.5 rounded-xl">
              <span className="hidden sm:inline">Find Vans</span>
            </Button>
          </Link>
          <Link to="/driver">
            <Button variant={isDriver ? "default" : "ghost"} size="sm" className="font-body gap-1.5 rounded-xl">
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">I'm a Driver</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}