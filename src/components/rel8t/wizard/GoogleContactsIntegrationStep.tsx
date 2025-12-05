import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, CheckCircle2, AlertCircle, Users, RefreshCw } from 'lucide-react';
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

const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
const OAUTH_REDIRECT_URI = 'https://oltcuwvgdzszxshpfnre.supabase.co/functions/v1/google-oauth-callback';

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
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchClientId();
    checkIntegrationStatus();
    checkUrlParams();
  }, [currentUser]);

  const fetchClientId = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-google-client-id', {});
      if (data?.clientId) {
        setGoogleClientId(data.clientId);
      }
    } catch (err) {
      console.error('Error fetching Google Client ID:', err);
    }
  };

  const checkUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleConnected = urlParams.get('google_connected');
    const googleError = urlParams.get('google_error');

    if (googleConnected === 'true') {
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      setIsConnected(true);
      checkIntegrationStatus();
      toast({
        title: 'Connected to Google',
        description: 'Successfully connected your Google account',
      });
    } else if (googleError) {
      window.history.replaceState({}, '', window.location.pathname);
      toast({
        title: 'Connection Failed',
        description: `Failed to connect: ${googleError}`,
        variant: 'destructive',
      });
    }
  };

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
    if (!googleClientId) {
      toast({
        title: 'Configuration Error',
        description: 'Google OAuth is not configured. Please contact support.',
        variant: 'destructive',
      });
      return;
    }

    if (!currentUser?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect Google Contacts',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Build state with user info and return URL
      const state = btoa(JSON.stringify({ 
        userId: currentUser.id,
        returnUrl: window.location.href.split('?')[0] // Current page without query params
      }));
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', googleClientId);
      authUrl.searchParams.set('redirect_uri', OAUTH_REDIRECT_URI);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', GOOGLE_SCOPES);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', state);

      // Open OAuth popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        authUrl.toString(),
        'Google OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Check if popup was blocked
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Poll for popup closure or redirect
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check integration status after popup closes
          setTimeout(() => checkIntegrationStatus(), 500);
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
            disabled={isConnecting || !googleClientId}
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

          {!googleClientId && (
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-600">Loading Configuration...</p>
                  <p className="text-muted-foreground">
                    Please wait while we load Google OAuth settings.
                  </p>
                </div>
              </div>
            </div>
          )}
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
