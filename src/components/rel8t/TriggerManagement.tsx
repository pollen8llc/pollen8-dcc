
import { useState } from "react";
import { TriggerStatsCards } from "./triggers/TriggerStatsCards";
import { renderTriggerIcon } from "./triggers/IconRenderer";
import { TriggerHeader } from "./triggers/TriggerHeader";
import { TriggerTabs } from "./triggers/TriggerTabs";
import { TriggerEditDialog } from "./triggers/TriggerEditDialog";
import { useTriggerManagement } from "@/hooks/rel8t/useTriggerManagement";

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
    filteredTriggers,
    isLoading,
    handleEditTrigger,
    handleUpdateTrigger,
    handleDeleteTrigger,
    handleToggleActive,
  } = useTriggerManagement();

  return (
    <div className="space-y-6">
      <TriggerHeader />

      <TriggerStatsCards 
        pendingEmails={emailStats.pending} 
        sentEmails={emailStats.sent} 
        activeTriggers={triggers.filter(t => t.is_active).length} 
      />

      <TriggerTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredTriggers={filteredTriggers}
        isLoading={isLoading}
        handleEditTrigger={handleEditTrigger}
        handleDeleteTrigger={handleDeleteTrigger}
        handleToggleActive={handleToggleActive}
        renderIcon={renderTriggerIcon}
      />

      <TriggerEditDialog 
        editingTrigger={editingTrigger}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setEditingTrigger={setEditingTrigger}
        onSave={handleUpdateTrigger}
      />
    </div>
  );
}
