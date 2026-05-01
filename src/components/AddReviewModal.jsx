import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Star, Loader2, Camera, ChevronDown, Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Simple inline dropdown — avoids nested portal z-index issues inside Dialog
function VanPicker({ vans, selectedVanId, onSelect, onAddNew }) {
  const [open, setOpen] = useState(false);
  const selected = vans.find(v => v.id === selectedVanId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-xl bg-background text-sm text-left hover:bg-muted/40 transition-colors"
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected ? selected.name : 'Select a van...'}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)} />
          <div className="absolute z-[160] top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
            {vans.length === 0 && (
              <p className="text-xs text-muted-foreground px-4 py-3">No vans found yet.</p>
            )}
            {vans.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => { onSelect(v.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted ${
                  selectedVanId === v.id ? 'bg-primary/10 text-primary font-semibold' : ''
                }`}
              >
                {v.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { onAddNew(); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-primary font-semibold flex items-center gap-2 border-t border-border hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4" /> Add a new van...
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AddReviewModal({ open, onClose, onReviewed }) {
  const [selectedVanId, setSelectedVanId] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newVanName, setNewVanName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch ALL vans (not just active ones) so the reviewer can always pick one
  const { data: allVans = [] } = useQuery({
    queryKey: ['all-vans-for-review'],
    queryFn: () => base44.entities.IceCreamVan.list('-updated_date', 200),
    enabled: open,
  });

  const handleClose = () => {
    setSelectedVanId(''); setIsAddingNew(false); setNewVanName('');
    setRating(0); setComment(''); setReviewerName(''); setPhotoFile(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!isAddingNew && !selectedVanId) { toast.error('Please select a van'); return; }
    if (isAddingNew && !newVanName.trim()) { toast.error('Please enter the van name'); return; }
    if (!rating) { toast.error('Please give a rating'); return; }

    setLoading(true);

    let vanId = selectedVanId;
    let van = allVans.find(v => v.id === selectedVanId);

    if (isAddingNew) {
      const newVan = await base44.entities.IceCreamVan.create({
        name: newVanName.trim(),
        driver_email: 'unknown@unknown.com',
        is_active: false,
      });
      vanId = newVan.id;
      van = newVan;
    }

    let photo_url = null;
    if (photoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
      photo_url = file_url;
    }

    await base44.entities.VanReview.create({
      van_id: vanId,
      van_name: van.name,
      rating,
      comment: comment.trim() || null,
      reviewer_name: reviewerName.trim() || null,
      photo_url,
    });

    setLoading(false);
    toast.success('Review posted! Thanks 🍦');
    handleClose();
    onReviewed();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="rounded-3xl max-w-sm font-nunito">
        <DialogHeader>
         <DialogTitle className="text-[hsl(var(--color-sky))] text-xl font-thin tracking-tight flex items-center gap-2">
           <Star className="w-5 h-5 text-yellow-400" />
           Give us the scoop
         </DialogTitle>
         <DialogDescription className="text-sm text-muted-foreground">
           Is it yes please or brain freeze?
         </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-sm font-bold">Which van?</Label>
            <VanPicker
              vans={allVans}
              selectedVanId={selectedVanId}
              onSelect={(id) => { setSelectedVanId(id); setIsAddingNew(false); }}
              onAddNew={() => { setIsAddingNew(true); setSelectedVanId(''); }}
            />
            {isAddingNew && (
              <div className="space-y-1.5 mt-2">
                <Input
                  placeholder="e.g. Mr Whippy's"
                  value={newVanName}
                  onChange={e => setNewVanName(e.target.value)}
                  className="rounded-xl"
                  maxLength={60}
                  autoFocus />
                <p className="text-xs text-muted-foreground">This will add the van so others can find and review it too.</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold">Rating</Label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setRating(n)} className="text-2xl transition-transform hover:scale-110 active:scale-95">
                  {n <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold">Comment <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Textarea placeholder="How was it? What did you try?" value={comment} onChange={e => setComment(e.target.value)} className="rounded-xl resize-none h-20" maxLength={300} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold">Your name <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input placeholder="e.g. Emma" value={reviewerName} onChange={e => setReviewerName(e.target.value)} className="rounded-xl" maxLength={40} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold">Photo <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl p-3 hover:bg-muted/40 transition-colors">
              <Camera className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {photoFile ? photoFile.name : 'Upload a photo of your ice cream'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(e.target.files[0])} />
            </label>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full rounded-xl">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Posting...</> : '⭐ Post Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}