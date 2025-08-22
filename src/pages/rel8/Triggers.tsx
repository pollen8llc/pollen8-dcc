import Navbar from "@/components/Navbar";
import { TriggerManagement } from "@/components/rel8t/TriggerManagement";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const Triggers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Triggers</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Configure your automation triggers</p>
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

export default Triggers;