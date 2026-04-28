import { Link, useLocation } from 'react-router-dom';
import { Search, Truck, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Always show on tab pages on mobile
  const TAB_PATHS = ['/', '/find', '/driver'];
  if (!isMobile || !TAB_PATHS.includes(location.pathname)) return null;

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/find', label: 'Find', icon: Search },
    { to: '/driver', label: 'Driver', icon: Truck },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50 flex md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {links.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={(e) => {
              if (active) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[56px] gap-0.5 text-xs font-semibold transition-colors relative ${
              active ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <motion.div
              animate={{ scale: active ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <span className={active ? 'opacity-100' : 'opacity-60'}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}