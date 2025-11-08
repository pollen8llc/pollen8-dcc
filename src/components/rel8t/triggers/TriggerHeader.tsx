
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function TriggerHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Zap className="h-7 w-7 text-primary" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automation Triggers</h2>
          <p className="text-sm text-muted-foreground">
            Create automated actions based on time schedules or contact events
          </p>
        </div>
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
