
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onAddContact: () => void;
  onAddOutreach: () => void;
}

export function DashboardHeader({ onAddContact, onAddOutreach }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">REL8 Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Track and manage your professional relationships
        </p>
      </div>
      <div className="flex mt-4 md:mt-0 gap-2">
        <Button variant="outline" onClick={onAddContact}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
        <Button onClick={onAddOutreach}>
          <Plus className="mr-2 h-4 w-4" />
          Build a Relationship
        </Button>
      </div>
    </div>
  );
}
