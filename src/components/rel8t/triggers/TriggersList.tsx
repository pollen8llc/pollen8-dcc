
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trigger } from "@/services/rel8t/triggerService";
import { Clock, Pencil, Trash } from "lucide-react";
import { formatDistance } from "date-fns";

export interface TriggersListProps {
  triggers: Trigger[];
  isLoading: boolean;
  onEdit: (trigger: Trigger) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  renderIcon: (action: string) => JSX.Element;
}

export function TriggersList({
  triggers,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  renderIcon
}: TriggersListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading triggers...</p>
      </div>
    );
  }

  if (triggers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center text-center p-6">
          <Clock className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-lg font-medium">No triggers found</p>
          <p className="text-sm text-muted-foreground">
            Create a new trigger to automate your relationship management.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCondition = (condition: string): string => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <Card key={trigger.id} className="overflow-hidden">
          <div
            className={`h-1.5 w-full ${
              trigger.is_active ? "bg-primary" : "bg-muted"
            }`}
          ></div>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">{renderIcon(trigger.action)}</div>
                <CardTitle className="text-base font-medium">
                  {trigger.name}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={trigger.is_active}
                  onCheckedChange={() =>
                    onToggleActive(trigger.id, !!trigger.is_active)
                  }
                  aria-label={`${
                    trigger.is_active ? "Deactivate" : "Activate"
                  } trigger`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(trigger)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(trigger.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            {trigger.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {trigger.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {formatCondition(trigger.condition)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {trigger.action.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Updated {formatDate(trigger.updated_at)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
