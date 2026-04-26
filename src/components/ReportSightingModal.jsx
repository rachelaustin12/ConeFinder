import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';

export default function ReportSightingModal({ open, onClose, vans, onReported }) {
  const [selectedVanId, setSelectedVanId] = useState('');
  const [note, setNote] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReport = () => {
    if (!selectedVanId) {
      toast.error('Please select a van');
      return;
    }
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported on this device');
      return;
    }
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
        setSelectedVanId('');
        setNote('');
        setReporterName('');
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-pacifico text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            I found a van!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Which van?</Label>
            <Select value={selectedVanId} onValueChange={setSelectedVanId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a van..." />
              </SelectTrigger>
              <SelectContent>
                {vans.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Where exactly? <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="e.g. Outside the park gates"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="rounded-xl"
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Your name <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="e.g. Sarah"
              value={reporterName}
              onChange={e => setReporterName(e.target.value)}
              className="rounded-xl"
              maxLength={40}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            📍 We'll use your current location to pin the van on the map. Sightings expire at midnight.
          </p>

          <Button onClick={handleReport} disabled={loading} className="w-full rounded-xl">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : '📍 '}
            Share My Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}