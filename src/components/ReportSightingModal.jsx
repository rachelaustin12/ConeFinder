import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { MapPin, Loader2, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

function VanPickerDrawer({ vans, selectedVanId, onSelect }) {
  const [open, setOpen] = useState(false);
  const selected = vans.find(v => v.id === selectedVanId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-xl bg-background text-sm text-left hover:bg-muted/40 transition-colors"
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected ? selected.name : 'Select a van...'}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Which van did you spot?</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-2">
            {vans.map(v => (
              <button
                key={v.id}
                onClick={() => { onSelect(v.id); setOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  selectedVanId === v.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function ReportSightingModal({ open, onClose, vans, onReported }) {
  const [selectedVanId, setSelectedVanId] = useState('');
  const [note, setNote] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleReport = () => {
    if (!selectedVanId) { toast.error('Please select a van'); return; }
    if (!navigator.geolocation) { toast.error('Geolocation not supported on this device'); return; }

    // Optimistic: show loading immediately
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const van = vans.find(v => v.id === selectedVanId);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        await base44.entities.VanSighting.create({
          van_id: selectedVanId,
          van_name: van.name,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          reporter_name: reporterName.trim() || null,
          note: note.trim() || null,
          expires_at: endOfDay.toISOString(),
        });

        setLoading(false);
        toast.success("Sighting reported! Thanks for helping others find ice cream 🍦");
        setSelectedVanId(''); setNote(''); setReporterName('');
        onClose();
        onReported();
      },
      () => {
        setLoading(false);
        toast.error('Could not get your location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const formContent = (
    <div className="space-y-4 pt-1">
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Which van?</Label>
        {isMobile ? (
          <VanPickerDrawer vans={vans} selectedVanId={selectedVanId} onSelect={setSelectedVanId} />
        ) : (
          <select
            value={selectedVanId}
            onChange={e => setSelectedVanId(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-xl bg-background text-sm"
          >
            <option value="">Select a van...</option>
            {vans.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Where exactly? <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Input placeholder="e.g. Outside the park gates" value={note} onChange={e => setNote(e.target.value)} className="rounded-xl" maxLength={80} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Your name <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Input placeholder="e.g. Sarah" value={reporterName} onChange={e => setReporterName(e.target.value)} className="rounded-xl" maxLength={40} />
      </div>

      <p className="text-xs text-muted-foreground">
        📍 We'll use your current location to pin the van on the map. Sightings expire at midnight.
      </p>

      <Button onClick={handleReport} disabled={loading} className="w-full rounded-xl">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Getting location...</> : '📍 Share My Location'}
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-pacifico text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            I found a van!
          </DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}