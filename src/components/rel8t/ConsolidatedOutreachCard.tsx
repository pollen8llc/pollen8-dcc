import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { OutreachTimelineAccordion } from "./OutreachTimelineAccordion";

interface Contact {
  id: string;
  name: string;
  email: string | null;
}

interface SyncLog {
  id: string;
  sync_type: string;
  changes: any;
  created_at: string;
}

interface ConsolidatedOutreachCardProps {
  outreachId: string;
  outreachTitle: string;
  contacts: Contact[];
  dueDate: string | null;
  status: string;
  syncLogs: SyncLog[];
  onDelete: () => void;
}

export function ConsolidatedOutreachCard({
  outreachId,
  outreachTitle,
  contacts,
  dueDate,
  status,
  syncLogs,
  onDelete,
}: ConsolidatedOutreachCardProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract contact responses from sync logs
  const contactResponses = syncLogs
    .filter(log => ['accepted', 'declined', 'tentative'].includes(log.sync_type))
    .map(log => ({
      email: log.changes?.responder?.email,
      name: log.changes?.responder?.name,
      status: log.sync_type,
      timestamp: log.created_at,
      note: log.changes?.note
    }))
    .filter(response => response.email); // Only include responses with email

  // Calculate response statistics
  const totalContactsWithEmail = contacts.filter(c => c.email).length;
  const acceptedCount = contactResponses.filter(r => r.status === 'accepted').length;
  const declinedCount = contactResponses.filter(r => r.status === 'declined').length;
  const tentativeCount = contactResponses.filter(r => r.status === 'tentative').length;
  const respondedCount = acceptedCount + declinedCount + tentativeCount;

  // Determine status color
  const getStatusColor = () => {
    if (declinedCount > 0) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
    if (acceptedCount === totalContactsWithEmail && totalContactsWithEmail > 0) return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
    if (respondedCount > 0) return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]';
    return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] animate-pulse';
  };

  const shortId = outreachId.substring(0, 8);

  return (
    <div className="group">
      <Card 
        className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Status Indicator */}
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getStatusColor()}`} />
            
            {/* Calendar Icon */}
            <div className="mt-0.5 shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                <h3 className="font-medium text-sm leading-tight text-foreground sm:truncate sm:flex-1">
                  {outreachTitle}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  {dueDate && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(dueDate), "h:mm a")}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:bg-destructive/10 hover:text-destructive transition-opacity`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Metadata */}
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row flex-wrap items-center'} gap-1.5 text-xs`}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-primary/80">Outreach</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="text-muted-foreground">
                    {contacts.length === 1 
                      ? contacts[0].name 
                      : `${contacts.length} contacts`}
                  </span>
                  {totalContactsWithEmail > 0 && (
                    <>
                      <span className="text-muted-foreground/50">|</span>
                      <span className="text-muted-foreground">
                        {respondedCount}/{totalContactsWithEmail} responded
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {!isMobile && <span className="text-muted-foreground/50">|</span>}
                  <span className="text-muted-foreground/70">ID: {shortId}</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="text-muted-foreground/70">Outreach: {shortId}</span>
                </div>
              </div>

              {/* Response Summary */}
              {contactResponses.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/20">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-medium">Responses:</span>
                  </div>
                  <div className="space-y-1">
                    {contactResponses.map((response, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {response.status === 'accepted' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        )}
                        {response.status === 'declined' && (
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                        {response.status === 'tentative' && (
                          <Clock className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        )}
                        <span className="text-muted-foreground truncate">
                          {response.name || response.email} - {response.status}
                        </span>
                        <span className="text-muted-foreground/60">
                          ({format(new Date(response.timestamp), "MMM d")})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expand Indicator */}
              <div className="flex items-center justify-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  <ChevronDown className={`w-3.5 h-3.5 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  {isExpanded ? 'Hide' : 'View'} Full Timeline
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Expanded Timeline */}
        {isExpanded && (
          <OutreachTimelineAccordion outreachId={outreachId} />
        )}
      </Card>
    </div>
  );
}
