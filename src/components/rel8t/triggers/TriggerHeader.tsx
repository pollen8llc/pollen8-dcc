
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TriggerCreationForm } from "./TriggerCreationForm";

export function TriggerHeader() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSuccess = () => {
    setIsPopoverOpen(false);
    toast({
      title: "Trigger created",
      description: "Your automation trigger has been successfully created.",
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
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Trigger
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="end">
          <TriggerCreationForm onSuccess={handleSuccess} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
