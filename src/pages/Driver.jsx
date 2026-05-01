import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, IceCream, Pencil, Camera, Trash2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import VanSetupForm from '../components/VanSetupForm';
import DriverMessages from '../components/DriverMessages';
import DriverLocationToggle from '../components/DriverLocationToggle';
import VanMap from '../components/VanMap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Driver() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deletingAccount, setDeletingAccount] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoadingUser(false);
    }).catch(() => setLoadingUser(false));
  }, []);

  const { data: vans = [], isLoading: loadingVans } = useQuery({
    queryKey: ['my-van', user?.email],
    queryFn: () => base44.entities.IceCreamVan.filter({ driver_email: user.email }),
    enabled: !!user?.email,
  });

  const myVan = vans[0] || null;

  const handleVanCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['my-van'] });
  };

  const handleVanUpdate = (updatedVan) => {
    queryClient.setQueryData(['my-van', user.email], [updatedVan]);
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    if (myVan) {
      await base44.entities.IceCreamVan.delete(myVan.id);
    }
    await base44.auth.logout('/');
  };

  const handleEditSave = async () => {
    let image_url = editForm.image_url;
    if (editForm.photoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: editForm.photoFile });
      image_url = file_url;
    }
    await base44.entities.IceCreamVan.update(myVan.id, {
      name: editForm.name,
      driver_name: editForm.driver_name,
      specialties: editForm.specialties,
      pricing: editForm.pricing,
      image_url,
    });
    queryClient.invalidateQueries({ queryKey: ['my-van'] });
    setEditing(false);
    toast.success("Van details updated!");
  };

  const headerEl = (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
      <button onClick={() => navigate('/')} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-xl">
        🏡
      </button>
        <span className="text-xl hidden md:inline">🚐</span>
        <h1 className="text-[hsl(var(--color-sky))] text-lg font-semibold flex-1">Driver Dashboard</h1>
      </div>
    </header>
  );

  if (loadingUser || (user && loadingVans)) {
    return (
      <div className="min-h-screen bg-background font-nunito">
        {headerEl}
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background font-nunito">
        {headerEl}
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🚐</div>
          <h2 className="font-heading text-2xl font-bold mb-2">Driver Dashboard</h2>
          <p className="text-muted-foreground mb-6">Sign in to manage your ice cream van and share your location with customers.</p>
          <Button onClick={() => base44.auth.redirectToLogin()} className="rounded-xl font-nunito">
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-nunito">
      {headerEl}
      <main className="max-w-2xl mx-auto px-4 py-6" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        {!myVan ? (
          <VanSetupForm user={user} onCreated={handleVanCreated} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="text-center mb-2">
              <h1 className="font-heading text-2xl font-bold">Your Van Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage your van and share your location</p>
            </div>

            {/* Location Toggle */}
            <DriverLocationToggle van={myVan} onUpdate={handleVanUpdate} />

            {/* Van Info Card */}
            <Card className="border-border/60">
              <CardContent className="p-5">
                {editing ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                       <Label className="text-xs font-semibold">Van Name</Label>
                       <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="rounded-xl text-base" />
                     </div>
                     <div className="space-y-1.5">
                       <Label className="text-xs font-semibold">Driver Name</Label>
                       <Input value={editForm.driver_name} onChange={e => setEditForm({...editForm, driver_name: e.target.value})} className="rounded-xl text-base" />
                     </div>
                     <div className="space-y-1.5">
                       <Label className="text-xs font-semibold">Specialties</Label>
                       <Textarea value={editForm.specialties} onChange={e => setEditForm({...editForm, specialties: e.target.value})} className="rounded-xl resize-none h-16 text-base" />
                     </div>
                     <div className="space-y-1.5">
                       <Label className="text-xs font-semibold">Pricing</Label>
                       <Input placeholder="e.g. Cones from £1.50, Flake 99 £2.50" value={editForm.pricing} onChange={e => setEditForm({...editForm, pricing: e.target.value})} className="rounded-xl text-base" />
                     </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Van Photo</Label>
                      <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl p-3 hover:bg-muted/40 transition-colors">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {editForm.photoFile ? editForm.photoFile.name : (editForm.image_url ? 'Change photo' : 'Upload a photo of your van')}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => setEditForm({...editForm, photoFile: e.target.files[0]})} />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-xl font-nunito" onClick={handleEditSave}>Save</Button>
                      <Button size="sm" variant="ghost" className="rounded-xl font-nunito" onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {myVan.image_url ? (
                        <img src={myVan.image_url} alt={myVan.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <IceCream className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{myVan.name}</h3>
                        <p className="text-xs text-muted-foreground">{myVan.driver_name || 'No name set'}</p>
                        {myVan.specialties && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {myVan.specialties.split(',').map((s, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] py-0 px-1.5">{s.trim()}</Badge>
                            ))}
                          </div>
                        )}
                        {myVan.pricing && (
                          <p className="text-xs text-muted-foreground mt-1.5">💰 {myVan.pricing}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() => {
                        setEditForm({ name: myVan.name, driver_name: myVan.driver_name || '', specialties: myVan.specialties || '', pricing: myVan.pricing || '', image_url: myVan.image_url || '', photoFile: null });
                        setEditing(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Customer Messages
                </h3>
                <button
                  onClick={async () => {
                    const updated = await base44.entities.IceCreamVan.update(myVan.id, { messages_enabled: !myVan.messages_enabled });
                    handleVanUpdate({ ...myVan, messages_enabled: !myVan.messages_enabled });
                    toast.success(myVan.messages_enabled ? 'Visit requests turned off' : 'Visit requests turned on');
                  }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${myVan.messages_enabled !== false ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${myVan.messages_enabled !== false ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {myVan.messages_enabled !== false && <DriverMessages van={myVan} />}
              {myVan.messages_enabled === false && (
                <p className="text-xs text-muted-foreground text-center py-3">Visit requests are currently off.</p>
              )}
            </div>

            {/* Delete Account */}
            <div className="pt-2 border-t border-border/50">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl gap-1.5 w-full">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove your van profile and sign you out. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                      className="bg-destructive hover:bg-destructive/90 rounded-xl"
                    >
                      {deletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Mini Map Preview */}
            {myVan.is_active && myVan.latitude && myVan.longitude && (
              <div>
                <h3 className="font-heading font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Your Live Location
                </h3>
                <VanMap vans={[myVan]} className="h-[250px]" />
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}