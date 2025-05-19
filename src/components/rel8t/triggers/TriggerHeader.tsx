
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export function TriggerHeader() {
  const handleCreateTrigger = () => {
    toast({
      title: "Feature removed",
      description: "The trigger creation wizard has been removed.",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold">Automation Triggers</h2>
        <p className="text-muted-foreground">
          Create automated actions based on specific events
        </p>
      </div>
      <Button onClick={handleCreateTrigger}>
        <Plus className="mr-2 h-4 w-4" />
        Create Trigger
      </Button>
    </div>
  );
}
