
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { TriggerManagement } from "@/components/rel8t/TriggerManagement";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";

const Settings = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your relationship management</p>
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
