import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        <div className="text-6xl mb-4">🍦</div>
        <h1 className="font-nunito font-bold text-4xl sm:text-5xl text-foreground mb-3">
          Where's the Ice Cream Van?
        </h1>
        <p className="text-muted-foreground font-nunito mb-12 text-lg">
          Are you a driver or an ice cream hunter?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hunter */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/hunt')}
            className="group flex flex-col items-center gap-3 bg-card border-2 border-border hover:border-primary rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <span className="text-5xl">🔍</span>
            <div>
              <h2 className="font-nunito font-bold text-2xl text-foreground mb-1">Hunter</h2>
              <p className="text-muted-foreground text-sm font-nunito">
                Find ice cream vans near you
              </p>
            </div>
          </motion.button>

          {/* Driver */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/driver')}
            className="group flex flex-col items-center gap-3 bg-card border-2 border-border hover:border-secondary rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <span className="text-5xl">🚐</span>
            <div>
              <h2 className="font-nunito font-bold text-2xl text-foreground mb-1">Driver</h2>
              <p className="text-muted-foreground text-sm font-nunito">
                Share your live location with fans
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}