import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LexiconManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPopulating, setIsPopulating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [populateResult, setPopulateResult] = useState<{ addedCount: number; skippedCount: number } | null>(null);
  const [syncResult, setSyncResult] = useState<{ count: number } | null>(null);

  const handlePopulateInterests = async () => {
    setIsPopulating(true);
    setPopulateResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('populate-lexicon', {
        body: { action: 'populate_interests' }
      });

      if (error) throw error;

      setPopulateResult(data);
      toast({
        title: "Interests Populated",
        description: `Added ${data.addedCount} new interests, ${data.skippedCount} already existed.`,
      });
    } catch (error) {
      console.error('Error populating interests:', error);
      toast({
        title: "Error",
        description: "Failed to populate interests. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleSyncExisting = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('populate-lexicon', {
        body: { action: 'sync_existing' }
      });

      if (error) throw error;

      setSyncResult(data);
      toast({
        title: "Data Synced",
        description: `Synced ${data.count} records from existing data.`,
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Error",
        description: "Failed to sync existing data. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          <AdminNavigation />

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin')}
            className="text-muted-foreground hover:text-foreground -mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Lexicon Management</h2>
              <p className="text-sm text-muted-foreground">Manage the platform's lexicon of interests, tags, and categories</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Populate Common Interests */}
            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-yellow-500" />
                  Populate Interests
                </CardTitle>
                <CardDescription>
                  Add 100 common interests to the lexicon for users to discover
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handlePopulateInterests}
                  disabled={isPopulating}
                  className="w-full"
                >
                  {isPopulating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Populating...
                    </>
                  ) : (
                    'Populate Common Interests'
                  )}
                </Button>

                {populateResult && (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Success!</p>
                        <p className="text-sm text-muted-foreground">
                          Added {populateResult.addedCount} new interests
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {populateResult.skippedCount} already existed
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>This will add interests across categories:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>Technology & Digital</li>
                    <li>Creative & Arts</li>
                    <li>Sports & Fitness</li>
                    <li>Business & Entrepreneurship</li>
                    <li>Science & Education</li>
                    <li>And more...</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Sync Existing Data */}
            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Sync Existing Data
                </CardTitle>
                <CardDescription>
                  Import interests, tags, and locations from existing profiles and communities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleSyncExisting}
                  disabled={isSyncing}
                  variant="outline"
                  className="w-full"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    'Sync Existing Data'
                  )}
                </Button>

                {syncResult && (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Success!</p>
                        <p className="text-sm text-muted-foreground">
                          Synced {syncResult.count} records
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>This will sync data from:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>Profile interests & skills</li>
                    <li>Profile locations</li>
                    <li>Community tags & types</li>
                    <li>Knowledge article tags</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="border-0 bg-card/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                About the Lexicon System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The lexicon system tracks and standardizes terms used across the platform, including interests, 
                skills, locations, tags, and categories.
              </p>
              <p>
                <strong className="text-foreground">Automatic Tracking:</strong> New interests added to profiles are automatically tracked 
                in the lexicon system. This helps provide better suggestions and autocomplete functionality 
                throughout the platform.
              </p>
              <p>
                <strong className="text-foreground">Usage Analytics:</strong> The system tracks which terms are most popular and who first 
                used them, helping identify trending interests and community patterns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LexiconManagement;
