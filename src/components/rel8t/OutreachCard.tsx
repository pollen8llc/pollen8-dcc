
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Outreach, updateOutreachStatus } from "@/services/rel8t/outreachService";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface OutreachCardProps {
  outreach: Outreach;
}

export const OutreachCard: React.FC<OutreachCardProps> = ({ outreach }) => {
  const queryClient = useQueryClient();
  
  const handleMarkComplete = async () => {
    const success = await updateOutreachStatus(outreach.id, "completed");
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
    }
  };

  const priorityColor = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const isOverdue = new Date(outreach.due_date) < new Date() && outreach.status === "pending";

  return (
    <Card className={cn("mb-4", isOverdue && "border-red-300 dark:border-red-800")}>
      <CardHeader className="px-4 py-3 border-b bg-muted/50">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className={cn(priorityColor[outreach.priority])}>
            {outreach.priority} priority
          </Badge>
          
          {isOverdue && (
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-1">{outreach.title}</h3>
        {outreach.description && (
          <p className="text-muted-foreground text-sm mb-3">{outreach.description}</p>
        )}
        
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-1">Contacts</h4>
          <div className="flex flex-wrap gap-1">
            {outreach.contacts?.map((contact) => (
              <Badge key={contact.id} variant="secondary" className="font-normal">
                {contact.name}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {formatDistanceToNow(new Date(outreach.due_date), { addSuffix: true })}
            </span>
          </div>
          
          {outreach.status === "pending" && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={handleMarkComplete}
            >
              <Check className="h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
