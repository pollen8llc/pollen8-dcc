
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Mail,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { getTriggers, deleteTrigger, updateTrigger, Trigger } from "@/services/rel8t/triggerService";
import { getEmailStatistics, EmailNotification, getEmailNotifications } from "@/services/rel8t/emailService";
import { toast } from "@/hooks/use-toast";

export const TriggerManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);

  // Fetch triggers
  const { data: triggers = [], isLoading, refetch } = useQuery({
    queryKey: ["triggers"],
    queryFn: getTriggers,
  });

  // Fetch email statistics
  const { data: emailStats = { pending: 0, sent: 0, failed: 0, total: 0 } } = useQuery({
    queryKey: ["email-statistics"],
    queryFn: getEmailStatistics,
  });

  // Fetch email notifications
  const { data: emailNotifications = [] } = useQuery({
    queryKey: ["email-notifications"],
    queryFn: () => getEmailNotifications(),
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
    } catch (error) {
      console.error("Error updating trigger status:", error);
      toast({
        title: "Error updating trigger",
        description: "There was a problem updating the trigger status.",
        variant: "destructive",
      });
    }
  };

  // Render trigger icon based on type
  const renderTriggerIcon = (action: string) => {
    if (action.includes('email')) {
      return <Mail className="h-5 w-5 text-blue-500" />;
    } else if (action.includes('notification')) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    } else {
      return <Clock className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Emails</p>
                <h3 className="text-2xl font-bold">{emailStats.pending}</h3>
              </div>
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent Emails</p>
                <h3 className="text-2xl font-bold">{emailStats.sent}</h3>
              </div>
              <Check className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Triggers</p>
                <h3 className="text-2xl font-bold">
                  {triggers.filter(t => t.is_active).length}
                </h3>
              </div>
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outreach Trigger Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Triggers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="emails">Email Log</TabsTrigger>
            </TabsList>

            {/* All triggers tab content */}
            <TabsContent value="all">
              {renderTriggersList(
                filteredTriggers, 
                handleEditTrigger, 
                handleDeleteTrigger, 
                handleToggleActive, 
                renderTriggerIcon, 
                isLoading
              )}
            </TabsContent>

            {/* Active triggers tab content */}
            <TabsContent value="active">
              {renderTriggersList(
                filteredTriggers, 
                handleEditTrigger, 
                handleDeleteTrigger, 
                handleToggleActive, 
                renderTriggerIcon, 
                isLoading
              )}
            </TabsContent>

            {/* Inactive triggers tab content */}
            <TabsContent value="inactive">
              {renderTriggersList(
                filteredTriggers, 
                handleEditTrigger, 
                handleDeleteTrigger, 
                handleToggleActive, 
                renderTriggerIcon, 
                isLoading
              )}
            </TabsContent>

            {/* Email log tab content */}
            <TabsContent value="emails">
              <div className="space-y-4">
                {emailNotifications.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <Mail className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-2 text-lg font-semibold">No email notifications</h3>
                    <p className="text-muted-foreground mt-1">
                      No outreach emails have been scheduled yet.
                    </p>
                  </div>
                ) : (
                  emailNotifications.map((notification: EmailNotification) => (
                    <div
                      key={notification.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-3 text-blue-500" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{notification.subject}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.status === "sent" 
                                ? "bg-green-100 text-green-800" 
                                : notification.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              {notification.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">To: {notification.recipient_name || notification.recipient_email}</p>
                          <div className="text-xs text-muted-foreground mt-2">
                            {notification.sent_at 
                              ? `Sent on ${format(new Date(notification.sent_at), "PPP 'at' p")}`
                              : notification.scheduled_for
                              ? `Scheduled for ${format(new Date(notification.scheduled_for), "PPP 'at' p")}`
                              : "Not scheduled"
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Trigger Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Trigger</DialogTitle>
            <DialogDescription>
              Update the settings for this outreach trigger.
            </DialogDescription>
          </DialogHeader>
          
          {editingTrigger && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="trigger-name">Trigger Name</Label>
                <Input
                  id="trigger-name"
                  value={editingTrigger.name}
                  onChange={(e) => setEditingTrigger({ ...editingTrigger, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="trigger-description">Description</Label>
                <Textarea
                  id="trigger-description"
                  value={editingTrigger.description || ""}
                  onChange={(e) => setEditingTrigger({ ...editingTrigger, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="trigger-condition">Condition</Label>
                <Input
                  id="trigger-condition"
                  value={editingTrigger.condition}
                  onChange={(e) => setEditingTrigger({ ...editingTrigger, condition: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="trigger-action">Action</Label>
                <Input
                  id="trigger-action"
                  value={editingTrigger.action}
                  onChange={(e) => setEditingTrigger({ ...editingTrigger, action: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Status</Label>
                <Select 
                  value={editingTrigger.is_active ? "active" : "inactive"}
                  onValueChange={(value) => setEditingTrigger({ 
                    ...editingTrigger, 
                    is_active: value === "active" 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTrigger}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to render triggers list
function renderTriggersList(
  triggers: Trigger[], 
  onEdit: (trigger: Trigger) => void,
  onDelete: (id: string) => void,
  onToggleActive: (id: string, isActive: boolean) => void,
  renderIcon: (action: string) => React.ReactNode,
  isLoading: boolean
) {
  if (isLoading) {
    return <div className="py-8 text-center">Loading triggers...</div>;
  }
  
  if (triggers.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-2 text-lg font-semibold">No triggers found</h3>
        <p className="text-muted-foreground mt-1">
          You don't have any triggers configured yet.
        </p>
        <Button className="mt-4" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Trigger
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <div
          key={trigger.id}
          className="border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              {renderIcon(trigger.action)}
              <div className="ml-3">
                <div className="flex items-center">
                  <h4 className="font-medium">{trigger.name}</h4>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    trigger.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {trigger.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{trigger.description}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium">Condition:</span> {trigger.condition}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Action:</span> {trigger.action}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onToggleActive(trigger.id, trigger.is_active || false)}
              >
                {trigger.is_active ? "Disable" : "Enable"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(trigger)}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(trigger.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
