import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvites } from '@/hooks/useInvites';
import { useToast } from '@/hooks/use-toast';
import { 
  Link, 
  Mail, 
  Phone, 
  Code, 
  Users, 
  Calendar,
  Hash,
  Copy,
  Send
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
  
  // Form states
  const [linkForm, setLinkForm] = useState({
    maxUses: '',
    expirationDate: undefined as Date | undefined,
    description: ''
  });
  
  const [directForm, setDirectForm] = useState({
    emails: '',
    phones: '',
    message: ''
  });

  const [codeForm, setCodeForm] = useState({
    customCode: '',
    maxUses: '',
    expirationDate: undefined as Date | undefined
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
        undefined,
        linkForm.maxUses || undefined,
        linkForm.expirationDate?.toISOString()
      );
      
      if (invite) {
        const inviteUrl = `${window.location.origin}/invite/${invite.link_id}`;
        copyToClipboard(inviteUrl, "Invite link");
        onInviteCreated();
        setLinkForm({ maxUses: '', expirationDate: undefined, description: '' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invite link",
        variant: "destructive"
      });
    }
  };

  const handleSendDirectInvites = async () => {
    // This would integrate with email/SMS service
    toast({
      title: "Coming Soon",
      description: "Direct email and SMS invites will be available soon",
    });
  };

  const handleCreateCodeInvite = async () => {
    try {
      const invite = await createInvite(
        undefined,
        codeForm.maxUses || undefined,
        codeForm.expirationDate?.toISOString()
      );
      
      if (invite) {
        copyToClipboard(invite.code, "Invite code");
        onInviteCreated();
        setCodeForm({ customCode: '', maxUses: '', expirationDate: undefined });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invite code",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
      <CardHeader className="px-6 py-6">
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <Send className="h-5 w-5 text-primary" />
          Create New Invite
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Tabs defaultValue="link" className="space-y-6">
          <TabsList className="glass-morphism border-0 bg-card/20 backdrop-blur-md w-full justify-start overflow-x-auto">
            <TabsTrigger 
              value="link" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              Link
            </TabsTrigger>
            <TabsTrigger 
              value="direct"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Direct
            </TabsTrigger>
            <TabsTrigger 
              value="code"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex items-center gap-2"
            >
              <Hash className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger 
              value="contacts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          {/* Link Invite */}
          <TabsContent value="link" className="space-y-4">
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
                    className="glass-morphism border-white/10 bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiration Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal glass-morphism border-white/10 bg-white/5",
                          !linkForm.expirationDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {linkForm.expirationDate ? format(linkForm.expirationDate, "PPP") : "No expiration"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 glass-morphism border-white/10 bg-card/95 backdrop-blur-md">
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
                  className="glass-morphism border-white/10 bg-white/5"
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
          </TabsContent>

          {/* Direct Invite */}
          <TabsContent value="direct" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Email Addresses</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses, separated by commas..."
                  value={directForm.emails}
                  onChange={(e) => setDirectForm({ ...directForm, emails: e.target.value })}
                  className="glass-morphism border-white/10 bg-white/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phones">Phone Numbers</Label>
                <Textarea
                  id="phones"
                  placeholder="Enter phone numbers, separated by commas..."
                  value={directForm.phones}
                  onChange={(e) => setDirectForm({ ...directForm, phones: e.target.value })}
                  className="glass-morphism border-white/10 bg-white/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to your invites..."
                  value={directForm.message}
                  onChange={(e) => setDirectForm({ ...directForm, message: e.target.value })}
                  className="glass-morphism border-white/10 bg-white/5"
                />
              </div>
              <Button 
                onClick={handleSendDirectInvites}
                disabled={isLoading || (!directForm.emails && !directForm.phones)}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Invites
              </Button>
            </div>
          </TabsContent>

          {/* Code Invite */}
          <TabsContent value="code" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code-max-uses">Max Uses (Optional)</Label>
                  <Input
                    id="code-max-uses"
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={codeForm.maxUses}
                    onChange={(e) => setCodeForm({ ...codeForm, maxUses: e.target.value })}
                    className="glass-morphism border-white/10 bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiration Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal glass-morphism border-white/10 bg-white/5",
                          !codeForm.expirationDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {codeForm.expirationDate ? format(codeForm.expirationDate, "PPP") : "No expiration"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 glass-morphism border-white/10 bg-card/95 backdrop-blur-md">
                      <CalendarComponent
                        mode="single"
                        selected={codeForm.expirationDate}
                        onSelect={(date) => setCodeForm({ ...codeForm, expirationDate: date })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button 
                onClick={handleCreateCodeInvite}
                disabled={isLoading}
                className="w-full"
              >
                <Code className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Generate Code"}
              </Button>
            </div>
          </TabsContent>

          {/* Contacts Invite */}
          <TabsContent value="contacts" className="space-y-4">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Invite from Contacts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select contacts from your REL8 database to send invites
              </p>
              <Button variant="outline" className="glass-morphism border-white/10 bg-white/5">
                <Users className="mr-2 h-4 w-4" />
                Browse Contacts
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};