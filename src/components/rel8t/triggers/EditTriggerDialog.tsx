
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Trigger, TIME_TRIGGER_TYPES } from "@/services/rel8t/triggerService";

interface EditTriggerDialogProps {
  trigger: Trigger;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTriggerChange: (trigger: Trigger) => void;
  onSave: () => void;
}

export function EditTriggerDialog({
  trigger,
  open,
  onOpenChange,
  onTriggerChange,
  onSave,
}: EditTriggerDialogProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onTriggerChange({
      ...trigger,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    onTriggerChange({
      ...trigger,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    onTriggerChange({
      ...trigger,
      is_active: checked,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Automation Trigger</DialogTitle>
          <DialogDescription>
            Update the settings for this time-based automation trigger.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Trigger Name</Label>
            <Input
              id="name"
              name="name"
              value={trigger.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={trigger.description || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="condition">Time Interval</Label>
              <Select
                value={trigger.condition}
                onValueChange={handleSelectChange("condition")}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select time interval" />
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
              <Label htmlFor="action">Action</Label>
              <Select
                value={trigger.action}
                onValueChange={handleSelectChange("action")}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_email">Send email</SelectItem>
                  <SelectItem value="create_task">Create task</SelectItem>
                  <SelectItem value="add_reminder">Add reminder</SelectItem>
                  <SelectItem value="send_notification">Send notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={!!trigger.is_active}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is-active">
              {trigger.is_active ? "Active" : "Inactive"}
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
