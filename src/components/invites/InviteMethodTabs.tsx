import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvites } from '@/hooks/useInvites';
import { useToast } from '@/hooks/use-toast';
import { 
  Link, 
  Calendar
} from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InviteMethodTabsProps {
  onInviteCreated: () => void;
}

export const InviteMethodTabs: React.FC<InviteMethodTabsProps> = ({ onInviteCreated }) => {
  const { createInvite, isLoading } = useInvites();
  const { toast } = useToast();
  
  // Form state
  const [linkForm, setLinkForm] = useState({
    maxUses: '',
    expirationDate: undefined as Date | undefined,
    description: ''
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`
    });
  };

  const handleCreateLinkInvite = async () => {
    try {
      const invite = await createInvite(
        linkForm.maxUses || undefined,
        linkForm.expirationDate?.toISOString()
      );
      
      if (invite) {
        const inviteUrl = `${window.location.origin}/i/${invite.link_id}`;
        copyToClipboard(inviteUrl, "Invite link");
        onInviteCreated();
        setLinkForm({ maxUses: '', expirationDate: undefined, description: '' });
      }
    } catch (error) {
      console.error("Error creating invite:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invite link",
        variant: "destructive"
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          Generate Invite Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link-max-uses">Max Uses (Optional)</Label>
              <Input
                id="link-max-uses"
                type="number"
                min="1"
                placeholder="Unlimited"
                value={linkForm.maxUses}
                onChange={(e) => setLinkForm({ ...linkForm, maxUses: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !linkForm.expirationDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {linkForm.expirationDate ? format(linkForm.expirationDate, "PPP") : "No expiration"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={linkForm.expirationDate}
                    onSelect={(date) => setLinkForm({ ...linkForm, expirationDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-description">Description (Optional)</Label>
            <Textarea
              id="link-description"
              placeholder="Add a note about this invite..."
              value={linkForm.description}
              onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
            />
          </div>
          <Button 
            onClick={handleCreateLinkInvite}
            disabled={isLoading}
            className="w-full"
          >
            <Link className="mr-2 h-4 w-4" />
            {isLoading ? "Creating..." : "Generate Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};