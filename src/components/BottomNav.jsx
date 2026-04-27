import { Link, useLocation } from 'react-router-dom';
import { Search, Truck } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useRef } from 'react';

export default function BottomNav() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const scrollPositions = useRef({});
  const prevPath = useRef(location.pathname);

  const handleTabClick = (to) => {
    // If clicking the active tab, scroll to top
    if (location.pathname === to) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const current = prevPath.current;
    const next = location.pathname;

    // Save scroll position before leaving
    scrollPositions.current[current] = window.scrollY;

    // Restore scroll position on entry with small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const savedScroll = scrollPositions.current[next];
      if (typeof savedScroll === 'number') {
        window.scrollTo(0, savedScroll);
      }
    }, 0);

    prevPath.current = next;
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isMobile || location.pathname === '/') return null;

  const links = [
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
                handleTabClick(to);
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] gap-0.5 text-xs font-semibold transition-colors ${
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