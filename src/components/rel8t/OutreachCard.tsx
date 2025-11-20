
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, AlertCircle, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Outreach, updateOutreachStatus } from "@/services/rel8t/outreachService";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarOptionsDialog } from "./CalendarOptionsDialog";
import { generateOutreachICS } from "@/utils/outreachIcsGenerator";
import { supabase } from "@/integrations/supabase/client";

interface OutreachCardProps {
  outreach: Outreach;
}

export const OutreachCard: React.FC<OutreachCardProps> = ({ outreach }) => {
  const queryClient = useQueryClient();
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [icsContent, setIcsContent] = useState<string>("");
  
  const handleMarkComplete = async () => {
    const success = await updateOutreachStatus(outreach.id, "completed");
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
    }
  };

  const handleAddToCalendar = async () => {
    // Get user email for ICS organizer field
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email;

    const ics = generateOutreachICS(outreach, userEmail);
    setIcsContent(ics);
    setShowCalendarDialog(true);
  };

  // Updated color classes for the dark theme
  const priorityColor = {
    low: "bg-blue-900/30 text-blue-400 border-blue-400/30",
    medium: "bg-yellow-900/30 text-yellow-400 border-yellow-400/30",
    high: "bg-red-900/30 text-red-400 border-red-400/30",
  };

  const isOverdue = new Date(outreach.due_date) < new Date() && outreach.status === "pending";

  return (
    <Card className={cn(
      "mb-4 h-[180px] flex flex-col", 
      isOverdue ? "border-red-500/30" : "border-border/20"
    )}>
      <CardHeader className="px-4 py-3 border-b border-border/20 bg-card">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className={cn(priorityColor[outreach.priority])}>
            {outreach.priority} priority
          </Badge>
          
          {isOverdue && (
            <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-500/30">
              <AlertCircle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-medium mb-1">{outreach.title}</h3>
        {outreach.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{outreach.description}</p>
        )}
        
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-1">Contacts</h4>
          <div className="flex flex-wrap gap-1">
            {outreach.contacts?.map((contact) => (
              <Badge key={contact.id} variant="outline" className="font-normal border-[#00eada]/30 bg-[#00eada]/10 text-[#00eada]">
                {contact.name}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {formatDistanceToNow(new Date(outreach.due_date), { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 h-8 px-2"
              onClick={handleAddToCalendar}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {outreach.status === "pending" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleMarkComplete}
              >
                <Check className="h-4 w-4" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <CalendarOptionsDialog
        open={showCalendarDialog}
        onOpenChange={setShowCalendarDialog}
        title={outreach.title}
        description={outreach.description || undefined}
        icsContent={icsContent}
        startDate={outreach.due_date}
      />
    </Card>
  );
};
