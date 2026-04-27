import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Truck, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function VanSetupForm({ user, onCreated }) {
  const [name, setName] = useState('');
  const [driverName, setDriverName] = useState(user?.full_name || '');
  const [specialties, setSpecialties] = useState('');
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a van name");
      return;
    }
    setSaving(true);
    const van = await base44.entities.IceCreamVan.create({
      name: name.trim(),
      driver_name: driverName.trim(),
      driver_email: user.email,
      specialties: specialties.trim(),
      is_active: false,
      messages_enabled: messagesEnabled,
    });
    setSaving(false);
    toast.success("Van created! You can now start sharing your location.");
    onCreated(van);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-heading text-2xl font-bold mb-1">Set Up Your Van</h2>
        <p className="text-muted-foreground text-sm">Tell customers about your ice cream van</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label className="font-body font-semibold text-sm">Van Name *</Label>
          <Input
            placeholder="e.g. Mr. Whippy's Van"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body font-semibold text-sm">Your Name</Label>
          <Input
            placeholder="e.g. John"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body font-semibold text-sm">Time to sell yourself...</Label>
          <Textarea
            placeholder="e.g. Soft serve, Gelato, Popsicles, Milkshakes"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="rounded-xl resize-none h-20"
          />
          <p className="text-xs text-muted-foreground">Separate with commas</p>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-semibold">Allow visit requests</p>
              <p className="text-xs text-muted-foreground">Hunters can send you messages</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMessagesEnabled(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${messagesEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${messagesEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
        <Button type="submit" className="w-full rounded-xl font-body" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create My Van
        </Button>
      </form>
    </motion.div>
  );
}