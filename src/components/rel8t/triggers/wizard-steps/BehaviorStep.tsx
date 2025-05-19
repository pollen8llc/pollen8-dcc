
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
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Trigger,
  TIME_TRIGGER_TYPES,
  TRIGGER_ACTIONS
} from "@/services/rel8t/triggerService";
import { AlertCircle, Clock, Bell } from "lucide-react";

interface BehaviorStepProps {
  triggerData: Partial<Trigger>;
  updateTriggerData: (newData: Partial<Trigger>) => void;
}

const BehaviorStep = ({ triggerData, updateTriggerData }: BehaviorStepProps) => {
  const isConditionEmpty = triggerData.condition === "";
  const isActionEmpty = triggerData.action === "";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Trigger Behavior</h2>
        <p className="text-muted-foreground">
          Define when this trigger should activate and what action it should perform.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Trigger Condition
          </CardTitle>
          <CardDescription>
            When should this automation be triggered?
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="trigger-condition" className="required">When this happens</Label>
            <Select
              value={triggerData.condition}
              onValueChange={(value) => updateTriggerData({ condition: value })}
            >
              <SelectTrigger 
                id="trigger-condition"
                className={isConditionEmpty ? "border-red-300 focus-visible:ring-red-300" : ""}
              >
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
            {isConditionEmpty && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>A trigger condition is required</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Trigger Action
          </CardTitle>
          <CardDescription>
            What should happen when this trigger activates?
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="trigger-action" className="required">Do this</Label>
            <Select
              value={triggerData.action}
              onValueChange={(value) => updateTriggerData({ action: value })}
            >
              <SelectTrigger 
                id="trigger-action"
                className={isActionEmpty ? "border-red-300 focus-visible:ring-red-300" : ""}
              >
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TRIGGER_ACTIONS.SEND_EMAIL}>Send email</SelectItem>
                <SelectItem value={TRIGGER_ACTIONS.CREATE_TASK}>Create task</SelectItem>
                <SelectItem value={TRIGGER_ACTIONS.ADD_REMINDER}>Add reminder</SelectItem>
                <SelectItem value={TRIGGER_ACTIONS.SEND_NOTIFICATION}>Send notification</SelectItem>
              </SelectContent>
            </Select>
            {isActionEmpty && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>An action is required</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviorStep;
