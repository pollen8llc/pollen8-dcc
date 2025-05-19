
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trigger, 
  deleteTrigger, 
  getTriggers,
} from "@/services/rel8t/triggerService";
import { TriggerStatsCards } from "./triggers/TriggerStatsCards";
import { TriggersList } from "./triggers/TriggersList";
import { EmailNotificationsList } from "./triggers/EmailNotificationsList";
import { EditTriggerDialog } from "./triggers/EditTriggerDialog";
import { useTriggerManagement } from "@/hooks/rel8t/useTriggerManagement";
import { Calendar as CalendarIcon, Mail, Bell, AlertCircle, Plus } from "lucide-react";

export function TriggerManagement() {
  const navigate = useNavigate();
  const {
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
  } = useTriggerManagement();

  // Navigation to the wizard
  const handleCreateTrigger = () => {
    navigate('/rel8/triggers/create');
  };

  // Function to render icons based on action type
  const renderIcon = (action: string) => {
    switch (action) {
      case "send_email":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "create_task":
        return <CalendarIcon className="h-5 w-5 text-green-500" />;
      case "add_reminder":
        return <Bell className="h-5 w-5 text-amber-500" />;
      case "send_notification":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Mail className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Automation Triggers</h2>
          <p className="text-muted-foreground">
            Create automated actions based on specific events
          </p>
        </div>
        <Button onClick={handleCreateTrigger}>
          <Plus className="mr-2 h-4 w-4" />
          Create Trigger
        </Button>
      </div>

      <TriggerStatsCards 
        pendingEmails={emailStats.pending} 
        sentEmails={emailStats.sent} 
        activeTriggers={triggers.filter(t => t.is_active).length} 
      />

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Triggers</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Triggers</TabsTrigger>
          <TabsTrigger value="all">All Triggers</TabsTrigger>
          <TabsTrigger value="notifications">Email Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <TriggersList
            triggers={filteredTriggers}
            isLoading={isLoading}
            onEdit={handleEditTrigger}
            onDelete={handleDeleteTrigger}
            onToggleActive={handleToggleActive}
            renderIcon={renderIcon}
          />
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          <TriggersList
            triggers={filteredTriggers}
            isLoading={isLoading}
            onEdit={handleEditTrigger}
            onDelete={handleDeleteTrigger}
            onToggleActive={handleToggleActive}
            renderIcon={renderIcon}
          />
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <TriggersList
            triggers={filteredTriggers}
            isLoading={isLoading}
            onEdit={handleEditTrigger}
            onDelete={handleDeleteTrigger}
            onToggleActive={handleToggleActive}
            renderIcon={renderIcon}
          />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <EmailNotificationsList notifications={emailNotifications} />
        </TabsContent>
      </Tabs>

      {/* Edit trigger dialog */}
      {editingTrigger && (
        <EditTriggerDialog
          trigger={editingTrigger}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onTriggerChange={setEditingTrigger}
          onSave={handleUpdateTrigger}
        />
      )}
    </div>
  );
}
