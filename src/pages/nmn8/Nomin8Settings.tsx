import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit3, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Nomin8Navigation } from '@/components/nomin8/Nomin8Navigation';
import { useUser } from '@/contexts/UserContext';
import { settingsService, type GroupConfig } from '@/services/nmn8Service';

const Nomin8Settings: React.FC = () => {
  const { currentUser } = useUser();
  const [groups, setGroups] = useState<GroupConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [currentUser?.id]);

  const fetchGroups = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      const data = await settingsService.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
      toast({
        title: "Failed to load groups",
        description: "There was an error loading your groups.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a group name.",
        variant: "destructive",
      });
      return;
    }

    try {
      await settingsService.createSetting('group', newGroup.name, newGroup.description, newGroup.color);
      
      toast({
        title: "Group created",
        description: `${newGroup.name} has been created successfully.`,
      });

      setNewGroup({ name: '', description: '', color: '#3B82F6' });
      setShowAddForm(false);
      await fetchGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
      toast({
        title: "Failed to create group",
        description: "There was an error creating the group.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGroup = async (groupId: string, updates: Partial<GroupConfig>) => {
    try {
      await settingsService.updateSetting(groupId, updates);
      
      toast({
        title: "Group updated",
        description: "The group has been updated successfully.",
      });

      setEditingGroup(null);
      await fetchGroups();
    } catch (error) {
      console.error('Failed to update group:', error);
      toast({
        title: "Failed to update group",
        description: "There was an error updating the group.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      await settingsService.deleteSetting(groupId);
      
      toast({
        title: "Group deleted",
        description: "The group has been deleted successfully.",
      });

      await fetchGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast({
        title: "Failed to delete group",
        description: "There was an error deleting the group.",
        variant: "destructive",
      });
    }
  };

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Nomin8Navigation />
        
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Nomin8 Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your nomination groups and categories
              </p>
            </div>
            
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Group
            </Button>
          </div>

          {/* Add New Group Form */}
          {showAddForm && (
            <Card className="mb-6 border border-border/50 bg-card/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Create New Group
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Enter group name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewGroup({ ...newGroup, color })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newGroup.color === color ? 'border-foreground scale-110' : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleCreateGroup}>
                    Create Group
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Groups List */}
          <div className="space-y-4">
            {groups.map(group => (
              <Card key={group.id} className="border border-border/50 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: group.color }}
                      />
                      {editingGroup === group.id ? (
                        <div className="space-y-2 flex-1">
                          <Input
                            value={group.name}
                            onChange={(e) => setGroups(groups.map(g => 
                              g.id === group.id ? { ...g, name: e.target.value } : g
                            ))}
                          />
                          <Textarea
                            value={group.description || ''}
                            onChange={(e) => setGroups(groups.map(g => 
                              g.id === group.id ? { ...g, description: e.target.value } : g
                            ))}
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {editingGroup === group.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateGroup(group.id, {
                              name: group.name,
                              description: group.description
                            })}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingGroup(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingGroup(group.id)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          {groups.length === 0 && (
            <Card className="text-center p-8 border border-border/50 bg-card/40 backdrop-blur-md">
              <p className="text-muted-foreground mb-4">No groups created yet</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Group
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nomin8Settings;