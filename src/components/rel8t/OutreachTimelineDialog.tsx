import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface OutreachTimelineDialogProps {
  outreachId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SyncLogEntry {
  id: string;
  created_at: string;
  sync_type: string;
  sequence: number;
  email_from: string;
  email_subject: string;
  outreach_id: string;
  raw_ics: string;
  changes: any;
  user_id: string;
}

const getSyncIcon = (syncType: string) => {
  switch (syncType) {
    case 'create':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'reschedule':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'update':
      return <RefreshCw className="w-5 h-5 text-blue-500" />;
    case 'cancel':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Calendar className="w-5 h-5 text-muted-foreground" />;
  }
};

const getSyncBadgeVariant = (syncType: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (syncType) {
    case 'create':
      return 'default';
    case 'reschedule':
      return 'secondary';
    case 'cancel':
      return 'destructive';
    default:
      return 'outline';
  }
};

const formatChanges = (changes: any) => {
  if (!changes || typeof changes !== 'object') return null;

  const changeEntries = Object.entries(changes).filter(([key]) => key !== 'raw_ics');

  if (changeEntries.length === 0) return null;

  return (
    <div className="space-y-1 text-sm">
      {changeEntries.map(([key, value]: [string, any]) => {
        const displayKey = key.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        if (typeof value === 'object' && value !== null && 'old' in value && 'new' in value) {
          return (
            <div key={key} className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>
                <span className="font-medium">{displayKey}:</span>{' '}
                <span className="text-muted-foreground line-through">{String(value.old)}</span>
                {' → '}
                <span className="text-primary">{String(value.new)}</span>
              </span>
            </div>
          );
        }

        return (
          <div key={key} className="flex items-start gap-2">
            <span className="text-muted-foreground">•</span>
            <span>
              <span className="font-medium">{displayKey}:</span>{' '}
              <span className="text-primary">{String(value)}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export function OutreachTimelineDialog({ outreachId, isOpen, onClose }: OutreachTimelineDialogProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const { data: outreach } = useQuery({
    queryKey: ['outreach', outreachId],
    queryFn: async () => {
      if (!outreachId) return null;
      const { data, error } = await supabase
        .from('rms_outreach')
        .select('*')
        .eq('id', outreachId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!outreachId && isOpen,
  });

  const { data: syncLogs, isLoading } = useQuery({
    queryKey: ['outreach-sync-logs', outreachId],
    queryFn: async () => {
      if (!outreachId) return [];
      const { data, error } = await supabase
        .from('rms_outreach_sync_log')
        .select('*')
        .eq('outreach_id', outreachId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!outreachId && isOpen,
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-md border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Outreach Timeline
          </DialogTitle>
          {outreach && (
            <p className="text-sm text-muted-foreground">{outreach.title}</p>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !syncLogs || syncLogs.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="font-medium text-lg">No calendar updates yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Updates will appear here when you reschedule or modify this task in your calendar app (Google Calendar, Outlook, etc.)
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-border" />

              {/* Original creation entry */}
              {outreach && (
                <div className="relative flex gap-4 pb-6">
                  <div className="relative z-10 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Created</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(outreach.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Outreach task created in REL8 system
                    </p>
                  </div>
                </div>
              )}

              {/* Sync log entries */}
              {syncLogs.map((log, index) => {
                const isExpanded = expandedItems.has(log.id);
                const hasChanges = log.changes && Object.keys(log.changes).filter(k => k !== 'raw_ics').length > 0;

                return (
                  <div key={log.id} className="relative flex gap-4 pb-6">
                    <div className="relative z-10 mt-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        log.sync_type === 'create' ? 'bg-green-500/20' :
                        log.sync_type === 'reschedule' ? 'bg-yellow-500/20' :
                        log.sync_type === 'update' ? 'bg-blue-500/20' :
                        log.sync_type === 'cancel' ? 'bg-red-500/20' :
                        'bg-muted'
                      }`}>
                        {getSyncIcon(log.sync_type)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSyncBadgeVariant(log.sync_type)}>
                          {log.sync_type.charAt(0).toUpperCase() + log.sync_type.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>

                      {log.email_from && (
                        <p className="text-xs text-muted-foreground">
                          From: {log.email_from}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Sequence: {log.sequence}
                      </p>


                      {hasChanges && (
                        <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(log.id)}>
                          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            {isExpanded ? 'Hide' : 'Show'} changes
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-2">
                            <div className="bg-muted/30 backdrop-blur-sm rounded-md p-3 border border-border/50">
                              {formatChanges(log.changes)}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
