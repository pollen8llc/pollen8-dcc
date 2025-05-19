
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TriggerHeader() {
  const navigate = useNavigate();

  const handleCreateTrigger = () => {
    navigate("/rel8/trigger-wizard");
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
