
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, AlertCircle, Download, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Outreach, updateOutreachStatus, deleteOutreach } from "@/services/rel8t/outreachService";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarOptionsDialog } from "./CalendarOptionsDialog";
import { generateOutreachICS } from "@/utils/outreachIcsGenerator";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OutreachCardProps {
  outreach: Outreach;
}

export const OutreachCard: React.FC<OutreachCardProps> = ({ outreach }) => {
  const queryClient = useQueryClient();
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [icsContent, setIcsContent] = useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleMarkComplete = async () => {
    const success = await updateOutreachStatus(outreach.id, "completed");
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
    }
  };

  const handleDelete = async () => {
    const success = await deleteOutreach(outreach.id);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      queryClient.invalidateQueries({ queryKey: ["outreach-counts"] });
    }
    setShowDeleteDialog(false);
  };

  const handleAddToCalendar = async () => {
    // Get user email for ICS attendee field
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email;

    // Use system email from outreach as organizer, fallback to user email
    const systemEmail = outreach.system_email || userEmail || 'notifications@ecosystembuilder.app';
    const ics = generateOutreachICS(outreach, systemEmail, userEmail);
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
      "mb-4 flex flex-col", 
      isOverdue ? "border-red-500/30" : "border-border/20"
    )}>
      <CardHeader className="px-4 py-3 border-b border-border/20 bg-card">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {outreach.calendar_sync_enabled && (
              <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-400/30">
                <Calendar className="h-3 w-3 mr-1" />
                Synced
              </Badge>
            )}
            
            {isOverdue && (
              <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-500/30">
                <AlertCircle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-4">{outreach.title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Priority</span>
            <Badge variant="outline" className={cn(priorityColor[outreach.priority], "w-fit")}>
              {outreach.priority}
            </Badge>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</span>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDistanceToNow(new Date(outreach.due_date), { addSuffix: true })}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Contacts</span>
            <div className="flex flex-wrap gap-1">
              {outreach.contacts?.map((contact) => (
                <Badge key={contact.id} variant="outline" className="font-normal border-[#00eada]/30 bg-[#00eada]/10 text-[#00eada]">
                  {contact.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Type</span>
            <p className="text-sm line-clamp-2">
              {outreach.description || "Relationship outreach"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-border/20">
          {outreach.status === "pending" && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleAddToCalendar}
              >
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleMarkComplete}
              >
                <Check className="h-4 w-4" />
                Mark Complete
              </Button>
            </>
          )}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outreach Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this outreach task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
