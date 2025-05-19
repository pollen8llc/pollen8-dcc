
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";

export function BasicInfoStep() {
  const { formData, updateFormData, handleNextStep, errors } = useTriggerWizard();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormItem>
          <FormLabel className="text-base">Trigger Name</FormLabel>
          <Input 
            value={formData.name} 
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter a name for this trigger"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </FormItem>

        <FormItem>
          <FormLabel className="text-base">Description</FormLabel>
          <Textarea 
            value={formData.description} 
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Optional description for this trigger"
            rows={3}
          />
        </FormItem>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Active</FormLabel>
            <p className="text-sm text-muted-foreground">
              Enable or disable this trigger
            </p>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => updateFormData({ isActive: checked })}
          />
        </FormItem>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNextStep}>Next Step</Button>
      </div>
    </div>
  );
}
