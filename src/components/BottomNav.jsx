import { Link, useLocation } from 'react-router-dom';
import { Search, Truck } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function BottomNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile || location.pathname === '/') return null;

  const links = [
    { to: '/hunt', label: 'Hunt', icon: Search },
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
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-semibold transition-colors ${
              active ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}