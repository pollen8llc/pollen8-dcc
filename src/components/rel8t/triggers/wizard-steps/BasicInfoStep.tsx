
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trigger } from "@/services/rel8t/triggerService";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { FileText, AlertCircle } from "lucide-react";

interface BasicInfoStepProps {
  triggerData: Partial<Trigger>;
  updateTriggerData: (newData: Partial<Trigger>) => void;
}

const BasicInfoStep = ({ triggerData, updateTriggerData }: BasicInfoStepProps) => {
  const isNameEmpty = triggerData.name === "";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Basic Information</h2>
        <p className="text-muted-foreground">
          Give your automation trigger a name and description to help you identify it later.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Trigger Details
          </CardTitle>
          <CardDescription>
            Provide essential information about this automation
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="trigger-name" className="required">Trigger Name</Label>
            <Input
              id="trigger-name"
              placeholder="E.g., Weekly follow-up email"
              value={triggerData.name}
              onChange={(e) => updateTriggerData({ name: e.target.value })}
              className={isNameEmpty ? "border-red-300 focus-visible:ring-red-300" : ""}
              required
            />
            {isNameEmpty && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>A name is required</span>
              </div>
            )}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoStep;
