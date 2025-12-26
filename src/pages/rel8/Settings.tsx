import { TriggerManagement } from "@/components/rel8t/TriggerManagement";
import { Rel8Header } from "@/components/rel8t/Rel8Header";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8 pb-32 space-y-6">
        
        <div className="flex items-center gap-3 mb-6 mt-6">
          <div>
            <p className="text-sm text-muted-foreground">Configure your automation triggers</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <TriggerManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;