import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { AvatarDataService } from '@/services/avatarDataService';
import { AvatarService } from '@/services/avatarService';
import { useToast } from '@/hooks/use-toast';

export function AvatarDatabaseManager() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [avatarCount, setAvatarCount] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAvatarCount = async () => {
    try {
      const avatars = await AvatarService.getAllActiveAvatars();
      setAvatarCount(avatars.length);
    } catch (error) {
      console.error('Failed to fetch avatar count:', error);
    }
  };

  const handlePopulateDatabase = async () => {
    setIsPopulating(true);
    try {
      await AvatarDataService.populateDatabase();
      await fetchAvatarCount();
      setLastUpdate(new Date().toLocaleString());
      toast({
        title: "Success",
        description: "Avatar database populated successfully from /admin/avatars",
      });
    } catch (error) {
      console.error('Failed to populate database:', error);
      toast({
        title: "Error",
        description: "Failed to populate avatar database",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleClearAndPopulate = async () => {
    setIsClearing(true);
    try {
      await AvatarDataService.clearAndPopulateDatabase();
      await fetchAvatarCount();
      setLastUpdate(new Date().toLocaleString());
      toast({
        title: "Success",
        description: "Avatar database cleared and repopulated from /admin/avatars",
      });
    } catch (error) {
      console.error('Failed to clear and populate database:', error);
      toast({
        title: "Error",
        description: "Failed to clear and repopulate avatar database",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Fetch count on component mount
  useState(() => {
    fetchAvatarCount();
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Avatar Database Manager
        </CardTitle>
        <CardDescription>
          Manage avatar data in the ions_avatar table using /admin/avatars as the source of truth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Section */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <p className="text-sm font-medium">Current Status</p>
            <div className="flex items-center gap-2">
              {avatarCount !== null ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{avatarCount} avatars in database</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Loading...</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-medium">Source of Truth</p>
            <Badge variant="outline">/admin/avatars (20 avatars)</Badge>
          </div>
        </div>

        {lastUpdate && (
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Button
              onClick={handlePopulateDatabase}
              disabled={isPopulating || isClearing}
              className="w-full"
            >
              {isPopulating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Populating Database...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Populate/Update Database
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Updates existing avatars and creates new ones from /admin/avatars
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleClearAndPopulate}
              disabled={isPopulating || isClearing}
              variant="outline"
              className="w-full"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing & Repopulating...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Clear & Repopulate
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Deactivates all current avatars and creates fresh ones from /admin/avatars
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h4 className="text-sm font-medium mb-2">About Avatar Management</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• The /admin/avatars page contains the source of truth for all avatar designs</li>
            <li>• This tool syncs those designs to the ions_avatar database table</li>
            <li>• All 20 space-themed avatars will be created/updated</li>
            <li>• Users can then select from these avatars in their profiles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}