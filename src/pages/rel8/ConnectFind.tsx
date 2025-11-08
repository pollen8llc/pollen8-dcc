import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import Contacts from "./Contacts";

const ConnectFind = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex items-center justify-between mb-6 mt-6">
          <div>
            <h1 className="text-2xl font-bold">Find Contacts</h1>
            <p className="text-sm text-muted-foreground">
              Search and browse your contact network
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/rel8/connect')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Connect
          </Button>
        </div>

        <Contacts />
      </div>
    </div>
  );
};

export default ConnectFind;
