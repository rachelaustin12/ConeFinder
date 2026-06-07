import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Info, Trash2, MapPin, ChevronRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ContactModal from './ContactModal';

export default function SettingsModal({ open, onClose, onShowHowItWorks }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleDeleteData = async () => {
    setDeleting(true);
    try {
      // Delete any vans this user created
      const vans = await base44.entities.IceCreamVan.filter({});
      const user = await base44.auth.me();
      const myVans = vans.filter((v) => v.created_by === user.email || v.driver_email === user.email);
      for (const van of myVans) {
        await base44.entities.IceCreamVan.delete(van.id);
      }
      // Clear local onboarding flag too
      localStorage.removeItem('cone_finder_onboarded');
      toast.success('Your data has been deleted.');
      setConfirmDelete(false);
      onClose();
    } catch (e) {
      toast.error('Something went wrong, please try again.');
    }
    setDeleting(false);
  };

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 40 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} className="bg-white my-40 p-6 rounded-3xl relative z-10 shadow-2xl w-full max-w-sm">
          
          
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-nunito font-bold text-xl mb-1" style={{ color: '#0ea5e9' }}>⚙️ Settings</h2>
            <p className="text-xs text-muted-foreground mb-5">Manage your app preferences</p>

            <div className="space-y-3">
              {/* How it works */}
              <button
              onClick={() => {onClose();onShowHowItWorks();}}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-sky-50 hover:bg-sky-100 transition-colors text-left">
              
                <Info className="w-5 h-5 text-sky-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-sky-700">How it works</p>
                  <p className="text-xs text-sky-500">Replay the getting started guide</p>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </button>

              {/* Contact Us */}
              <button
              onClick={() => setShowContact(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors text-left">
                <Mail className="w-5 h-5 text-pink-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-pink-700">Contact Us</p>
                  <p className="text-xs text-pink-500">Report a problem or send feedback</p>
                </div>
                <ChevronRight className="w-4 h-4 text-pink-400" />
              </button>

              {/* Driving safety notice */}
              <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-red-50 border border-red-100">
                <span className="text-lg shrink-0">🚫📱</span>
                <div>
                  <p className="text-sm font-semibold text-red-700">Stay safe on the road</p>
                  <p className="text-xs text-red-600 leading-relaxed mt-0.5">
                    Never use your phone while driving. Pull over safely before checking the app.
                  </p>
                </div>
              </div>

              {/* Location accuracy notice */}
              <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-700">Location accuracy</p>
                  <p className="text-xs text-amber-600 leading-relaxed mt-0.5">
                    Van locations are based on GPS and user reports. Actual position may vary — always look around when you get close!
                  </p>
                </div>
              </div>

              {/* Delete account data */}
              {!confirmDelete ? null :












            <div className="px-4 py-3 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                  <p className="text-sm font-semibold text-red-600">Are you sure?</p>
                  <p className="text-xs text-red-500">This will permanently delete your van profile and associated data. This can't be undone.</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1 rounded-xl text-xs">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleDeleteData} disabled={deleting} className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs">
                      {deleting ? 'Deleting...' : 'Yes, delete'}
                    </Button>
                  </div>
                </div>
            }
            </div>
          </motion.div>
        </motion.div>
      }
    <ContactModal open={showContact} onClose={() => setShowContact(false)} />
    </AnimatePresence>);

}