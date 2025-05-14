
import { format, formatDistanceToNow } from "date-fns";
import { ChevronDown, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface OutreachProps {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: string;
  status: string;
  contacts: Array<{
    id: string;
    name: string;
    email?: string;
    organization?: string;
  }>;
}

interface OutreachCardProps {
  outreach: OutreachProps;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

export const OutreachCard: React.FC<OutreachCardProps> = ({
  outreach,
  onStatusChange,
  onDelete
}) => {
  const dueDate = new Date(outreach.due_date);
  const isOverdue = outreach.status !== "completed" && dueDate < new Date();
  const isToday = outreach.status !== "completed" && 
    new Date().toDateString() === dueDate.toDateString();
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusColor = () => {
    if (outreach.status === "completed") return "success";
    if (isOverdue) return "destructive";
    if (isToday) return "warning";
    return "default";
  };

  const getStatusDisplay = () => {
    if (outreach.status === "completed") return "Completed";
    if (isOverdue) return "Overdue";
    if (isToday) return "Today";
    return "Upcoming";
  };

  return (
    <Card className="overflow-hidden border-border/20">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Priority indicator */}
          <div className={`w-full md:w-1.5 ${getPriorityColor(outreach.priority)}`} />
          
          <div className="p-4 flex-1">
            <div className="flex flex-wrap justify-between gap-2 mb-2">
              <h3 className="font-medium text-lg">{outreach.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor() as any}>
                  {getStatusDisplay()}
                </Badge>
                
                <div className="flex items-center gap-1">
                  {onStatusChange && outreach.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => onStatusChange(outreach.id, "completed")}
                      title="Mark as completed"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(outreach.id)}
                      title="Delete outreach"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onStatusChange && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                        <DropdownMenuItem
                          onClick={() => onStatusChange(outreach.id, "pending")}
                          className="cursor-pointer"
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(outreach.id, "completed")}
                          className="cursor-pointer"
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>

            {outreach.description && (
              <p className="text-sm text-muted-foreground mb-3">{outreach.description}</p>
            )}

            <div className="flex flex-col gap-2">
              <p className="text-sm">
                <span className="font-medium">Due:</span>{" "}
                {format(dueDate, "PPP")} ({formatDistanceToNow(dueDate, { addSuffix: true })})
              </p>

              <div>
                <p className="text-sm font-medium mb-1">Contacts:</p>
                <div className="flex flex-wrap gap-1">
                  {outreach.contacts.map((contact) => (
                    <Badge key={contact.id} variant="outline" className="bg-secondary/50">
                      {contact.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
