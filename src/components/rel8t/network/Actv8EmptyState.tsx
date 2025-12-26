import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Users, ArrowRight, Sparkles } from "lucide-react";

export function Actv8EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="empty-state-icon mb-6">
        <Zap className="h-10 w-10 text-primary" />
      </div>
      
      {/* Title */}
      <h2 className="text-xl font-bold mb-2">Start Building Relationships</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        Actv8 helps you intentionally develop your professional connections with guided steps.
      </p>

      {/* How it works - Material card style */}
      <div className="md-surface-1 p-5 max-w-sm w-full mb-6">
        <h3 className="font-semibold text-sm mb-4 text-left flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          How it works
        </h3>
        <div className="space-y-4">
          <div className="settings-item p-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
              1
            </div>
            <p className="text-sm text-left">Choose contacts to activate</p>
          </div>
          <div className="settings-item p-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
              2
            </div>
            <p className="text-sm text-left">Pick a development path</p>
          </div>
          <div className="settings-item p-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
              3
            </div>
            <p className="text-sm text-left">Follow guided touchpoints</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link to="/rel8/contacts">
        <Button className="rounded-xl gap-2 h-12 px-6">
          <Users className="h-5 w-5" />
          Browse Contacts
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
