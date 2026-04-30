import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';

const STEPS = [
  {
    emoji: '🔍',
    title: 'Find a Van',
    desc: 'See ice cream vans sharing their live location on the map near you.',
  },
  {
    emoji: '🕵️',
    title: 'Spot one? Report it!',
    desc: 'Tap "I found one!" to pin a van on the map so others can track it down too.',
  },
  {
    emoji: '🚐',
    title: 'Are you a driver?',
    desc: 'Switch to Driver mode to broadcast your live location and let fans find you in real time.',
  },
  {
    emoji: '⭐',
    title: 'Leave a Review',
    desc: 'Rate your experience and help others find the best scoops in town!',
  },
];

export default function HowItWorksModal({ open, onClose }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onClose();
    }
  };

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-xs w-full p-8 flex flex-col items-center text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-6xl mb-4">{current.emoji}</div>
            <h2 className="font-nunito font-bold text-2xl mb-2" style={{ color: '#0ea5e9' }}>
              {current.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {current.desc}
            </p>

            {/* Step dots */}
            <div className="flex gap-1.5 mb-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="w-full rounded-xl flex items-center justify-center gap-1"
            >
              {step < STEPS.length - 1 ? (
                <>Next <ChevronRight className="w-4 h-4" /></>
              ) : (
                "Let's go! 🍦"
              )}
            </Button>

            {step < STEPS.length - 1 && (
              <button
                onClick={onClose}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}