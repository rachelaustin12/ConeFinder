import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ContactModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleSend = async () => {
    if (!message.trim()) { toast.error('Please enter a message'); return; }
    setSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: 'anxiousoakley@gmail.com',
        subject: `Cone Finder - User Report${name.trim() ? ` from ${name.trim()}` : ''}`,
        body: `${name.trim() ? `From: ${name.trim()}\n\n` : ''}${message.trim()}`,
      });
      toast.success('Message sent! Thanks for getting in touch 🍦');
      setName('');
      setMessage('');
      onClose();
    } catch {
      toast.error('Failed to send — please try again.');
    }
    setSending(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>

          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 40 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-white p-6 rounded-3xl relative z-10 shadow-2xl w-full max-w-sm">

            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-nunito font-bold text-xl mb-1" style={{ color: '#0ea5e9' }}>✉️ Contact Us</h2>
            <p className="text-xs text-muted-foreground mb-5">Report a problem or send us feedback</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Your name <span className="font-normal">(optional)</span></label>
                <Input
                  placeholder="e.g. Sarah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                  maxLength={60}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Message</label>
                <textarea
                  placeholder="Describe the issue or feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{message.length}/1000</p>
              </div>

              <Button onClick={handleSend} disabled={sending} className="w-full rounded-xl">
                {sending
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  : <><Send className="w-4 h-4" /> Send Message</>}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}