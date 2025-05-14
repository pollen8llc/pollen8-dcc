
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOutreach, updateOutreachStatus, deleteOutreach } from "@/services/rel8t/outreachService";
import { OutreachCard } from "./OutreachCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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

export type OutreachFilterType = "today" | "upcoming" | "overdue" | "completed";

interface OutreachListProps {
  defaultTab?: OutreachFilterType;
  showTabs?: boolean;
  limit?: number;
}

const OutreachList = ({ 
  defaultTab = "today", 
  showTabs = true,
  limit
}: OutreachListProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<OutreachFilterType>(defaultTab);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outreachToDelete, setOutreachToDelete] = useState<string | null>(null);
  
  const { data: outreach = [], isLoading } = useQuery({
    queryKey: ["outreach", activeTab, limit],
    queryFn: () => getOutreach(activeTab, limit),
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      updateOutreachStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      queryClient.invalidateQueries({ queryKey: ["outreach-counts"] });
      toast({
        title: "Outreach updated",
        description: "Status has been updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update outreach",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOutreach(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      queryClient.invalidateQueries({ queryKey: ["outreach-counts"] });
      toast({
        title: "Outreach deleted",
        description: "Outreach has been deleted successfully"
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete outreach",
        variant: "destructive"
      });
    }
  });
  
  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  const handleDeleteOutreach = (outreachId: string) => {
    setOutreachToDelete(outreachId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (outreachToDelete) {
      deleteMutation.mutate(outreachToDelete);
    }
  };
  
  return (
    <div>
      {showTabs && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OutreachFilterType)} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="overdue">Needs Attention</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : outreach.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-2 font-semibold">No outreach found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === "completed" 
              ? "You haven't completed any outreach yet."
              : activeTab === "upcoming"
                ? "You don't have any upcoming outreach scheduled."
                : activeTab === "overdue"
                  ? "You're all caught up with your relationships!"
                  : "You don't have any outreach for today."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {outreach.map((item) => (
            <OutreachCard 
              key={item.id}
              outreach={item} 
              onStatusChange={handleStatusChange}
              onDelete={() => handleDeleteOutreach(item.id)}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete outreach?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this outreach reminder. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OutreachList;
