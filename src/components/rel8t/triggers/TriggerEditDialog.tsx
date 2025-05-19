
import { Trigger } from "@/services/rel8t/triggerService";
import { EditTriggerDialog } from "./EditTriggerDialog";

interface TriggerEditDialogProps {
  editingTrigger: Trigger | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  setEditingTrigger: (trigger: Trigger | null) => void;
  onSave: () => void;
}

export function TriggerEditDialog({
  editingTrigger,
  isEditDialogOpen,
  setIsEditDialogOpen,
  setEditingTrigger,
  onSave
}: TriggerEditDialogProps) {
  if (!editingTrigger) return null;
  
  return (
    <EditTriggerDialog
      trigger={editingTrigger}
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      onTriggerChange={setEditingTrigger}
      onSave={onSave}
    />
  );
}
