
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trigger } from "@/services/rel8t/triggerService";

interface BasicInfoStepProps {
  triggerData: Partial<Trigger>;
  updateTriggerData: (newData: Partial<Trigger>) => void;
}

const BasicInfoStep = ({ triggerData, updateTriggerData }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Basic Information</h2>
        <p className="text-muted-foreground">
          Give your automation trigger a name and description to help you identify it later.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="trigger-name" className="required">Trigger Name</Label>
          <Input
            id="trigger-name"
            placeholder="E.g., Weekly follow-up email"
            value={triggerData.name}
            onChange={(e) => updateTriggerData({ name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="trigger-description">Description (Optional)</Label>
          <Textarea
            id="trigger-description"
            placeholder="Describe what this trigger does"
            value={triggerData.description || ""}
            onChange={(e) => updateTriggerData({ description: e.target.value })}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
