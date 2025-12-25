import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Users, ArrowRight } from "lucide-react";

export function Actv8EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Zap className="h-10 w-10 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">No Active Contacts Yet</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Actv8 helps you intentionally develop your professional relationships. 
        Activate contacts to track your progress and build stronger connections.
      </p>

      <div className="glass-card p-6 max-w-md mb-8">
        <h3 className="font-semibold mb-3">How Actv8 Works</h3>
        <ol className="text-sm text-left space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">1</span>
            <span>Choose a contact from your network to activate</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">2</span>
            <span>Select a development path that fits your relationship goals</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">3</span>
            <span>Follow guided steps to strengthen your connection over time</span>
          </li>
        </ol>
      </div>

      <Link to="/rel8/contacts">
        <Button className="gap-2">
          <Users className="h-4 w-4" />
          Browse Contacts
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
