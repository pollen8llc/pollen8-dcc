
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { currentUser } = useUser();

  // Fetch triggers
  const { 
    data: triggers = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["triggers", currentUser?.id],
    queryFn: getTriggers,
    enabled: !!currentUser?.id,
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

  // Filter triggers based on active tab, search query, frequency filter, and date
  const filteredTriggers = triggers.filter(trigger => {
    // Tab filter (active/inactive/all)
    if (activeTab === "active" && !trigger.is_active) return false;
    if (activeTab === "inactive" && trigger.is_active) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = trigger.name?.toLowerCase().includes(query);
      const matchesDescription = trigger.description?.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription) return false;
    }
    
    // Frequency filter
    if (frequencyFilter !== "all") {
      const triggerFrequency = trigger.recurrence_pattern?.type?.toLowerCase();
      if (triggerFrequency !== frequencyFilter) return false;
    }
    
    // Date filter
    if (selectedDate) {
      const triggerDate = trigger.recurrence_pattern?.start_date 
        ? new Date(trigger.recurrence_pattern.start_date) 
        : trigger.created_at 
          ? new Date(trigger.created_at) 
          : null;
      
      if (triggerDate) {
        const isSameDay = 
          triggerDate.getFullYear() === selectedDate.getFullYear() &&
          triggerDate.getMonth() === selectedDate.getMonth() &&
          triggerDate.getDate() === selectedDate.getDate();
        if (!isSameDay) return false;
      } else {
        return false;
      }
    }
    
    return true;
  });

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
    searchQuery,
    setSearchQuery,
    frequencyFilter,
    setFrequencyFilter,
    selectedDate,
    setSelectedDate,
    handleEditTrigger,
    handleUpdateTrigger,
    handleDeleteTrigger,
    handleToggleActive,
  };
}
