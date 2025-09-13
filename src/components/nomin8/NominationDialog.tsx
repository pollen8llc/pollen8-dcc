import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus } from 'lucide-react';
import { nmn8Service, settingsService, type GroupConfig } from '@/services/nmn8Service';
import { toast } from '@/hooks/use-toast';

interface NominationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  organizerId: string;
}

export const NominationDialog: React.FC<NominationDialogProps> = ({ 
  open, 
  onOpenChange, 
  contactId, 
  contactName,
  organizerId 
}) => {
  const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<GroupConfig[]>([]);

  // Load existing nomination and groups when dialog opens
  useEffect(() => {
    if (open && contactId && organizerId) {
      loadExistingNomination();
      settingsService.getGroups()
        .then(setGroups)
        .catch((err) => console.error('Failed to load groups:', err));
    }
  }, [open, contactId, organizerId]);

  const loadExistingNomination = async () => {
    setIsLoading(true);
    try {
      const existingNomination = await nmn8Service.getNominationForContact(organizerId, contactId);
      if (existingNomination) {
        setSelectedGroups(existingNomination.groups);
        setNotes(existingNomination.notes || '');
      } else {
        // Reset for new nomination
        setSelectedGroups({});
        setNotes('');
      }
    } catch (error) {
      console.error('Failed to load existing nomination:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupToggle = (groupId: string, checked: boolean) => {
    setSelectedGroups(prev => ({
      ...prev,
      [groupId]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!Object.values(selectedGroups).some(Boolean)) {
      toast({
        title: "No Groups Selected",
        description: "Please select at least one group for the nomination.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await nmn8Service.nominateContact(organizerId, contactId, selectedGroups, notes);
      onOpenChange(false);
      
      // Reset form
      setSelectedGroups({});
      setNotes('');
    } catch (error) {
      console.error('Failed to nominate contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedGroups({});
    setNotes('');
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading nomination data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Nominate {contactName}
          </DialogTitle>
          <DialogDescription>
            Select the groups you'd like to nominate this contact for. They can belong to multiple groups.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Groups</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groups.map((group: GroupConfig) => (
                <div key={group.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={group.id}
                    checked={selectedGroups[group.id] || false}
                    onCheckedChange={(checked) => handleGroupToggle(group.id, checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <label htmlFor={group.id} className="text-sm font-medium cursor-pointer">
                        {group.name}
                      </label>
                      <Badge variant="secondary" className="text-xs border-0" style={{ backgroundColor: group.color }}>
                        {group.name.toLowerCase()}
                      </Badge>
                    </div>
                    {group.description && (
                      <p className="text-xs text-muted-foreground">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Groups Summary */}
          {Object.entries(selectedGroups).some(([_, selected]) => selected) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Groups:</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedGroups)
                  .filter(([_, selected]) => selected)
                  .map(([groupId]) => {
                    const group = groups.find(g => g.id === groupId);
                    return group ? (
                      <Badge key={groupId} className="border-0" variant="secondary" style={{ backgroundColor: group.color }}>
                        {group.name}
                      </Badge>
                    ) : null;
                  })
                }
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this nomination..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !Object.values(selectedGroups).some(Boolean)}
              className="flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Nominating...' : 'Nominate Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};