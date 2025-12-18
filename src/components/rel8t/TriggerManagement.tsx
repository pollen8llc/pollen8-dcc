import { renderTriggerIcon } from "./triggers/IconRenderer";
import { TriggerHeader } from "./triggers/TriggerHeader";
import { TriggerTabs } from "./triggers/TriggerTabs";
import { TriggerEditDialog } from "./triggers/TriggerEditDialog";
import { TriggerSearchFilter } from "./triggers/TriggerSearchFilter";
import { useTriggerManagement } from "@/hooks/rel8t/useTriggerManagement";

export function TriggerManagement() {
  const {
    activeTab,
    setActiveTab,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingTrigger,
    setEditingTrigger,
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
  } = useTriggerManagement();

  return (
    <div className="space-y-6">
      <TriggerHeader />

      <TriggerSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        frequencyFilter={frequencyFilter}
        onFrequencyFilterChange={setFrequencyFilter}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
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
