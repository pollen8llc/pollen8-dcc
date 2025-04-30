
import React, { useEffect, useState } from 'react';
import { useInvites } from '@/hooks/useInvites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Link2, ExternalLink, EyeOff, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { InviteData } from '@/services/inviteService';

const InviteList: React.FC = () => {
  const { invites, getInvitesByCreator, invalidateInvite, isLoading } = useInvites();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isInvalidating, setIsInvalidating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadInvites = async () => {
      try {
        await getInvitesByCreator();
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to load invites:", err);
        setError("Failed to load invites. Please try again later.");
      }
    };
    
    loadInvites();
    // Only depend on getInvitesByCreator to avoid unnecessary refetching
  }, [getInvitesByCreator]);

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description,
    });
  };

  const handleInvalidateInvite = async (invite: InviteData) => {
    if (!invite.id) return;
    
    setIsInvalidating(prev => ({ ...prev, [invite.id as string]: true }));
    
    try {
      await invalidateInvite(invite.id);
      toast({
        title: "Success",
        description: "Invite invalidated successfully"
      });
    } catch (err) {
      console.error("Failed to invalidate invite:", err);
      toast({
        title: "Error",
        description: "Failed to invalidate invite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInvalidating(prev => ({ ...prev, [invite.id as string]: false }));
    }
  };

  const getInviteUrl = (invite: InviteData): string => {
    return `${window.location.origin}/invite/${invite.code}`;
  };

  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Error Loading Invites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => getInvitesByCreator()} 
            className="mt-2"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invites || invites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Invites</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't created any invites yet. Use the "Create Invite" button to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <Card key={invite.id} className={!invite.is_active ? 'opacity-70' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Invite {invite.code}</CardTitle>
                {!invite.is_active && <Badge variant="outline">Inactive</Badge>}
                {invite.is_active && invite.expires_at && new Date(invite.expires_at) < new Date() && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Expired</Badge>
                )}
                {invite.is_active && invite.max_uses && invite.used_count >= invite.max_uses && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Reached Limit</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(invite.code, 'Invite code copied')}
                  title="Copy invite code"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(getInviteUrl(invite), 'Invite link copied')}
                  title="Copy invite link"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(getInviteUrl(invite), '_blank')}
                  title="Open invite link"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{invite.created_at ? format(new Date(invite.created_at), 'PP') : 'Unknown'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expires</p>
                <p>{invite.expires_at ? format(new Date(invite.expires_at), 'PP') : 'Never'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Usage</p>
                <p>
                  {invite.used_count} / {invite.max_uses ?? '∞'}
                </p>
              </div>
            </div>
            
            {invite.is_active && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInvalidateInvite(invite)}
                  disabled={isInvalidating[invite.id as string]}
                  className="text-red-500 hover:text-red-700"
                >
                  {isInvalidating[invite.id as string] ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" /> Invalidate
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InviteList;
