
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Clock, Phone, Mail, MessageCircle, Video, MapPin, PhoneCall } from "lucide-react";
import { Trigger } from "@/services/rel8t/triggerService";
import { format } from "date-fns";

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
  
  return (
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <div
          key={trigger.id}
          className="border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              {renderIcon(trigger.action)}
              <div className="ml-3">
                <div className="flex items-center">
                  <h4 className="font-medium">{trigger.name}</h4>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    trigger.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {trigger.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{trigger.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {formatCondition(trigger.condition)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {trigger.action}
                  </Badge>
                </div>
                
                {/* Display scheduled time if applicable */}
                {trigger.next_execution_at && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Next execution: {formatDateTime(trigger.next_execution_at)}</span>
                  </div>
                )}
                
                {/* Display recurrence info if applicable */}
                {trigger.recurrence_pattern && (
                  <div className="text-xs text-blue-500 mt-1">
                    {getRecurrenceText(trigger)}
                  </div>
                )}

                {/* Display follow-up channel if applicable */}
                {trigger.outreach_channel && (
                  <div className="flex items-start gap-2 mt-3 p-2 rounded-md bg-muted/50">
                    <div className="text-primary mt-0.5">
                      {getChannelIcon(trigger.outreach_channel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground">
                        {getChannelLabel(trigger.outreach_channel)}
                      </div>
                      {formatChannelDetails(trigger.outreach_channel, trigger.channel_details) && (
                        <div className="text-xs text-muted-foreground mt-0.5 break-words">
                          {formatChannelDetails(trigger.outreach_channel, trigger.channel_details)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onToggleActive(trigger.id, trigger.is_active || false)}
              >
                {trigger.is_active ? "Disable" : "Enable"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(trigger.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
