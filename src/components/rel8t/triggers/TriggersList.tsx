
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Clock, Phone, Mail, MessageCircle, Video, MapPin, PhoneCall, MoreVertical } from "lucide-react";
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
    return <div className="py-8 text-center">Loading reminders...</div>;
  }
  
  if (triggers.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-2 text-lg font-semibold">No reminders found</h3>
        <p className="text-muted-foreground mt-1">
          You don't have any reminders set up yet.
        </p>
        <Button className="mt-4" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Reminder
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

  const getFrequencyLabel = (trigger: Trigger) => {
    if (!trigger.recurrence_pattern) return "One-time";
    
    const { type } = trigger.recurrence_pattern;
    switch (type) {
      case "hourly": return "Every hour";
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "biweekly": return "Every 2 weeks";
      case "monthly": return "Monthly";
      case "quarterly": return "Every 3 months";
      case "yearly": return "Yearly";
      default: return type ? type.charAt(0).toUpperCase() + type.slice(1) : "One-time";
    }
  };

  const formatNextDate = (dateTimeStr?: string) => {
    if (!dateTimeStr) return null;
    try {
      return format(new Date(dateTimeStr), "EEE, MMM d 'at' h:mm a");
    } catch (error) {
      return null;
    }
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
    <div className="space-y-3">
      {triggers.map((trigger) => {
        const nextDate = formatNextDate(trigger.next_execution_at);
        const frequency = getFrequencyLabel(trigger);
        const channelLabel = getChannelLabel(trigger.outreach_channel);
        const channelDetails = formatChannelDetails(trigger.outreach_channel, trigger.channel_details);
        
        return (
          <Card 
            key={trigger.id}
            className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Status Indicator */}
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                  trigger.is_active 
                    ? 'bg-primary shadow-[0_0_8px_rgba(0,234,218,0.4)] animate-pulse' 
                    : 'bg-muted-foreground/40'
                }`} />
                
                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Header with name and menu */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm leading-tight ${
                        trigger.is_active ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {trigger.name}
                      </h3>
                      {trigger.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {trigger.description}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:bg-primary/10 transition-opacity shrink-0`}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-morphism">
                        <DropdownMenuItem onClick={() => onToggleActive(trigger.id, trigger.is_active || false)}>
                          {trigger.is_active ? "Pause reminder" : "Resume reminder"}
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
                  
                  {/* Key Info: When & How Often */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {nextDate && (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-medium">{nextDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{frequency}</span>
                    </div>
                  </div>

                  {/* Follow-up Method */}
                  {trigger.outreach_channel && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Follow up via:</span>
                      <div className="flex items-center gap-1.5 text-foreground">
                        {getChannelIcon(trigger.outreach_channel)}
                        <span className="font-medium">{channelLabel}</span>
                      </div>
                      {channelDetails && (
                        <span className="text-muted-foreground truncate max-w-[150px]">
                          ({channelDetails})
                        </span>
                      )}
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
