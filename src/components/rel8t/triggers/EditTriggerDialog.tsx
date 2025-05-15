
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Trigger } from "@/services/rel8t/triggerService";

interface EditTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: Trigger | null;
  onTriggerChange: (trigger: Trigger) => void;
  onSave: () => void;
}

export function EditTriggerDialog({
  open,
  onOpenChange,
  trigger,
  onTriggerChange,
  onSave
}: EditTriggerDialogProps) {
  if (!trigger) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Trigger</DialogTitle>
          <DialogDescription>
            Update the settings for this outreach trigger.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="trigger-name">Trigger Name</Label>
            <Input
              id="trigger-name"
              value={trigger.name}
              onChange={(e) => onTriggerChange({ ...trigger, name: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="trigger-description">Description</Label>
            <Textarea
              id="trigger-description"
              value={trigger.description || ""}
              onChange={(e) => onTriggerChange({ ...trigger, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="trigger-condition">Condition</Label>
            <Input
              id="trigger-condition"
              value={trigger.condition}
              onChange={(e) => onTriggerChange({ ...trigger, condition: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="trigger-action">Action</Label>
            <Input
              id="trigger-action"
              value={trigger.action}
              onChange={(e) => onTriggerChange({ ...trigger, action: e.target.value })}
            />
          </div>
          
          <div>
            <Label>Status</Label>
            <Select 
              value={trigger.is_active ? "active" : "inactive"}
              onValueChange={(value) => onTriggerChange({ 
                ...trigger, 
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
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
