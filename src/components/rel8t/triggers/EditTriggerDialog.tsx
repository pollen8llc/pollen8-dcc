
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trigger, TIME_TRIGGER_TYPES, TRIGGER_ACTIONS } from "@/services/rel8t/triggerService";
import { DatePicker } from "@/components/ui/date-picker";

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
  onSave 
}: EditTriggerDialogProps) {
  const [executionDate, setExecutionDate] = useState<Date | undefined>(
    trigger.execution_time ? new Date(trigger.execution_time) : undefined
  );
  
  const [executionTime, setExecutionTime] = useState<string>(
    trigger.execution_time 
      ? new Date(trigger.execution_time).toTimeString().slice(0, 5) 
      : "12:00"
  );
  
  const [isRecurring, setIsRecurring] = useState<boolean>(
    !!trigger.recurrence_pattern
  );
  
  const [recurrenceType, setRecurrenceType] = useState<string>(
    trigger.recurrence_pattern?.type || "daily"
  );

  // Update execution time when date or time input changes
  useEffect(() => {
    if (executionDate && trigger.condition === "scheduled_time") {
      const [hours, minutes] = executionTime.split(":").map(Number);
      const execDate = new Date(executionDate);
      execDate.setHours(hours, minutes);
      
      onTriggerChange({
        ...trigger,
        execution_time: execDate.toISOString(),
        next_execution_at: execDate.toISOString(),
        recurrence_pattern: isRecurring 
          ? { type: recurrenceType, startDate: execDate.toISOString() }
          : null
      });
    }
  }, [executionDate, executionTime, isRecurring, recurrenceType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Trigger</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={trigger.name}
              onChange={(e) => onTriggerChange({ ...trigger, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={trigger.description || ""}
              onChange={(e) => onTriggerChange({ ...trigger, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-condition">When this happens</Label>
              <Select
                value={trigger.condition}
                onValueChange={(value) => onTriggerChange({ ...trigger, condition: value })}
              >
                <SelectTrigger id="edit-condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact_added">New contact added</SelectItem>
                  <SelectItem value="birthday_upcoming">Birthday approaching</SelectItem>
                  <SelectItem value="anniversary_upcoming">Anniversary approaching</SelectItem>
                  <SelectItem value="no_contact_30days">No contact for 30 days</SelectItem>
                  <SelectItem value="meeting_scheduled">Meeting scheduled</SelectItem>
                  <SelectItem value="scheduled_time">At scheduled time</SelectItem>
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
              <Label htmlFor="edit-action">Do this</Label>
              <Select
                value={trigger.action}
                onValueChange={(value) => onTriggerChange({ ...trigger, action: value })}
              >
                <SelectTrigger id="edit-action">
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
          
          {/* Date and Time selection for scheduled triggers */}
          {trigger.condition === "scheduled_time" && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-execution-date">Execution Date</Label>
                <DatePicker
                  value={executionDate}
                  onChange={setExecutionDate}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-execution-time">Execution Time</Label>
                <Input
                  id="edit-execution-time"
                  type="time"
                  value={executionTime}
                  onChange={(e) => setExecutionTime(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="edit-recurring">Recurring</Label>
              </div>
              
              {isRecurring && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-recurrence-type">Recurrence Pattern</Label>
                  <Select
                    value={recurrenceType}
                    onValueChange={setRecurrenceType}
                  >
                    <SelectTrigger id="edit-recurrence-type">
                      <SelectValue placeholder="Select recurrence pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={trigger.is_active}
              onCheckedChange={(checked) => onTriggerChange({ ...trigger, is_active: checked })}
            />
            <Label htmlFor="edit-active">Active</Label>
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
