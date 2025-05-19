import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { useFormContext } from "react-hook-form";

export function BasicInfoStep({ validateAndNext }: { validateAndNext: () => void }) {
  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const isActive = watch("isActive");
  
  return (
    <div className="space-y-6">
      <FormItem>
        <FormLabel className="text-base">Name</FormLabel>
        <Input
          placeholder="Enter trigger name"
          {...register("name", { required: "Trigger name is required" })}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <FormMessage>{errors.name.message as string}</FormMessage>
        )}
      </FormItem>

      <FormItem>
        <FormLabel className="text-base">Description</FormLabel>
        <Textarea
          placeholder="Enter a brief description of this trigger (optional)"
          className="resize-none min-h-[100px]"
          {...register("description")}
        />
      </FormItem>

      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <FormLabel className="text-base">Active</FormLabel>
          <p className="text-sm text-muted-foreground">
            Determines if this trigger will execute when conditions are met
          </p>
        </div>
        <Switch 
          checked={isActive} 
          onCheckedChange={(checked) => setValue("isActive", checked)}
        />
      </FormItem>

      <div className="flex justify-end">
        <Button type="button" onClick={validateAndNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
