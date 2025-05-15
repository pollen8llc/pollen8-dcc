
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { Trigger } from "@/services/rel8t/triggerService";

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
                <div className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium">Condition:</span> {trigger.condition}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Action:</span> {trigger.action}
                </div>
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
                onClick={() => onEdit(trigger)}
              >
                Edit
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
