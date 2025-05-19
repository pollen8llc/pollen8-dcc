
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function TriggerHeader() {
  // Handle showing a message when the button is clicked
  const handleButtonClick = () => {
    toast({
      title: "Feature removed",
      description: "The trigger wizard functionality has been removed.",
      variant: "destructive",
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
      <Button onClick={handleButtonClick}>
        Create Trigger
      </Button>
    </div>
  );
}
