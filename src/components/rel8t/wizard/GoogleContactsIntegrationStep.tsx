import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, CheckCircle2, Users, RefreshCw } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface GoogleContactsIntegrationStepProps {
  onComplete?: () => void;
}

interface ImportSummary {
  total_fetched: number;
  imported: number;
  duplicates: number;
  errors: number;
}

export const GoogleContactsIntegrationStep: React.FC<GoogleContactsIntegrationStepProps> = ({ 
  onComplete 
}) => {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    checkIntegrationStatus();
  }, [currentUser]);

  const checkIntegrationStatus = async () => {
    if (!currentUser) return;
    
    setIsCheckingStatus(true);
    try {
      const { data, error } = await supabase
        .from('google_integrations')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_active', true)
        .maybeSingle();

      if (data && !error) {
        setIsConnected(true);
        setConnectedEmail(data.google_email);
      }
    } catch (err) {
      console.error('Error checking Google integration status:', err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to connect Google Contacts');
      }

      // Get OAuth URL from edge function
      const redirectUri = `${window.location.origin}/rel8/connect/import`;
      const state = btoa(JSON.stringify({ 
        userId: currentUser?.id,
        redirectUri 
      }));
      
      const { data: urlData, error: urlError } = await supabase.functions.invoke('google-auth-url', {
        body: { redirectUri, state }
      });

      if (urlError || !urlData?.authUrl) {
        throw new Error(urlError?.message || urlData?.error || 'Failed to get OAuth URL');
      }

      // Open OAuth popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        urlData.authUrl,
        'Google OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'google-oauth-callback') {
          window.removeEventListener('message', handleMessage);
          popup?.close();
          
          const { code, error } = event.data;
          
          if (error) {
            throw new Error(error);
          }

          if (code) {
            // Exchange code for token via edge function
            const { data, error: callbackError } = await supabase.functions.invoke('google-oauth-callback', {
              body: { 
                code, 
                redirectUri 
              },
            });

            if (callbackError) {
              throw new Error(callbackError.message || 'Failed to complete OAuth flow');
            }

            if (data?.success) {
              setIsConnected(true);
              setConnectedEmail(data.integration.google_email);
              toast({
                title: 'Connected to Google',
                description: `Successfully connected as ${data.integration.google_email}`,
              });
            }
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup was blocked
      if (!popup) {
        window.removeEventListener('message', handleMessage);
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Cleanup listener if popup is closed without completing
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
        }
      }, 500);

    } catch (err: any) {
      console.error('Error connecting to Google:', err);
      toast({
        title: 'Connection Failed',
        description: err.message || 'Failed to connect to Google',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('google-import-contacts', {});

      if (error) {
        throw new Error(error.message || 'Failed to import contacts');
      }

      if (data?.success) {
        setImportSummary(data.summary);
        toast({
          title: 'Import Complete',
          description: `Imported ${data.summary.imported} contacts`,
        });
        onComplete?.();
      }
    } catch (err: any) {
      console.error('Error importing contacts:', err);
      toast({
        title: 'Import Failed',
        description: err.message || 'Failed to import contacts',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from('google_integrations')
        .update({ is_active: false })
        .eq('user_id', currentUser?.id);

      if (error) throw error;

      setIsConnected(false);
      setConnectedEmail(null);
      setImportSummary(null);
      
      toast({
        title: 'Disconnected',
        description: 'Google account has been disconnected',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect Google account',
        variant: 'destructive',
      });
    }
  };

  if (isCheckingStatus) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Connect Google Contacts
          </CardTitle>
          <CardDescription>
            Import your Gmail contacts to quickly build your network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>This will allow you to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Import contacts from your Google account</li>
              <li>Sync names, emails, phone numbers, and organizations</li>
              <li>Automatically skip duplicate contacts</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Connect with Google
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We only request read-only access to your contacts. We never access your emails or other data.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Connected state
  return (
    <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Google Connected
        </CardTitle>
        <CardDescription>
          Connected as {connectedEmail}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Import Summary */}
        {importSummary && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Import Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Total fetched:</span>
                <span className="ml-2 font-medium">{importSummary.total_fetched}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Imported:</span>
                <span className="ml-2 font-medium text-green-600">{importSummary.imported}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duplicates:</span>
                <span className="ml-2 font-medium text-yellow-600">{importSummary.duplicates}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Errors:</span>
                <span className="ml-2 font-medium text-red-600">{importSummary.errors}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleImport} 
            disabled={isImporting}
            className="w-full"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Contacts...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {importSummary ? 'Import Again' : 'Import Contacts'}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="w-full"
          >
            Disconnect Google Account
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};
