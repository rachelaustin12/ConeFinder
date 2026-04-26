import { Link, useLocation } from 'react-router-dom';
import { MapPin, Truck } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #e0f4ff 0%, #fff9e6 50%, #ffe0f0 100%)' }}>
      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-1">🍦</div>
          <h1 className="font-pacifico text-3xl md:text-4xl text-primary leading-tight drop-shadow-sm">
            Where's the Ice Cream Van?
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Find your local ice cream van — before it drives away!</p>
        </div>

        {/* Nav tabs */}
        <div className="max-w-sm mx-auto mt-4 flex bg-white/70 backdrop-blur rounded-2xl p-1 shadow-md border border-white">
          <Link
            to="/"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
              location.pathname === '/'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Find a Van
          </Link>
          <Link
            to="/driver"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
              location.pathname === '/driver'
                ? 'bg-secondary text-secondary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Truck className="w-4 h-4" />
            I'm a Driver
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}