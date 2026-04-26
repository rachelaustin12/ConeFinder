import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DriverMessages({ van }) {
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['van-messages', van.id],
    queryFn: () => base44.entities.VanMessage.filter({ van_id: van.id }, '-created_date', 50),
    refetchInterval: 15000,
  });

  const unread = messages.filter(m => !m.is_read);

  // Mark all unread as read when viewed
  useEffect(() => {
    if (unread.length === 0) return;
    unread.forEach(m => {
      base44.entities.VanMessage.update(m.id, { is_read: true });
    });
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['van-messages', van.id] }), 1000);
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
        No messages yet. Customers can message you from the Hunt page.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map(m => (
        <Card key={m.id} className={`border-border/60 transition-colors ${!m.is_read ? 'bg-primary/5 border-primary/30' : ''}`}>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm truncate">{m.sender_name || 'Anonymous'}</span>
                  {!m.is_read && <Badge className="text-[10px] py-0 px-1.5 bg-primary">New</Badge>}
                </div>
                <p className="text-sm text-foreground">{m.message}</p>
                {m.location_hint && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {m.location_hint}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(m.created_date), { addSuffix: true })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}