import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #fff9c4 50%, #fce4ec 100%)'}}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        <div className="text-7xl mb-4 drop-shadow-md">🍦</div>
        <h1 className="font-nunito font-bold text-4xl sm:text-5xl mb-3" style={{color: '#0ea5e9'}}>
          What's the Scoop?
        </h1>
        <p className="font-nunito mb-12 text-lg" style={{color: '#f472b6'}}>
          Are you a driver or an ice cream hunter?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hunter */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/hunt')}
            className="group flex flex-col items-center gap-3 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-200 border-2"
            style={{background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)', borderColor: '#0ea5e9'}}
          >
            <span className="text-5xl">🔍</span>
            <div>
              <h2 className="font-nunito font-bold text-2xl mb-1" style={{color: '#0284c7'}}>Hunter</h2>
              <p className="text-sm font-nunito" style={{color: '#0369a1'}}>
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
            style={{background: 'linear-gradient(135deg, #fff9c4, #fde68a)', borderColor: '#f59e0b'}}
          >
            <span className="text-5xl">🚐</span>
            <div>
              <h2 className="font-nunito font-bold text-2xl mb-1" style={{color: '#d97706'}}>Driver</h2>
              <p className="text-sm font-nunito" style={{color: '#b45309'}}>
                Share your live location with fans
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}