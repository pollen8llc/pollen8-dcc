
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
import { Calendar, Clock, Calendar as CalendarIcon, AlertCircle, Bell } from "lucide-react";

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
    condition: TIME_TRIGGER_TYPES.DAILY, // Default to daily
    action: TRIGGER_ACTIONS.SEND_EMAIL,
    is_active: true
  });
  
  const handleCreateTrigger = async () => {
    try {
      await createTrigger(newTrigger as Omit<Trigger, "id" | "user_id" | "created_at" | "updated_at">);
      setIsCreateDialogOpen(false);
      setNewTrigger({
        name: "",
        description: "",
        condition: TIME_TRIGGER_TYPES.DAILY,
        action: TRIGGER_ACTIONS.SEND_EMAIL,
        is_active: true
      });
    } catch (error) {
      console.error("Error creating trigger:", error);
    }
  };

  // Function to render icons based on time frequency
  const renderIcon = (condition: string) => {
    switch (condition) {
      case TIME_TRIGGER_TYPES.HOURLY:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case TIME_TRIGGER_TYPES.DAILY:
        return <Calendar className="h-5 w-5 text-green-500" />;
      case TIME_TRIGGER_TYPES.WEEKLY:
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case TIME_TRIGGER_TYPES.MONTHLY:
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case TIME_TRIGGER_TYPES.QUARTERLY:
        return <Calendar className="h-5 w-5 text-red-500" />;
      case TIME_TRIGGER_TYPES.YEARLY:
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Time-Based Automations</h2>
          <p className="text-muted-foreground">
            Create automated actions that run on a schedule
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Time Trigger</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Time-Based Automation</DialogTitle>
              <DialogDescription>
                Set up a new automation that will run at specific time intervals.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="trigger-name">Trigger Name</Label>
                <Input
                  id="trigger-name"
                  placeholder="Monthly Contact Check-in"
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trigger-description">Description (Optional)</Label>
                <Textarea
                  id="trigger-description"
                  placeholder="Send monthly check-in emails to important contacts"
                  value={newTrigger.description || ""}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="trigger-condition">Frequency</Label>
                  <Select
                    value={newTrigger.condition}
                    onValueChange={(value) => setNewTrigger({ ...newTrigger, condition: value })}
                  >
                    <SelectTrigger id="trigger-condition">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="trigger-action">Action</Label>
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
