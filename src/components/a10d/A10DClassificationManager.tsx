import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Users, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { A10DClassification } from '@/types/a10d';
import { toast } from '@/hooks/use-toast';

// Mock classifications data - will be replaced with real service
const mockClassifications = [
  { id: '1', name: 'Supporter', icon: 'Heart', color: 'red', description: 'Community supporters and enthusiasts' },
  { id: '2', name: 'Volunteer', icon: 'Users', color: 'blue', description: 'Active volunteers helping with events' },
  { id: '3', name: 'Moderator', icon: 'Shield', color: 'green', description: 'Content and community moderators' },
  { id: '4', name: 'Ambassador', icon: 'Star', color: 'yellow', description: 'Community ambassadors and leaders' },
];

const iconMap = {
  Heart,
  Users,
  Shield,
  Star
};

export const A10DClassificationManager: React.FC = () => {
  const [classifications, setClassifications] = useState(mockClassifications);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClassification, setNewClassification] = useState({
    name: '',
    description: '',
    icon: 'Heart',
    color: 'blue'
  });

  const handleCreateClassification = () => {
    if (!newClassification.name.trim()) {
      toast({
        title: "Error",
        description: "Classification name is required.",
        variant: "destructive"
      });
      return;
    }

    const classification = {
      id: Date.now().toString(),
      ...newClassification
    };

    setClassifications([...classifications, classification]);
    setNewClassification({ name: '', description: '', icon: 'Heart', color: 'blue' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Classification Created",
      description: `${newClassification.name} has been added to your classifications.`
    });
  };

  const handleDeleteClassification = (id: string) => {
    setClassifications(classifications.filter(c => c.id !== id));
    toast({
      title: "Classification Deleted",
      description: "The classification has been removed."
    });
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Heart;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>A10D Classifications</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Classification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Classification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newClassification.name}
                    onChange={(e) => setNewClassification({ ...newClassification, name: e.target.value })}
                    placeholder="e.g., Expert, Contributor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newClassification.description}
                    onChange={(e) => setNewClassification({ ...newClassification, description: e.target.value })}
                    placeholder="Brief description of this classification"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <select 
                      id="icon"
                      className="w-full p-2 border rounded-md"
                      value={newClassification.icon}
                      onChange={(e) => setNewClassification({ ...newClassification, icon: e.target.value })}
                    >
                      <option value="Heart">Heart</option>
                      <option value="Users">Users</option>
                      <option value="Shield">Shield</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <select 
                      id="color"
                      className="w-full p-2 border rounded-md"
                      value={newClassification.color}
                      onChange={(e) => setNewClassification({ ...newClassification, color: e.target.value })}
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClassification}>
                    Create Classification
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classifications.map((classification) => {
            const IconComponent = getIcon(classification.icon);
            return (
              <div key={classification.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${classification.color}-100`}>
                    <IconComponent className={`w-4 h-4 text-${classification.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium">{classification.name}</p>
                    <p className="text-sm text-muted-foreground">{classification.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteClassification(classification.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};