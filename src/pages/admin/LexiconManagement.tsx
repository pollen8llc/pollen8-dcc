import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lexicon Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage the platform's lexicon of interests, tags, and categories
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Populate Common Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
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
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
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
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              About the Lexicon System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The lexicon system tracks and standardizes terms used across the platform, including interests, 
              skills, locations, tags, and categories.
            </p>
            <p>
              <strong>Automatic Tracking:</strong> New interests added to profiles are automatically tracked 
              in the lexicon system. This helps provide better suggestions and autocomplete functionality 
              throughout the platform.
            </p>
            <p>
              <strong>Usage Analytics:</strong> The system tracks which terms are most popular and who first 
              used them, helping identify trending interests and community patterns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LexiconManagement;
