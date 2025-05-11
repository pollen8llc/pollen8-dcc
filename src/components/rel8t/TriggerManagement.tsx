
import React from "react";
import { AlertCircle, Calendar, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useTriggerManagement } from "@/hooks/rel8t/useTriggerManagement";
import { TriggerStatsCards } from "./triggers/TriggerStatsCards";
import { TriggersList } from "./triggers/TriggersList";
import { EmailNotificationsList } from "./triggers/EmailNotificationsList";
import { EditTriggerDialog } from "./triggers/EditTriggerDialog";

export const TriggerManagement: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingTrigger,
    setEditingTrigger,
    emailStats,
    emailNotifications,
    filteredTriggers,
    isLoading,
    handleEditTrigger,
    handleUpdateTrigger,
    handleDeleteTrigger,
    handleToggleActive,
  } = useTriggerManagement();

  // Render trigger icon based on type
  const renderTriggerIcon = (action: string) => {
    if (action.includes('email')) {
      return <Mail className="h-5 w-5 text-blue-500" />;
    } else if (action.includes('notification')) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    } else {
      return <Calendar className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div>
      <TriggerStatsCards
        pendingEmails={emailStats.pending}
        sentEmails={emailStats.sent}
        activeTriggers={filteredTriggers.filter(t => t.is_active).length}
      />

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
              <TriggersList
                triggers={filteredTriggers}
                onEdit={handleEditTrigger}
                onDelete={handleDeleteTrigger}
                onToggleActive={handleToggleActive}
                renderIcon={renderTriggerIcon}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Active triggers tab content */}
            <TabsContent value="active">
              <TriggersList
                triggers={filteredTriggers}
                onEdit={handleEditTrigger}
                onDelete={handleDeleteTrigger}
                onToggleActive={handleToggleActive}
                renderIcon={renderTriggerIcon}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Inactive triggers tab content */}
            <TabsContent value="inactive">
              <TriggersList
                triggers={filteredTriggers}
                onEdit={handleEditTrigger}
                onDelete={handleDeleteTrigger}
                onToggleActive={handleToggleActive}
                renderIcon={renderTriggerIcon}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Email log tab content */}
            <TabsContent value="emails">
              <EmailNotificationsList notifications={emailNotifications} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Trigger Dialog */}
      <EditTriggerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        trigger={editingTrigger}
        onTriggerChange={setEditingTrigger}
        onSave={handleUpdateTrigger}
      />
    </div>
  );
};
