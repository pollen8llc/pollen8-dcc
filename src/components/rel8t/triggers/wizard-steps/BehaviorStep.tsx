
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Trigger,
  TIME_TRIGGER_TYPES,
  TRIGGER_ACTIONS
} from "@/services/rel8t/triggerService";

interface BehaviorStepProps {
  triggerData: Partial<Trigger>;
  updateTriggerData: (newData: Partial<Trigger>) => void;
}

const BehaviorStep = ({ triggerData, updateTriggerData }: BehaviorStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Trigger Behavior</h2>
        <p className="text-muted-foreground">
          Define when this trigger should activate and what action it should perform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="trigger-condition" className="required">When this happens</Label>
          <Select
            value={triggerData.condition}
            onValueChange={(value) => updateTriggerData({ condition: value })}
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
          <Label htmlFor="trigger-action" className="required">Do this</Label>
          <Select
            value={triggerData.action}
            onValueChange={(value) => updateTriggerData({ action: value })}
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
    </div>
  );
};

export default BehaviorStep;
