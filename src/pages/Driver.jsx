import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, IceCream, Pencil, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import VanSetupForm from '../components/VanSetupForm';
import DriverLocationToggle from '../components/DriverLocationToggle';
import VanMap from '../components/VanMap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Driver() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
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

  if (loadingUser || (user && loadingVans)) {
    return (
      <div className="min-h-screen bg-background font-nunito">
        <Header />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background font-nunito">
        <Header />
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
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
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
                      <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Driver Name</Label>
                      <Input value={editForm.driver_name} onChange={e => setEditForm({...editForm, driver_name: e.target.value})} className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Specialties</Label>
                      <Textarea value={editForm.specialties} onChange={e => setEditForm({...editForm, specialties: e.target.value})} className="rounded-xl resize-none h-16" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Pricing</Label>
                      <Input placeholder="e.g. Cones from £1.50, Flake 99 £2.50" value={editForm.pricing} onChange={e => setEditForm({...editForm, pricing: e.target.value})} className="rounded-xl" />
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