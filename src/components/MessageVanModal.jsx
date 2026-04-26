import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { MessageCircle, Loader2, Send } from 'lucide-react';

const QUICK_REQUESTS = [
  "Can you come to my street? 🙏",
  "Are you near the park?",
  "How long until you're nearby?",
  "Please visit our road! Kids are waiting 🍦",
];

export default function MessageVanModal({ open, onClose, van }) {
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [locationHint, setLocationHint] = useState('');
  const [loading, setLoading] = useState(false);

  if (!van) return null;

  const handleSend = async () => {
    if (!message.trim()) { toast.error('Please enter a message'); return; }

    setLoading(true);
    await base44.entities.VanMessage.create({
      van_id: van.id,
      van_name: van.name,
      driver_email: van.driver_email,
      sender_name: senderName.trim() || null,
      message: message.trim(),
      location_hint: locationHint.trim() || null,
      is_read: false,
    });

    setLoading(false);
    toast.success(`Message sent to ${van.name}! 🍦`);
    setSenderName(''); setMessage(''); setLocationHint('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-pacifico text-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Message {van.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="flex flex-wrap gap-2">
            {QUICK_REQUESTS.map((q) => (
              <button
                key={q}
                onClick={() => setMessage(q)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  message === q
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border hover:bg-muted/80'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Message</Label>
            <Textarea
              placeholder="Write your message to the driver..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="rounded-xl resize-none h-20"
              maxLength={200}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Where are you? <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="e.g. Oak Street, near the school"
              value={locationHint}
              onChange={e => setLocationHint(e.target.value)}
              className="rounded-xl"
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Your name <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="e.g. James"
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              className="rounded-xl"
              maxLength={40}
            />
          </div>

          <Button onClick={handleSend} disabled={loading} className="w-full rounded-xl gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}