import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getOutreach,
  updateOutreachStatus,
  deleteOutreach,
  OutreachStatus,
  Outreach,
  OutreachFilterTab
} from "@/services/rel8t/outreachService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { formatDistanceToNow, format, isPast, isToday } from "date-fns";
import { 
  Loader2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Trash2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OutreachListProps {
  maxItems?: number;
  showTabs?: boolean;
  defaultTab?: OutreachFilterTab;
  className?: string;
}

const OutreachList = ({ 
  maxItems, 
  showTabs = true, 
  defaultTab = "upcoming", 
  className = "" 
}: OutreachListProps) => {
  const [activeTab, setActiveTab] = useState<OutreachFilterTab>(defaultTab);
  const [outreachToDelete, setOutreachToDelete] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();
  
  // Query to fetch outreach data based on active tab
  const { data: outreachItems = [], isLoading } = useQuery({
    queryKey: ["outreach", activeTab],
    queryFn: () => getOutreach(activeTab),
    placeholderData: (previousData) => previousData, // Keep previous data while loading new tab
  });

  // Display specific number of items if maxItems is provided
  const displayedItems = maxItems ? outreachItems.slice(0, maxItems) : outreachItems;

  // Mutation for updating outreach status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: OutreachStatus }) => 
      updateOutreachStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
    },
  });

  // Mutation for deleting outreach
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOutreach(id),
    onSuccess: () => {
      setOutreachToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
    },
  });

  // Handle status change
  const handleStatusChange = (id: string, status: OutreachStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (outreachToDelete) {
      deleteMutation.mutate(outreachToDelete);
    }
  };

  // Priority badge variants
  const priorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  // Format the due date display
  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (isPast(date)) {
      return `${formatDistanceToNow(date)} ago`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> 
        Loading outreach data...
      </div>
    );
  }

  // Get dates with scheduled outreach
  const rapportDates = outreachItems
    .filter(item => item.due_date)
    .map(item => new Date(item.due_date!));

  // Custom modifier to highlight rapport days
  const modifiers = {
    rapport: rapportDates,
  };

  const modifiersClassNames = {
    rapport: "bg-[#00eada]/20 text-[#00eada] font-bold hover:bg-[#00eada]/30",
  };

  return (
    <div className={className}>
      {showTabs && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OutreachFilterTab)}>
          {/* Calendar - Full Width Responsive */}
          <div className="glass-morphism bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-primary/30 rounded-xl p-4 md:p-6 mb-6 shadow-xl">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="w-full mx-auto border-0 pointer-events-auto"
            />
          </div>

          <TabsList className="grid grid-cols-3 mb-6 backdrop-blur-sm bg-muted/50">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-background">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-background">
              Overdue
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-background">
              Completed
            </TabsTrigger>
          </TabsList>
          
          {(["upcoming", "overdue", "completed"] as OutreachFilterTab[]).map(tab => (
            <TabsContent key={tab} value={tab} className="mt-0 animate-fade-in">
              {renderOutreachContent()}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {!showTabs && renderOutreachContent()}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!outreachToDelete} onOpenChange={() => setOutreachToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this outreach reminder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  function renderOutreachContent() {
    if (displayedItems.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">No outreach tasks</h3>
          <p className="text-muted-foreground mt-2">
            {activeTab === "completed" 
              ? "You haven't completed any outreach tasks yet." 
              : "No scheduled outreach tasks for this period."}
          </p>
        </div>
      );
    }

    return displayedItems.map((outreach) => (
      <Card key={outreach.id} className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Priority indicator */}
            <div 
              className={`absolute top-0 bottom-0 left-0 w-1 ${
                outreach.priority === "high" 
                  ? "bg-destructive" 
                  : outreach.priority === "medium" 
                    ? "bg-primary" 
                    : "bg-secondary"
              }`}
            />
            
            <div className="p-4 pl-5">
              {/* Title and actions */}
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{outreach.title}</h3>
                <div className="flex space-x-2">
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOutreachToDelete(outreach.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Description */}
              {outreach.description && (
                <p className="text-muted-foreground mt-1 line-clamp-2">{outreach.description}</p>
              )}
              
              {/* Metadata and actions */}
              <div className="mt-4 flex flex-wrap items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Due date */}
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDueDate(outreach.due_date)}</span>
                  </div>
                  
                  {/* Priority badge */}
                  <Badge variant={priorityVariant(outreach.priority)} className="capitalize">
                    {outreach.priority}
                  </Badge>
                  
                  {/* Status badge */}
                  <Badge variant="outline" className="capitalize">
                    {outreach.status}
                  </Badge>
                </div>
                
                {/* Contact avatars or count */}
                {outreach.contacts && outreach.contacts.length > 0 && (
                  <div className="mt-2 sm:mt-0 text-sm flex items-center gap-1">
                    <span className="text-muted-foreground">Contacts:</span>
                    <span className="font-medium">{outreach.contacts.length}</span>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              {outreach.status !== "completed" && (
                <div className="mt-4 flex space-x-2 justify-end">
                  {outreach.status !== "overdue" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleStatusChange(outreach.id, "overdue")}
                      className="text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Mark Overdue
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusChange(outreach.id, "completed")}
                    className="text-green-500 border-green-500/20 hover:bg-green-500/10"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                </div>
              )}
              
              {outreach.status === "completed" && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleStatusChange(outreach.id, "pending")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reopen
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  }
};

export default OutreachList;
