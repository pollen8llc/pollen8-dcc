import { TriggerManagement } from "@/components/rel8t/TriggerManagement";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const Triggers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation Component */}
        <Rel8OnlyNavigation />
        
        <div className="mt-8">
          <TriggerManagement />
        </div>
      </div>
    </div>
  );
};

export default Triggers;