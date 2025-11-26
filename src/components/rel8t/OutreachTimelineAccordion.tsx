import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, CheckCircle, Clock, XCircle, RefreshCw, Mail } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface OutreachTimelineAccordionProps {
  outreachId: string;
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

interface EmailNotification {
  id: string;
  created_at: string;
  subject: string;
  status: string;
  sent_at: string | null;
  metadata: any;
}

const getSyncIcon = (syncType: string) => {
  switch (syncType) {
    case 'create':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'reschedule':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'update':
      return <RefreshCw className="w-4 h-4 text-blue-500" />;
    case 'cancel':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Calendar className="w-4 h-4 text-muted-foreground" />;
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
    <div className="space-y-1 text-xs">
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

export function OutreachTimelineAccordion({ outreachId }: OutreachTimelineAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const { data: outreach } = useQuery({
    queryKey: ['outreach', outreachId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rms_outreach')
        .select('*')
        .eq('id', outreachId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!outreachId,
  });

  const { data: syncLogs, isLoading: syncLogsLoading } = useQuery({
    queryKey: ['outreach-sync-logs', outreachId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rms_outreach_sync_log')
        .select('*')
        .eq('outreach_id', outreachId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!outreachId,
  });

  const { data: emailNotifications, isLoading: emailsLoading } = useQuery({
    queryKey: ['outreach-emails', outreachId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rms_email_notifications')
        .select('*')
        .eq('metadata->>outreachId', outreachId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as EmailNotification[];
    },
    enabled: !!outreachId,
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

  // Combine sync logs and email notifications into a unified timeline
  const timelineItems = [
    ...(syncLogs || []).map(log => ({ ...log, _type: 'sync' as const, _date: new Date(log.created_at) })),
    ...(emailNotifications || []).map(email => ({ ...email, _type: 'email' as const, _date: new Date(email.created_at) }))
  ].sort((a, b) => a._date.getTime() - b._date.getTime());

  const isLoading = syncLogsLoading || emailsLoading;

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 py-4 border-t border-border/20 bg-card/20 backdrop-blur-sm">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!timelineItems || timelineItems.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-4 border-t border-border/20 bg-card/20 backdrop-blur-sm">
        <div className="text-center py-4 space-y-2">
          <Calendar className="w-8 h-8 mx-auto text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">
            No calendar updates or emails yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4 border-t border-border/20 bg-card/20 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
      <h4 className="text-sm font-semibold mb-3 text-foreground">Timeline</h4>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[9px] top-4 bottom-4 w-0.5 bg-border/50" />

        <div className="space-y-4">
          {/* Original creation entry */}
          {outreach && (
            <div className="relative flex gap-3 items-start">
              <div className="relative z-10 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                </div>
              </div>
              <div className="flex-1 space-y-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="default" className="text-xs">Created</Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(outreach.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Outreach task created in REL8 system
                </p>
              </div>
            </div>
          )}

          {/* Timeline items (sync logs and emails) */}
          {timelineItems.map((item) => {
            if (item._type === 'sync') {
              const log = item as SyncLogEntry & { _type: 'sync', _date: Date };
              const isExpanded = expandedItems.has(log.id);
              const hasChanges = log.changes && Object.keys(log.changes).filter(k => k !== 'raw_ics').length > 0;

              return (
                <div key={log.id} className="relative flex gap-3 items-start">
                  <div className="relative z-10 mt-0.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      log.sync_type === 'create' ? 'bg-green-500/20' :
                      log.sync_type === 'reschedule' ? 'bg-yellow-500/20' :
                      log.sync_type === 'update' ? 'bg-blue-500/20' :
                      log.sync_type === 'cancel' ? 'bg-red-500/20' :
                      'bg-muted'
                    }`}>
                      {getSyncIcon(log.sync_type)}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getSyncBadgeVariant(log.sync_type)} className="text-xs">
                        {log.sync_type.charAt(0).toUpperCase() + log.sync_type.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
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
                        <CollapsibleTrigger className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-1">
                          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          {isExpanded ? 'Hide' : 'Show'} changes
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                          <div className="bg-muted/30 backdrop-blur-sm rounded-md p-2 border border-border/50">
                            {formatChanges(log.changes)}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </div>
              );
            }

            if (item._type === 'email') {
              const email = item as EmailNotification & { _type: 'email', _date: Date };

              return (
                <div key={email.id} className="relative flex gap-3 items-start">
                  <div className="relative z-10 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Mail className="w-3 h-3 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs bg-blue-900/30 text-blue-400 border-blue-400/30">
                        Email
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(email.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {email.subject}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant={email.status === 'sent' ? 'default' : email.status === 'failed' ? 'destructive' : 'secondary'} className="text-xs">
                        {email.status}
                      </Badge>
                      {email.sent_at && (
                        <span className="text-xs text-muted-foreground">
                          Sent: {format(new Date(email.sent_at), "h:mm a")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
