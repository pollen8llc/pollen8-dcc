import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, MapPin, ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface LumaEvent {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  attendee_count: number;
  rsvp_count: number;
  status: string;
  cover_url?: string;
  url: string;
}

interface LumaIntegrationStepProps {
  onNext: (data: { importedContacts: any[] }) => void;
}

export const LumaIntegrationStep: React.FC<LumaIntegrationStepProps> = ({ onNext }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [events, setEvents] = useState<LumaEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [integration, setIntegration] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkIntegrationStatus();
  }, []);

  const checkIntegrationStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('luma-get-events');
      
      if (error) throw error;

      if (data.events) {
        setIsConnected(true);
        setEvents(data.events);
        setIntegration({
          luma_username: data.luma_username,
        });
      }
    } catch (error) {
      console.log('No Luma integration found:', error);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Generate OAuth URL
    const clientId = 'your-luma-client-id'; // This would come from env vars
    const redirectUri = `https://oltcuwvgdzszxshpfnre.supabase.co/functions/v1/luma-oauth-callback`;
    const scope = 'read:events read:guests';
    const state = Math.random().toString(36).substring(7);
    
    const oauthUrl = `https://api.lu.ma/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;

    // For now, show a placeholder message
    toast({
      title: "Luma Integration",
      description: "Luma OAuth integration is being set up. Contact support for access.",
    });
    
    setIsConnecting(false);
  };

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleImport = async () => {
    if (selectedEvents.length === 0) {
      toast({
        title: "No Events Selected",
        description: "Please select at least one event to import contacts from.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const { data, error } = await supabase.functions.invoke('luma-import-contacts', {
        body: { eventIds: selectedEvents },
      });

      if (error) throw error;

      toast({
        title: "Import Successful",
        description: `Imported ${data.summary.totalImported} contacts, found ${data.summary.totalDuplicates} duplicates.`,
      });

      // Call onNext with empty array for now - the contacts are imported directly to the database
      onNext({ importedContacts: [] });

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import contacts from Luma.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Connect to Luma</h3>
          <p className="text-muted-foreground mb-6">
            Import contacts from your Luma events by connecting your account.
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <h4 className="font-semibold">Connect Your Luma Account</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Securely access your events and import attendee contacts
                </p>
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
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect to Luma
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Note: Luma OAuth integration is currently in development.</p>
          <p>Contact support for early access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Import from Luma Events</h3>
          <p className="text-muted-foreground">
            Connected as {integration?.luma_username}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Connected
        </Badge>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No events found in your Luma account.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Select events to import contacts from:
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedEvents.length} of {events.length} selected
            </p>
          </div>

          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <Card key={event.id} className="cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => handleEventToggle(event.id)}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium truncate">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        
                        <Badge variant="outline" className="shrink-0">
                          {event.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.start_time)}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendee_count} attendees
                        </div>

                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleImport}
              disabled={selectedEvents.length === 0 || isImporting}
              className="flex-1"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                `Import Contacts from ${selectedEvents.length} Event${selectedEvents.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};