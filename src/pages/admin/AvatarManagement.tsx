import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { AvatarService, IonsAvatar } from '@/services/avatarService';
import { AvatarDataService } from '@/services/avatarDataService';
import { AvatarDatabaseManager } from '@/components/admin/AvatarDatabaseManager';
import { Loader2, Plus, Edit, Trash2, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AvatarManagement: React.FC = () => {
  const [avatars, setAvatars] = useState<IonsAvatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopulating, setIsPopulating] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<IonsAvatar | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    svg_definition: '',
    network_score_threshold: 0,
    rarity_tier: 'common',
    animation_type: 'pulse',
    color_scheme: {},
    is_active: true
  });

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    setIsLoading(true);
    try {
      const allAvatars = await AvatarService.getAllActiveAvatars();
      setAvatars(allAvatars);
    } catch (error) {
      console.error('Failed to load avatars:', error);
      toast({
        title: "Error",
        description: "Failed to load avatars",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulateDatabase = async () => {
    setIsPopulating(true);
    try {
      await AvatarDataService.populateDatabase();
      await loadAvatars();
      toast({
        title: "Success",
        description: "Avatar database populated successfully"
      });
    } catch (error) {
      console.error('Failed to populate database:', error);
      toast({
        title: "Error",
        description: "Failed to populate avatar database",
        variant: "destructive"
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      if (editingAvatar) {
        await AvatarService.updateAvatar(editingAvatar.id, formData);
        toast({
          title: "Success",
          description: "Avatar updated successfully"
        });
      } else {
        await AvatarService.createAvatar(formData);
        toast({
          title: "Success", 
          description: "Avatar created successfully"
        });
      }
      
      await loadAvatars();
      setEditingAvatar(null);
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        svg_definition: '',
        network_score_threshold: 0,
        rarity_tier: 'common',
        animation_type: 'pulse',
        color_scheme: {},
        is_active: true
      });
    } catch (error) {
      console.error('Failed to save avatar:', error);
      toast({
        title: "Error",
        description: "Failed to save avatar",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAvatar = async (id: string) => {
    try {
      await AvatarService.deleteAvatar(id);
      await loadAvatars();
      toast({
        title: "Success",
        description: "Avatar deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      toast({
        title: "Error",
        description: "Failed to delete avatar",
        variant: "destructive"
      });
    }
  };

  const startEdit = (avatar: IonsAvatar) => {
    setEditingAvatar(avatar);
    setFormData({
      name: avatar.name,
      svg_definition: avatar.svg_definition,
      network_score_threshold: avatar.network_score_threshold,
      rarity_tier: avatar.rarity_tier,
      animation_type: avatar.animation_type,
      color_scheme: avatar.color_scheme,
      is_active: avatar.is_active
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        <div className="glass-morphism glass-morphism-hover rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
                Avatar Management
              </h1>
              <p className="text-muted-foreground">
                Manage the dynamic avatar system - sync from /admin/avatars and configure individual avatars
              </p>
            </div>
          </div>
        </div>

        {/* Database Management Section */}
        <div className="mb-8">
          <AvatarDatabaseManager />
        </div>

        <div className="glass-morphism glass-morphism-hover rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
                Individual Avatar Management
              </h2>
              <p className="text-muted-foreground">
                Create, edit, and manage individual avatars
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Avatar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAvatar ? 'Edit Avatar' : 'Create New Avatar'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Avatar name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="svg">SVG Definition</Label>
                      <Textarea
                        id="svg"
                        value={formData.svg_definition}
                        onChange={(e) => setFormData({...formData, svg_definition: e.target.value})}
                        placeholder="<svg>...</svg>"
                        rows={10}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="threshold">Network Score Threshold</Label>
                        <Input
                          id="threshold"
                          type="number"
                          value={formData.network_score_threshold}
                          onChange={(e) => setFormData({...formData, network_score_threshold: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="animation">Animation Type</Label>
                        <Input
                          id="animation"
                          value={formData.animation_type}
                          onChange={(e) => setFormData({...formData, animation_type: e.target.value})}
                          placeholder="pulse, rotate, swirl..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="rarity">Rarity Tier</Label>
                      <Select value={formData.rarity_tier} onValueChange={(value) => setFormData({...formData, rarity_tier: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="epic">Epic</SelectItem>
                          <SelectItem value="legendary">Legendary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {
                        setEditingAvatar(null);
                        setIsCreateDialogOpen(false);
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveAvatar}>
                        {editingAvatar ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {avatars.map((avatar) => (
              <Card key={avatar.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{avatar.name}</CardTitle>
                    <Badge className={`${getRarityColor(avatar.rarity_tier)} text-white`}>
                      {avatar.rarity_tier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-16 h-16 rounded-full border border-border overflow-hidden"
                      dangerouslySetInnerHTML={{ 
                        __html: AvatarService.renderAvatarSvg(avatar, `preview-${avatar.id}`)
                      }}
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Threshold: {avatar.network_score_threshold}</div>
                      <div>Type: {avatar.animation_type}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        startEdit(avatar);
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAvatar(avatar.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarManagement;