
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Clock } from "lucide-react";
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

  const getRecurrenceText = (trigger: Trigger) => {
    if (!trigger.recurrence_pattern) return null;
    
    const { type } = trigger.recurrence_pattern;
    return `Repeats ${type}`;
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
                  <Badge className="text-xs bg-background/50 backdrop-blur-sm border-primary/20">
                    {trigger.condition}
                  </Badge>
                  <Badge className="text-xs bg-background/50 backdrop-blur-sm border-primary/20">
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
