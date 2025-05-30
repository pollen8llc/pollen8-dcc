
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { 
  getTriggers, 
  deleteTrigger, 
  updateTrigger, 
  Trigger,
  getTriggerStats
} from "@/services/rel8t/triggerService";
import { 
  getEmailStatistics, 
  getEmailNotifications, 
  EmailNotification 
} from "@/services/rel8t/emailService";

export function useTriggerManagement() {
  const [activeTab, setActiveTab] = useState("active");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);

  // Fetch triggers
  const { 
    data: triggers = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["triggers"],
    queryFn: getTriggers,
  });

  // Fetch email statistics
  const { 
    data: emailStats = { pending: 0, sent: 0, failed: 0, total: 0 } 
  } = useQuery({
    queryKey: ["email-statistics"],
    queryFn: getEmailStatistics,
  });

  // Fetch trigger statistics
  const { 
    data: triggerStats = { active: 0, pending: 0, sent: 0, failed: 0, total: 0 } 
  } = useQuery({
    queryKey: ["trigger-statistics"],
    queryFn: getTriggerStats,
  });

  // Fetch email notifications
  const { 
    data: emailNotifications = [] 
  } = useQuery({
    queryKey: ["email-notifications"],
    queryFn: getEmailNotifications,
  });

  // Filter triggers based on active tab
  const filteredTriggers = activeTab === "active"
    ? triggers.filter(trigger => trigger.is_active)
    : activeTab === "inactive" 
      ? triggers.filter(trigger => !trigger.is_active)
      : triggers;

  const handleEditTrigger = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTrigger = async () => {
    if (!editingTrigger) return;

    try {
      await updateTrigger(editingTrigger.id, editingTrigger);
      setIsEditDialogOpen(false);
      refetch();
      toast({
        title: "Trigger updated",
        description: "The trigger has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating trigger:", error);
      toast({
        title: "Error updating trigger",
        description: "There was a problem updating the trigger.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTrigger = async (id: string) => {
    if (confirm("Are you sure you want to delete this trigger?")) {
      try {
        await deleteTrigger(id);
        refetch();
        toast({
          title: "Trigger deleted",
          description: "The trigger has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting trigger:", error);
        toast({
          title: "Error deleting trigger",
          description: "There was a problem deleting the trigger.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateTrigger(id, { is_active: !isActive });
      refetch();
      toast({
        title: `Trigger ${!isActive ? 'activated' : 'deactivated'}`,
        description: `The trigger has been ${!isActive ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error("Error updating trigger status:", error);
      toast({
        title: "Error updating trigger",
        description: "There was a problem updating the trigger status.",
        variant: "destructive",
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingTrigger,
    setEditingTrigger,
    triggers,
    emailStats,
    triggerStats,
    emailNotifications,
    filteredTriggers,
    isLoading,
    handleEditTrigger,
    handleUpdateTrigger,
    handleDeleteTrigger,
    handleToggleActive,
  };
}
