
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function TriggerHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Automation Triggers</h2>
        <p className="text-muted-foreground">
          Create automated actions based on time schedules or contact events
        </p>
      </div>
      
      <Link to="/rel8/triggers/wizard">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Trigger
        </Button>
      </Link>
    </div>
  );
}
