import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Star, Loader2, Camera, ChevronDown } from 'lucide-react';
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
            <DrawerTitle>Which van would you like to review?</DrawerTitle>
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

export default function AddReviewModal({ open, onClose, vans, onReviewed }) {
  const [selectedVanId, setSelectedVanId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async () => {
    if (!selectedVanId) { toast.error('Please select a van'); return; }
    if (!rating) { toast.error('Please give a rating'); return; }

    // Optimistic: show loading immediately
    setLoading(true);
    const van = vans.find(v => v.id === selectedVanId);

    let photo_url = null;
    if (photoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
      photo_url = file_url;
    }

    await base44.entities.VanReview.create({
      van_id: selectedVanId,
      van_name: van.name,
      rating,
      comment: comment.trim() || null,
      reviewer_name: reviewerName.trim() || null,
      photo_url,
    });

    setLoading(false);
    toast.success('Review posted! Thanks 🍦');
    setSelectedVanId(''); setRating(0); setComment(''); setReviewerName(''); setPhotoFile(null);
    onClose();
    onReviewed();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-pacifico text-xl flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Leave a Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-sm font-bold">Which van?</Label>
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
            <Label className="text-sm font-bold">Rating</Label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} className="text-2xl transition-transform hover:scale-110 active:scale-95">
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