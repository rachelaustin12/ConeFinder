import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HowItWorksModal from '../components/HowItWorksModal';
import SettingsModal from '../components/SettingsModal';
import { Settings, X } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cone_finder_onboarded')) {
      setShowHowItWorks(true);
      localStorage.setItem('cone_finder_onboarded', '1');
    }
  }, []);

  const handleExit = () => {
    if (window.navigator && window.navigator.app && window.navigator.app.exitApp) {
      window.navigator.app.exitApp(); // Cordova
    } else {
      window.close();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #fff9c4 50%, #fce4ec 100%)' }}>
      <div className="absolute right-4 z-10 flex items-center gap-2" style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full bg-white/60 hover:bg-white/90 transition-colors shadow-sm"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
        <button
          onClick={handleExit}
          className="p-2 rounded-full bg-white/60 hover:bg-white/90 transition-colors shadow-sm"
          title="Exit app"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full">
        
        <div className="text-7xl mb-4 drop-shadow-md">🍦</div>
        <h1 className="font-nunito font-bold text-4xl sm:text-5xl mb-3" style={{ color: '#0ea5e9' }}>
          Show me the yummy!
        </h1>
        

        

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hunter */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/find')}
            className="group flex flex-col items-center gap-3 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-200 border-2"
            style={{ background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)', borderColor: '#0ea5e9' }}>
            
            <span className="text-5xl">🔍</span>
            <div>
              <h2 className="font-nunito font-bold text-2xl mb-1" style={{ color: '#0284c7' }}>Finder</h2>
              <p className="text-xs font-thin" style={{ color: '#0369a1' }}>
                Find ice cream vans near you
              </p>
            </div>
          </motion.button>

          {/* Driver */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/driver')}
            className="group flex flex-col items-center gap-3 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-200 border-2"
            style={{ background: 'linear-gradient(135deg, #fff9c4, #fde68a)', borderColor: '#f59e0b' }}>
            
            <span className="text-5xl">🚐</span>
            <div>
              <h2 className="font-nunito font-bold text-2xl mb-1" style={{ color: '#d97706' }}>Driver</h2>
              <p className="text-xs font-thin" style={{ color: '#b45309' }}>
                Share your live location with fans
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      <HowItWorksModal open={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} onShowHowItWorks={() => setShowHowItWorks(true)} />

      <footer className="mt-12 py-6 text-center border-t border-border/20 flex items-center justify-center gap-4">
        <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <span className="text-border">·</span>
        <Link to="/data-deletion" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Data Deletion
        </Link>
      </footer>
    </div>);

}