import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AvatarUpdateTool = () => {
  const [userId, setUserId] = useState('6be3fb14-9e02-4089-8fb5-ebbce0a2cf0e');
  const [avatarId, setAvatarId] = useState('a038a996-f284-4090-9cfa-f6c8bb83a1b9');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUserAvatar = async () => {
    setIsLoading(true);
    try {
      // Use service role or admin function to update avatar
      const { data, error } = await supabase.rpc('update_user_avatar_admin', {
        target_user_id: userId,
        new_avatar_id: avatarId
      });

      if (error) {
        console.error('Avatar update error:', error);
        // Fallback: try direct update as current user
        const { error: directError } = await supabase
          .from('profiles')
          .update({ 
            selected_avatar_id: avatarId,
            unlocked_avatars: [avatarId]
          })
          .eq('user_id', userId);

        if (directError) {
          throw directError;
        }
      }

      toast({
        title: "Avatar Updated",
        description: `Successfully updated user's avatar to Pulsar`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update avatar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Avatar Update Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">User ID</label>
          <Input 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Avatar ID</label>
          <Input 
            value={avatarId} 
            onChange={(e) => setAvatarId(e.target.value)}
            placeholder="Avatar ID"
          />
        </div>
        <Button 
          onClick={updateUserAvatar}
          disabled={isLoading || !userId || !avatarId}
          className="w-full"
        >
          {isLoading ? 'Updating...' : 'Update Avatar'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvatarUpdateTool;