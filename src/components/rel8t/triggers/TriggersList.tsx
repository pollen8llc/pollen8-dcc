
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Clock, Phone, Mail, MessageCircle, Video, MapPin, PhoneCall, Bell, MoreVertical } from "lucide-react";
import { Trigger } from "@/services/rel8t/triggerService";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TriggersListProps {
  triggers: Trigger[];
  onEdit: (trigger: Trigger) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  renderIcon: (action: string) => React.ReactNode;
  isLoading: boolean;
}

export function TriggersList({
  triggers,
  onEdit,
  onDelete,
  onToggleActive,
  renderIcon,
  isLoading
}: TriggersListProps) {
  if (isLoading) {
    return <div className="py-8 text-center">Loading triggers...</div>;
  }
  
  if (triggers.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-2 text-lg font-semibold">No triggers found</h3>
        <p className="text-muted-foreground mt-1">
          You don't have any triggers configured yet.
        </p>
        <Button className="mt-4" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Trigger
        </Button>
      </div>
    );
  }
  
  const formatDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return null;
    try {
      return format(new Date(dateTimeStr), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return null;
    }
  };

  const formatCondition = (condition: string) => {
    try {
      // Remove escaped quotes and parse if it's a JSON string
      const cleaned = condition.replace(/\\"/g, '"').replace(/^"|"$/g, '');
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    } catch {
      return condition;
    }
  };

  const getRecurrenceText = (trigger: Trigger) => {
    if (!trigger.recurrence_pattern) return null;
    
    const { type } = trigger.recurrence_pattern;
    return `Repeats ${type}`;
  };

  const getChannelIcon = (channel?: string) => {
    switch (channel) {
      case "text": return <Phone className="h-4 w-4" />;
      case "call": return <PhoneCall className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "dm": return <MessageCircle className="h-4 w-4" />;
      case "meeting": return <Video className="h-4 w-4" />;
      case "irl": return <MapPin className="h-4 w-4" />;
      default: return null;
    }
  };

  const getChannelLabel = (channel?: string) => {
    switch (channel) {
      case "text": return "Text/SMS";
      case "call": return "Phone Call";
      case "email": return "Email";
      case "dm": return "Direct Message";
      case "meeting": return "Virtual Meeting";
      case "irl": return "In-Person Meeting";
      default: return null;
    }
  };

  const formatChannelDetails = (channel?: string, details?: any) => {
    if (!channel || !details) return null;

    switch (channel) {
      case "text":
      case "call":
        return details.phone ? `Phone: ${details.phone}` : null;
      case "email":
        return details.email ? `Email: ${details.email}` : null;
      case "dm":
        return details.platform && details.handle 
          ? `${details.platform.charAt(0).toUpperCase() + details.platform.slice(1)}: ${details.handle}`
          : null;
      case "meeting":
        return details.meetingPlatform 
          ? `${details.meetingPlatform.charAt(0).toUpperCase() + details.meetingPlatform.slice(1)}${details.link ? `: ${details.link}` : ''}`
          : null;
      case "irl":
        return details.address ? `Location: ${details.address}` : null;
      default:
        return null;
    }
  };
  
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      {triggers.map((trigger) => {
        const nextExecTime = trigger.next_execution_at ? format(new Date(trigger.next_execution_at), "h:mm a") : null;
        const channelDetails = formatChannelDetails(trigger.outreach_channel, trigger.channel_details);
        
        return (
          <Card 
            key={trigger.id}
            className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Status Indicator */}
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  trigger.is_active 
                    ? 'bg-primary shadow-[0_0_8px_rgba(0,234,218,0.4)] animate-pulse' 
                    : 'bg-muted-foreground/50'
                }`} />
                
                {/* Icon */}
                <div className="shrink-0 mt-0.5">
                  <Bell className={`h-4 w-4 ${trigger.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                    <h3 className={`font-medium text-sm leading-tight ${
                      trigger.is_active ? 'text-primary' : 'text-foreground'
                    } sm:truncate sm:flex-1`}>
                      {trigger.name}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {nextExecTime && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {nextExecTime}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:bg-primary/10 transition-opacity`}
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-morphism">
                          <DropdownMenuItem onClick={() => onToggleActive(trigger.id, trigger.is_active || false)}>
                            {trigger.is_active ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(trigger.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {trigger.description}
                  </p>
                  
                  {/* Metadata Row 1 - Condition & Action */}
                  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-1.5 text-xs`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-primary/80 capitalize">
                        {formatCondition(trigger.condition)}
                      </span>
                      <span className="text-muted-foreground/50">|</span>
                      <span className="text-muted-foreground/70 capitalize">
                        {trigger.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row 2 - Recurrence & ID */}
                  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-1.5 text-xs`}>
                    {trigger.recurrence_pattern && (
                      <>
                        <span className="text-primary/60">
                          {getRecurrenceText(trigger)}
                        </span>
                        {!isMobile && <span className="text-muted-foreground/50">|</span>}
                      </>
                    )}
                    <span className="text-muted-foreground/70 font-mono text-[10px]">
                      #{trigger.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Follow-up Channel */}
                  {trigger.outreach_channel && (
                    <div className="flex items-start gap-2 mt-2 p-2 rounded-md bg-primary/5 border border-primary/10">
                      <div className="text-primary mt-0.5">
                        {getChannelIcon(trigger.outreach_channel)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-foreground">
                          {getChannelLabel(trigger.outreach_channel)}
                        </div>
                        {channelDetails && (
                          <div className="text-xs text-muted-foreground mt-0.5 break-words">
                            {channelDetails}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
