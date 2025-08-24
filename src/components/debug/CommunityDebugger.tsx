import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const CommunityDebugger: React.FC = () => {
  const { currentUser } = useAuth();
  const [allCommunities, setAllCommunities] = useState<any[]>([]);
  const [userCommunities, setUserCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const debugCommunities = async () => {
    setLoading(true);
    try {
      // Get all communities (without RLS)
      const { data: allData, error: allError } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('Error fetching all communities:', allError);
      } else {
        console.log('All communities in database:', allData);
        setAllCommunities(allData || []);
      }

      // Get user's communities
      if (currentUser?.id) {
        const { data: userData, error: userError } = await supabase
          .from('communities')
          .select('*')
          .eq('owner_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (userError) {
          console.error('Error fetching user communities:', userError);
        } else {
          console.log('User communities:', userData);
          setUserCommunities(userData || []);
        }
      }
    } catch (error) {
      console.error('Debug error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debugCommunities();
  }, [currentUser?.id]);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Community Debugger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Current User</h3>
              <p>ID: {currentUser?.id || 'Not logged in'}</p>
              <p>Email: {currentUser?.email || 'N/A'}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">All Communities in Database ({allCommunities.length})</h3>
              <div className="space-y-2">
                {allCommunities.map((community) => (
                  <div key={community.id} className="p-2 border rounded text-sm">
                    <p><strong>ID:</strong> {community.id}</p>
                    <p><strong>Name:</strong> {community.name}</p>
                    <p><strong>Owner ID:</strong> {community.owner_id}</p>
                    <p><strong>Public:</strong> {community.is_public ? 'Yes' : 'No'}</p>
                    <p><strong>Created:</strong> {new Date(community.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">User's Communities ({userCommunities.length})</h3>
              <div className="space-y-2">
                {userCommunities.map((community) => (
                  <div key={community.id} className="p-2 border rounded text-sm bg-green-50">
                    <p><strong>ID:</strong> {community.id}</p>
                    <p><strong>Name:</strong> {community.name}</p>
                    <p><strong>Owner ID:</strong> {community.owner_id}</p>
                    <p><strong>Public:</strong> {community.is_public ? 'Yes' : 'No'}</p>
                    <p><strong>Created:</strong> {new Date(community.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={debugCommunities} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Debug Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
