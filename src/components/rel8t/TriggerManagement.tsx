
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Trigger, 
  createTrigger, 
  getTriggers,
  TIME_TRIGGER_TYPES,
  TRIGGER_ACTIONS 
} from "@/services/rel8t/triggerService";
import { TriggerStatsCards } from "./triggers/TriggerStatsCards";
import { TriggersList } from "./triggers/TriggersList";
import { EmailNotificationsList } from "./triggers/EmailNotificationsList";
import { EditTriggerDialog } from "./triggers/EditTriggerDialog";
import { useTriggerManagement } from "@/hooks/rel8t/useTriggerManagement";
import { Calendar, Mail, Bell, AlertCircle } from "lucide-react";

export function TriggerManagement() {
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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Partial<Trigger>>({
    name: "",
    description: "",
    condition: "contact_added",
    action: "send_email",
    is_active: true
  });
  
  const handleCreateTrigger = async () => {
    try {
      await createTrigger(newTrigger as Omit<Trigger, "id" | "user_id" | "created_at" | "updated_at">);
      setIsCreateDialogOpen(false);
      setNewTrigger({
        name: "",
        description: "",
        condition: "contact_added",
        action: "send_email",
        is_active: true
      });
    } catch (error) {
      console.error("Error creating trigger:", error);
    }
  };

  // Function to render icons based on action type
  const renderIcon = (action: string) => {
    switch (action) {
      case "send_email":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "create_task":
        return <Calendar className="h-5 w-5 text-green-500" />;
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Trigger</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Automation Trigger</DialogTitle>
              <DialogDescription>
                Set up a new automation that will run when specific conditions are met.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="trigger-name">Trigger Name</Label>
                <Input
                  id="trigger-name"
                  placeholder="Follow-up after meeting"
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trigger-description">Description (Optional)</Label>
                <Textarea
                  id="trigger-description"
                  placeholder="Send a follow-up email after meeting with a contact"
                  value={newTrigger.description || ""}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="trigger-condition">When this happens</Label>
                  <Select
                    value={newTrigger.condition}
                    onValueChange={(value) => setNewTrigger({ ...newTrigger, condition: value })}
                  >
                    <SelectTrigger id="trigger-condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact_added">New contact added</SelectItem>
                      <SelectItem value="birthday_upcoming">Birthday approaching</SelectItem>
                      <SelectItem value="anniversary_upcoming">Anniversary approaching</SelectItem>
                      <SelectItem value="no_contact_30days">No contact for 30 days</SelectItem>
                      <SelectItem value="meeting_scheduled">Meeting scheduled</SelectItem>
                      <SelectItem value={TIME_TRIGGER_TYPES.HOURLY}>Hourly</SelectItem>
                      <SelectItem value={TIME_TRIGGER_TYPES.DAILY}>Daily</SelectItem>
                      <SelectItem value={TIME_TRIGGER_TYPES.WEEKLY}>Weekly</SelectItem>
                      <SelectItem value={TIME_TRIGGER_TYPES.MONTHLY}>Monthly</SelectItem>
                      <SelectItem value={TIME_TRIGGER_TYPES.QUARTERLY}>Quarterly</SelectItem>
                      <SelectItem value={TIME_TRIGGER_TYPES.YEARLY}>Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trigger-action">Do this</Label>
                  <Select
                    value={newTrigger.action}
                    onValueChange={(value) => setNewTrigger({ ...newTrigger, action: value })}
                  >
                    <SelectTrigger id="trigger-action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TRIGGER_ACTIONS.SEND_EMAIL}>Send email</SelectItem>
                      <SelectItem value={TRIGGER_ACTIONS.CREATE_TASK}>Create task</SelectItem>
                      <SelectItem value={TRIGGER_ACTIONS.ADD_REMINDER}>Add reminder</SelectItem>
                      <SelectItem value={TRIGGER_ACTIONS.SEND_NOTIFICATION}>Send notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="trigger-active"
                  checked={newTrigger.is_active}
                  onCheckedChange={(checked) => setNewTrigger({ ...newTrigger, is_active: checked })}
                />
                <Label htmlFor="trigger-active">Activate trigger immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTrigger}>Create Trigger</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
